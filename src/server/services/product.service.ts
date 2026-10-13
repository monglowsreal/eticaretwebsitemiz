import { getPayload } from "payload";
import configPromise from "@payload-config";
import { PRODUCTS, CATEGORIES } from "@/lib/mock-data";
import { ProductItem, CategoryItem } from "@/types";

async function getPayloadClient() {
  try {
    return await getPayload({ config: configPromise });
  } catch (err) {
    console.warn("Payload getPayload error:", err);
    return null;
  }
}

export class ProductService {
  /**
   * Tüm kategorileri sıralı şekilde getirir
   */
  static async getCategories(): Promise<CategoryItem[]> {
    try {
      const payload = await getPayloadClient();
      if (payload) {
        const res = await payload.find({
          collection: "categories",
          limit: 100,
        });
        if (res.docs.length > 0) {
          return res.docs.map((c: any, index: number) => ({
            id: String(c.id),
            name: c.name,
            slug: c.slug,
            description: c.description || null,
            image: c.image ? (typeof c.image === "object" ? c.image.url : null) : null,
            parentId: null,
            order: index,
          }));
        }
      }
    } catch {
      // Payload hazır değilse mock veriye düşer
    }
    return CATEGORIES;
  }

  /**
   * Slug ile kategori getirir
   */
  static async getCategoryBySlug(slug: string): Promise<CategoryItem | null> {
    try {
      const payload = await getPayloadClient();
      if (payload) {
        const res = await payload.find({
          collection: "categories",
          where: { slug: { equals: slug } },
          limit: 1,
        });
        if (res.docs.length > 0) {
          const c: any = res.docs[0];
          return {
            id: String(c.id),
            name: c.name,
            slug: c.slug,
            description: c.description || null,
            image: c.image ? (typeof c.image === "object" ? c.image.url : null) : null,
            parentId: null,
            order: 0,
          };
        }
      }
    } catch {}

    return CATEGORIES.find((c) => c.slug === slug) || null;
  }

  /**
   * Filtrelenebilir ürün listesi (kategori, arama, sıralama)
   * Payload CMS'ten gerçek ürünleri çeker, kayıt yoksa mock veriye düşer.
   */
  static async getProducts(params?: {
    categorySlug?: string;
    search?: string;
    sort?: "price-asc" | "price-desc" | "newest" | "featured";
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ProductItem[]> {
    try {
      const payload = await getPayloadClient();
      if (payload) {
        const where: any = {
          status: { equals: "active" },
        };
        if (params?.categorySlug) {
          where["category.slug"] = { equals: params.categorySlug };
        }

        const res = await payload.find({
          collection: "products",
          where,
          limit: 100,
          depth: 2,
        });

        if (res.docs.length > 0) {
          let items: ProductItem[] = res.docs.map((p: any) => {
            const cat = typeof p.category === "object" && p.category !== null ? p.category : null;
            const categoryItem: CategoryItem = {
              id: cat?.id ? String(cat.id) : "cat-default",
              name: cat?.name || "Genel",
              slug: cat?.slug || "genel",
              order: 0,
            };

            const images: { id: string; url: string; altText?: string | null }[] = [];
            if (Array.isArray(p.images)) {
              p.images.forEach((imgObj: any, idx: number) => {
                const img = imgObj.image;
                if (img && typeof img === "object" && img.url) {
                  images.push({
                    id: String(img.id || idx),
                    url: img.url,
                    altText: img.alt || p.name,
                  });
                }
              });
            }

            if (p.imageUrl) {
              images.unshift({
                id: `img-${p.id}`,
                url: p.imageUrl,
                altText: p.name,
              });
            }

            if (images.length === 0) {
              images.push({
                id: "default-img",
                url: "/images/products/santoku-knife.png",
                altText: p.name,
              });
            }

            return {
              id: String(p.id),
              name: p.name,
              slug: p.slug,
              description: p.description || "",
              brand: p.brand || "Sarıyıldız",
              category: categoryItem,
              variants: [
                {
                  id: `var-${p.id}`,
                  sku: p.sku || `SY-${p.id}`,
                  name: `${p.name} Standart`,
                  price: p.price,
                  compareAtPrice: p.compareAtPrice || null,
                  stock: p.stock ?? 0,
                },
              ],
              images,
              isFeatured: Boolean(p.isFeatured),
            };
          });

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
      }
    } catch (err) {
      console.warn("Payload getProducts error, falling back to mock:", err);
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
   * Slug ile tek ürün detayı getirir (Payload CMS öncelikli)
   */
  static async getProductBySlug(slug: string): Promise<ProductItem | null> {
    try {
      const payload = await getPayloadClient();
      if (payload) {
        const res = await payload.find({
          collection: "products",
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 2,
        });

        if (res.docs.length > 0) {
          const p: any = res.docs[0];
          const cat = typeof p.category === "object" && p.category !== null ? p.category : null;
          const categoryItem: CategoryItem = {
            id: cat?.id ? String(cat.id) : "cat-default",
            name: cat?.name || "Genel",
            slug: cat?.slug || "genel",
            order: 0,
          };

          const images: { id: string; url: string; altText?: string | null }[] = [];
          if (Array.isArray(p.images)) {
            p.images.forEach((imgObj: any, idx: number) => {
              const img = imgObj.image;
              if (img && typeof img === "object" && img.url) {
                images.push({
                  id: String(img.id || idx),
                  url: img.url,
                  altText: img.alt || p.name,
                });
              }
            });
          }
          if (p.imageUrl) {
            images.unshift({
              id: `img-${p.id}`,
              url: p.imageUrl,
              altText: p.name,
            });
          }

          if (images.length === 0) {
            images.push({
              id: "default-img",
              url: "/images/products/santoku-knife.png",
              altText: p.name,
            });
          }

          return {
            id: String(p.id),
            name: p.name,
            slug: p.slug,
            description: p.description || "",
            brand: p.brand || "Sarıyıldız",
            category: categoryItem,
            variants: [
              {
                id: `var-${p.id}`,
                sku: p.sku || `SY-${p.id}`,
                name: `${p.name} Standart`,
                price: p.price,
                compareAtPrice: p.compareAtPrice || null,
                stock: p.stock ?? 0,
              },
            ],
            images,
            isFeatured: Boolean(p.isFeatured),
          };
        }
      }
    } catch (err) {
      console.warn("Payload getProductBySlug error:", err);
    }

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
