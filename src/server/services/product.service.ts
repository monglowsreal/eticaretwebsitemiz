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
   */
  static async getProducts(params?: {
    categorySlug?: string;
    search?: string;
    sort?: "price-asc" | "price-desc" | "newest" | "featured";
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ProductItem[]> {
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
   * Slug ile tek ürün detayı getirir
   */
  static async getProductBySlug(slug: string): Promise<ProductItem | null> {
    const item = PRODUCTS.find((p) => p.slug === slug);
    return item || null;
  }

  /**
   * Öne çıkan ürünleri getirir
   */
  static async getFeaturedProducts(): Promise<ProductItem[]> {
    return PRODUCTS.filter((p) => p.isFeatured);
  }
}
