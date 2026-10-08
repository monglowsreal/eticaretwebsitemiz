import { PrismaClient, Role, ProductStatus, CouponType } from "@prisma/client";
import { CATEGORIES, PRODUCTS } from "../src/lib/mock-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Sarıyıldız veritabanı tohumlama (seed) başlatılıyor...");

  // 1. Admin ve Örnek Müşteri Kullanıcıları
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@sariyildiz.com" },
    update: {},
    create: {
      email: "admin@sariyildiz.com",
      firstName: "Sarıyıldız",
      lastName: "Yönetici",
      role: Role.ADMIN,
      phone: "05550000000",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Admin kullanıcısı hazır:", adminUser.email);

  const demoCustomer = await prisma.user.upsert({
    where: { email: "musteri@sariyildiz.com" },
    update: {},
    create: {
      email: "musteri@sariyildiz.com",
      firstName: "Ahmet",
      lastName: "Yılmaz",
      role: Role.CUSTOMER,
      phone: "05321112233",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Demo müşteri hazır:", demoCustomer.email);

  // 2. Kategoriler
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        order: cat.order,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        order: cat.order,
      },
    });
  }
  console.log(`✅ ${CATEGORIES.length} kategori eklendi.`);

  // 3. Ürünler, Görseller ve Varyantlar
  for (const prod of PRODUCTS) {
    const existing = await prisma.product.findUnique({
      where: { slug: prod.slug },
    });

    if (!existing) {
      await prisma.product.create({
        data: {
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          brand: prod.brand || "Sarıyıldız",
          categoryId: prod.category.id,
          status: ProductStatus.ACTIVE,
          isFeatured: prod.isFeatured || false,
          images: {
            create: prod.images.map((img, idx) => ({
              url: img.url,
              altText: img.altText || prod.name,
              order: idx,
            })),
          },
          variants: {
            create: prod.variants.map((v) => ({
              sku: v.sku,
              name: v.name,
              price: v.price,
              compareAtPrice: v.compareAtPrice,
              stock: v.stock,
              attributes: v.attributes || {},
            })),
          },
        },
      });
    }
  }
  console.log(`✅ ${PRODUCTS.length} ürün ve varyantları eklendi.`);

  // 4. Kuponlar
  await prisma.coupon.upsert({
    where: { code: "YILDIZ10" },
    update: {},
    create: {
      code: "YILDIZ10",
      discountType: CouponType.PERCENTAGE,
      value: 10, // %10 indirim
      minOrderAmount: 25000, // 250 TL asgari
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 gün geçerli
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "HOSGELDIN50" },
    update: {},
    create: {
      code: "HOSGELDIN50",
      discountType: CouponType.FIXED,
      value: 5000, // 50 TL sabit indirim
      minOrderAmount: 50000, // 500 TL asgari
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });
  console.log("✅ Örnek indirim kuponları eklendi (YILDIZ10, HOSGELDIN50).");

  // 5. Temel Site Ayarları
  const settings = [
    { key: "SITE_TITLE", value: "Sarıyıldız | Profesyonel Bıçaklar, Outdoor ve Teknoloji" },
    { key: "FREE_SHIPPING_THRESHOLD", value: "50000" }, // 500 TL
    { key: "DEFAULT_SHIPPING_FEE", value: "4990" }, // 49.90 TL
    { key: "CONTACT_EMAIL", value: "destek@sariyildiz.com" },
    { key: "CONTACT_PHONE", value: "+90 850 123 45 67" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log("✅ Site ayarları yüklendi.");
  console.log("🎉 Seed işlemi başarıyla tamamlandı!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
