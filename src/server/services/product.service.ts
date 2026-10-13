import { getPayload } from "payload";
import configPromise from "@payload-config";
import { ProductItem, CategoryItem } from "@/types";

async function getPayloadClient() {
  try {
    return await getPayload({ config: configPromise });
  } catch (err) {
    console.warn("Payload getPayload error:", err);
    return null;
  }
}

// Slug eşleştirmeleri ve yönlendirmeleri (varsa eski linkler için)
const SLUG_ALIASES: Record<string, string> = {
  "sef-bicaklari-ve-satirlar": "sef-bicaklari",
  "sarj-ve-guc-cozumleri": "sarj-cihazlari",
  "kamp-ve-outdoor-aydinlatma": "kamp-fenerleri",
  "wireless-hoparlor-ve-ses": "kamp-fenerleri",
};

function resolveMediaUrl(imgObj: any): string | null {
  if (!imgObj) return null;
  if (typeof imgObj === "string") {
    return imgObj.startsWith("/api/media/file/") ? imgObj.replace("/api/media/file/", "/uploads/") : imgObj;
  }
  if (typeof imgObj === "object") {
    if (imgObj.filename) return `/uploads/${imgObj.filename}`;
    if (imgObj.url) {
      return imgObj.url.startsWith("/api/media/file/") ? imgObj.url.replace("/api/media/file/", "/uploads/") : imgObj.url;
    }
  }
  return null;
}

export class ProductService {
  /**
   * Tüm kategorileri sıralı şekilde getirir (Sadece Payload DB)
   */
  static async getCategories(): Promise<CategoryItem[]> {
    try {
      const payload = await getPayloadClient();
      if (payload) {
        const res = await payload.find({
          collection: "categories",
          limit: 100,
          sort: "order",
          overrideAccess: true,
        });
        if (res.docs.length > 0) {
          return res.docs.map((c: any, index: number) => ({
            id: String(c.id),
            name: c.name,
            slug: c.slug,
            description: c.description || null,
            image: resolveMediaUrl(c.image) || "/images/logo.jpg",
            parentId: null,
            order: typeof c.order === "number" ? c.order : index,
          }));
        }
      }
    } catch (err) {
      console.warn("Payload getCategories error:", err);
    }
    return [];
  }

  /**
   * Slug ile kategori getirir (Sadece Payload DB)
   */
  static async getCategoryBySlug(slug: string): Promise<CategoryItem | null> {
    const targetSlug = SLUG_ALIASES[slug] || slug;
    try {
      const payload = await getPayloadClient();
      if (payload) {
        let res = await payload.find({
          collection: "categories",
          where: { slug: { equals: targetSlug } },
          limit: 1,
          overrideAccess: true,
        });

        if (res.docs.length === 0 && targetSlug !== slug) {
          res = await payload.find({
            collection: "categories",
            where: { slug: { equals: slug } },
            limit: 1,
            overrideAccess: true,
          });
        }

        if (res.docs.length > 0) {
          const c: any = res.docs[0];
          return {
            id: String(c.id),
            name: c.name,
            slug: c.slug,
            description: c.description || null,
            image: resolveMediaUrl(c.image) || "/images/logo.jpg",
            parentId: null,
            order: typeof c.order === "number" ? c.order : 0,
          };
        }
      }
    } catch (err) {
      console.warn("Payload getCategoryBySlug error:", err);
    }

    return null;
  }

  /**
   * Filtrelenebilir ürün listesi (kategori, arama, sıralama)
   * Yalnızca Payload CMS'ten eklenmiş gerçek ürünleri çeker.
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
      if (!payload) return [];

      const where: any = {
        status: { equals: "active" },
      };

      if (params?.categorySlug) {
        const targetSlug = SLUG_ALIASES[params.categorySlug] || params.categorySlug;
        let catRes = await payload.find({
          collection: "categories",
          where: { slug: { equals: targetSlug } },
          limit: 1,
          overrideAccess: true,
        });

        if (catRes.docs.length === 0 && targetSlug !== params.categorySlug) {
          catRes = await payload.find({
            collection: "categories",
            where: { slug: { equals: params.categorySlug } },
            limit: 1,
            overrideAccess: true,
          });
        }

        if (catRes.docs.length > 0) {
          where.category = { equals: catRes.docs[0].id };
        } else {
          return [];
        }
      }

      const res = await payload.find({
        collection: "products",
        where,
        limit: 100,
        depth: 2,
        overrideAccess: true,
      });

      if (!res.docs || res.docs.length === 0) {
        return [];
      }

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
            const img = imgObj?.image;
            const url = resolveMediaUrl(img);
            if (url) {
              images.push({
                id: String(img?.id || idx),
                url,
                altText: img?.alt || p.name,
              });
            }
          });
        }

        if (p.imageUrl) {
          const cleanUrl = resolveMediaUrl(p.imageUrl);
          if (cleanUrl) {
            images.unshift({
              id: `img-${p.id}`,
              url: cleanUrl,
              altText: p.name,
            });
          }
        }

        if (images.length === 0) {
          images.push({
            id: "default-img",
            url: "/images/logo.jpg",
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
    } catch (err) {
      console.warn("Payload getProducts error:", err);
      return [];
    }
  }

  /**
   * Slug ile tek ürün detayı getirir (Yalnızca Payload DB)
   */
  static async getProductBySlug(slug: string): Promise<ProductItem | null> {
    try {
      const payload = await getPayloadClient();
      if (!payload) return null;

      const res = await payload.find({
        collection: "products",
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
        overrideAccess: true,
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
            const img = imgObj?.image;
            const url = resolveMediaUrl(img);
            if (url) {
              images.push({
                id: String(img?.id || idx),
                url,
                altText: img?.alt || p.name,
              });
            }
          });
        }
        if (p.imageUrl) {
          const cleanUrl = resolveMediaUrl(p.imageUrl);
          if (cleanUrl) {
            images.unshift({
              id: `img-${p.id}`,
              url: cleanUrl,
              altText: p.name,
            });
          }
        }

        if (images.length === 0) {
          images.push({
            id: "default-img",
            url: "/images/logo.jpg",
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
    } catch (err) {
      console.warn("Payload getProductBySlug error:", err);
    }

    return null;
  }

  /**
   * Öne çıkan ürünleri getirir (Yalnızca Payload DB)
   */
  static async getFeaturedProducts(): Promise<ProductItem[]> {
    const products = await this.getProducts({ sort: "featured" });
    const featuredOnly = products.filter((p) => p.isFeatured);
    return featuredOnly.length > 0 ? featuredOnly : products;
  }
}
