import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductService } from "@/server/services/product.service";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    return { title: "Ürün Bulunamadı | Sarıyıldız" };
  }

  return {
    title: `${product.name} | Sarıyıldız`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [{ url: product.images[0]?.url || "/images/logo.jpg" }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // JSON-LD Yapılandırılmış Veri (Şartname Madde 5.3 ve 11)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => img.url),
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand || "Sarıyıldız",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: (product.variants[0]?.price || 0) / 100,
      availability:
        (product.variants[0]?.stock || 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
