import { db } from "@/lib/db";
import { PRODUCTS, CATEGORIES } from "@/lib/mock-data";
import { ProductItem, CategoryItem } from "@/types";

export class ProductService {
  /**
   * Tüm kategorileri sıralı şekilde getirir
   */
  static async getCategories(): Promise<CategoryItem[]> {
    try {
      const dbCategories = await db.category.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      });
      if (dbCategories.length > 0) {
        return dbCategories;
      }
    } catch {
      // DB hazır değilse mock veriye düşer
    }
    return CATEGORIES;
  }

  /**
   * Slug ile kategori getirir
   */
  static async getCategoryBySlug(slug: string): Promise<CategoryItem | null> {
    try {
      const cat = await db.category.findUnique({
        where: { slug },
      });
      if (cat) return cat;
    } catch {}

    return CATEGORIES.find((c) => c.slug === slug) || null;
  }

  /**
   * Filtrelenebilir ürün listesi (kategori, arama, sıralama)
   * Veritabanından gerçek ürünleri çeker, bağlantı yoksa mock veriye düşer.
   */
  static async getProducts(params?: {
    categorySlug?: string;
    search?: string;
    sort?: "price-asc" | "price-desc" | "newest" | "featured";
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ProductItem[]> {
    try {
      const dbProducts = await db.product.findMany({
        where: {
          status: "ACTIVE",
          ...(params?.categorySlug ? { category: { slug: params.categorySlug } } : {}),
        },
        include: {
          category: true,
          images: { orderBy: { order: "asc" } },
          variants: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (dbProducts.length > 0) {
        let items: ProductItem[] = dbProducts.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          brand: p.brand,
          category: p.category,
          variants: p.variants.map((v) => ({
            id: v.id,
            sku: v.sku,
            name: v.name,
            attributes: (v.attributes as Record<string, string>) || null,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            stock: v.stock,
          })),
          images: p.images.map((img) => ({
            id: img.id,
            url: img.url,
            altText: img.altText,
          })),
          isFeatured: p.isFeatured,
        }));

        if (params?.search) {
          const q = params.search.toLowerCase().trim();
          items = items.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.category.name.toLowerCase().includes(q)
          );
        }

        if (params?.minPrice !== undefined) {
          items = items.filter((p) => (p.variants[0]?.price ?? 0) >= (params.minPrice ?? 0));
        }

        if (params?.maxPrice !== undefined) {
          items = items.filter((p) => (p.variants[0]?.price ?? 0) <= (params.maxPrice ?? 0));
        }

        if (params?.sort === "price-asc") {
          items.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0));
        } else if (params?.sort === "price-desc") {
          items.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0));
        } else if (params?.sort === "featured") {
          items.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        }

        return items;
      }
    } catch (err) {
      console.warn("DB getProducts hatası, mock verilere başvuruluyor:", err);
    }

    // Mock veri yedeği
    let items = [...PRODUCTS];

    if (params?.categorySlug) {
      items = items.filter((p) => p.category.slug === params.categorySlug);
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q)
      );
    }

    if (params?.minPrice !== undefined) {
      items = items.filter((p) => (p.variants[0]?.price ?? 0) >= (params.minPrice ?? 0));
    }

    if (params?.maxPrice !== undefined) {
      items = items.filter((p) => (p.variants[0]?.price ?? 0) <= (params.maxPrice ?? 0));
    }

    if (params?.sort === "price-asc") {
      items.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0));
    } else if (params?.sort === "price-desc") {
      items.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0));
    } else if (params?.sort === "featured") {
      items.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return items;
  }

  /**
   * Slug ile tek ürün detayı getirir (DB öncelikli)
   */
  static async getProductBySlug(slug: string): Promise<ProductItem | null> {
    try {
      const p = await db.product.findUnique({
        where: { slug },
        include: {
          category: true,
          images: { orderBy: { order: "asc" } },
          variants: true,
        },
      });

      if (p) {
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          brand: p.brand,
          category: p.category,
          variants: p.variants.map((v) => ({
            id: v.id,
            sku: v.sku,
            name: v.name,
            attributes: (v.attributes as Record<string, string>) || null,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            stock: v.stock,
          })),
          images: p.images.map((img) => ({
            id: img.id,
            url: img.url,
            altText: img.altText,
          })),
          isFeatured: p.isFeatured,
        };
      }
    } catch {}

    const item = PRODUCTS.find((p) => p.slug === slug);
    return item || null;
  }

  /**
   * Öne çıkan ürünleri getirir
   */
  static async getFeaturedProducts(): Promise<ProductItem[]> {
    return this.getProducts({ sort: "featured" });
  }
}
