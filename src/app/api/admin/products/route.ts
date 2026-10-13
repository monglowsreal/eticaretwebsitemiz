import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

const CATEGORY_NAMES: Record<string, string> = {
  "sef-bicaklari": "Mutfak & Şef Bıçakları",
  "sarj-cihazlari": "Elektronik & Şarj Cihazları",
  "kamp-fenerleri": "Outdoor & Kamp Fenerleri",
  "hoparlorler": "Ses & Bluetooth Hoparlörler",
  genel: "Genel Ürünler",
};

async function getOrCreateCategory(payload: any, slug: string): Promise<string | number> {
  const targetSlug = slug || "genel";

  // 1. İstenen slug ile ara
  const found = await payload.find({
    collection: "categories",
    where: { slug: { equals: targetSlug } },
    limit: 1,
  });
  if (found.docs.length > 0) {
    return found.docs[0].id;
  }

  // 2. İstenen slug ile yeni kategori oluştur
  try {
    const created = await payload.create({
      collection: "categories",
      data: {
        name: CATEGORY_NAMES[targetSlug] || targetSlug,
        slug: targetSlug,
        description: `${CATEGORY_NAMES[targetSlug] || targetSlug} kategorisi`,
      },
      overrideAccess: true,
    });
    return created.id;
  } catch {
    // 3. Eğer kategori zaten varsa ilk mevcut kategoriyi al
    const anyCat = await payload.find({
      collection: "categories",
      limit: 1,
    });
    if (anyCat.docs.length > 0) {
      return anyCat.docs[0].id;
    }
  }

  // 4. Benzersiz slug ile fallback kategori
  const fallback = await payload.create({
    collection: "categories",
    data: {
      name: "Genel",
      slug: `cat-${Date.now()}`,
    },
    overrideAccess: true,
  });
  return fallback.id;
}

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });
    const products = await payload.find({
      collection: "products",
      limit: 100,
      depth: 2,
    });

    return NextResponse.json({ success: true, products: products.docs });
  } catch (error: any) {
    console.error("Ürün listeleme hatası:", error);
    return NextResponse.json(
      { error: "Ürünler listelenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      name,
      slug,
      categorySlug,
      brand = "Sarıyıldız",
      price,
      compareAtPrice,
      sku,
      stock = 20,
      description,
      isFeatured = false,
      imageUrl,
    } = data;

    if (!name || !slug || !price) {
      return NextResponse.json(
        { error: "Ürün adı, slug ve fiyat zorunludur." },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });

    // 1. Kategoriyi bul veya akıllıca oluştur
    const categoryId = await getOrCreateCategory(payload, categorySlug);

    // 2. Slug çakışmasını engelle
    let finalSlug = slug;
    const existing = await payload.find({
      collection: "products",
      where: { slug: { equals: slug } },
      limit: 1,
    });
    if (existing.docs.length > 0) {
      finalSlug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    // 3. Payload CMS Products koleksiyonuna kaydet
    const newProduct = await payload.create({
      collection: "products",
      data: {
        name,
        slug: finalSlug,
        brand,
        category: categoryId,
        status: "active",
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        stock: Number(stock) || 0,
        sku: sku || `SY-${Date.now().toString().slice(-6)}`,
        isFeatured: Boolean(isFeatured),
        description: description || name,
        imageUrl: imageUrl || undefined,
      },
      overrideAccess: true,
    });

    return NextResponse.json({
      success: true,
      product: newProduct,
    });
  } catch (error: any) {
    console.error("Payload ürün oluşturma hatası:", error);
    return NextResponse.json(
      { error: error?.message || "Ürün kaydedilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
