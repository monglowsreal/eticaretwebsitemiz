import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductService } from "@/server/services/product.service";
import { ProductCard } from "@/components/shop/ProductCard";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: "price-asc" | "price-desc" | "newest" | "featured" }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const category = await ProductService.getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const products = await ProductService.getProducts({
    categorySlug: slug,
    sort,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400">
          Ana Sayfa
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-semibold text-white">{category.name}</span>
      </nav>

      {/* Kategori Başlığı ve Açıklaması */}
      <div className="mb-8 rounded-2xl border border-slate-800 bg-[#0e1320] p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            {category.description}
          </p>
        )}
      </div>

      {/* Filtre ve Ürün Sayısı */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 text-xs text-slate-400">
        <span>Toplam {products.length} ürün listeleniyor</span>

        <div className="flex items-center gap-2">
          <span>Sırala:</span>
          <div className="flex gap-1.5">
            <Link
              href={`/kategori/${slug}?sort=featured`}
              className={`rounded-lg border px-3 py-1.5 transition-colors ${
                !sort || sort === "featured"
                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                  : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
              }`}
            >
              Öne Çıkan
            </Link>
            <Link
              href={`/kategori/${slug}?sort=price-asc`}
              className={`rounded-lg border px-3 py-1.5 transition-colors ${
                sort === "price-asc"
                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                  : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
              }`}
            >
              En Düşük Fiyat
            </Link>
            <Link
              href={`/kategori/${slug}?sort=price-desc`}
              className={`rounded-lg border px-3 py-1.5 transition-colors ${
                sort === "price-desc"
                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                  : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
              }`}
            >
              En Yüksek Fiyat
            </Link>
          </div>
        </div>
      </div>

      {/* Ürün Izgarası */}
      {products.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <p>Bu kategoride henüz ürün bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
