export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  order: number;
}

export interface ProductVariantItem {
  id: string;
  sku: string;
  name?: string | null;
  attributes?: Record<string, string> | null;
  price: number; // Kuruş
  compareAtPrice?: number | null; // Kuruş
  stock: number;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand?: string | null;
  category: CategoryItem;
  variants: ProductVariantItem[];
  images: { id: string; url: string; altText?: string | null }[];
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
}

export interface CartItemType {
  variantId: string;
  productId: string;
  productName: string;
  variantName?: string | null;
  sku: string;
  price: number; // Kuruş
  quantity: number;
  image: string;
  stock: number;
}
