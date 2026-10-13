import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProductStatus } from "@prisma/client";

export async function GET() {
  try {
    const products = await db.product.findMany({
      include: {
        category: true,
        variants: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, products });
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

    // Kategoriyi bul veya varsayılan kategoriye bağla
    let category = await db.category.findUnique({
      where: { slug: categorySlug || "sef-bicaklari" },
    });

    if (!category) {
      // Kategori bulunamazsa ilk kategoriyi al
      const firstCat = await db.category.findFirst();
      if (!firstCat) {
        return NextResponse.json(
          { error: "Veritabanında kayıtlı kategori bulunamadı." },
          { status: 400 }
        );
      }
      category = firstCat;
    }

    // Slug çakışmasını önle
    let finalSlug = slug;
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      finalSlug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    // Ürün, Varyant ve Görseli tek transaction ile oluştur
    const newProduct = await db.product.create({
      data: {
        name,
        slug: finalSlug,
        description: description || name,
        brand,
        categoryId: category.id,
        status: ProductStatus.ACTIVE,
        isFeatured: Boolean(isFeatured),
        variants: {
          create: {
            sku: sku || `SY-${Date.now().toString().slice(-6)}`,
            name: `${name} Standart`,
            price: Number(price),
            compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
            stock: Number(stock) || 0,
          },
        },
        images: {
          create: [
            {
              url:
                imageUrl ||
                "https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=1000&auto=format&fit=crop",
              altText: name,
              order: 0,
            },
          ],
        },
      },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: newProduct,
    });
  } catch (error: any) {
    console.error("Ürün kaydetme hatası:", error);
    return NextResponse.json(
      { error: error?.message || "Ürün kaydedilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
