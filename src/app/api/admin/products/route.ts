import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

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
    } = data;

    if (!name || !slug || !price) {
      return NextResponse.json(
        { error: "Ürün adı, slug ve fiyat zorunludur." },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });

    // 1. Kategoriyi bul veya otomatik oluştur
    let categoryId: string | number | null = null;
    const catRes = await payload.find({
      collection: "categories",
      where: categorySlug ? { slug: { equals: categorySlug } } : {},
      limit: 1,
    });

    if (catRes.docs.length > 0) {
      categoryId = catRes.docs[0].id;
    } else {
      const newCat = await payload.create({
        collection: "categories",
        data: {
          name: "Genel",
          slug: "genel",
          description: "Genel kategorisi",
        },
      });
      categoryId = newCat.id;
    }

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
      },
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
