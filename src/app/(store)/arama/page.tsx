import Link from "next/link";
import { ProductService } from "@/server/services/product.service";
import { ProductCard } from "@/components/shop/ProductCard";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    cat?: string;
    sort?: "price-asc" | "price-desc" | "newest" | "featured";
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, cat, sort } = await searchParams;

  const categories = await ProductService.getCategories();
  const products = await ProductService.getProducts({
    search: q,
    categorySlug: cat,
    sort,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
          {q ? `"${q}" için Arama Sonuçları` : "Tüm Ürünler"}
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Toplam {products.length} ürün listeleniyor
        </p>
      </div>

      {/* Kategori Hapları */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href={`/arama${q ? `?q=${q}` : ""}`}
          className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all ${
            !cat
              ? "border-amber-500 bg-amber-500/10 text-amber-400"
              : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
          }`}
        >
          Tümü
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/arama?cat=${c.slug}${q ? `&q=${q}` : ""}`}
            className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all ${
              cat === c.slug
                ? "border-amber-500 bg-amber-500/10 text-amber-400"
                : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Ürün Listesi */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0e1320] py-16 text-center">
          <p className="text-sm font-semibold text-white">Aradığınız kriterlere uygun ürün bulunamadı.</p>
          <p className="mt-1 text-xs text-slate-400">
            Farklı anahtar kelimeler deneyebilir veya tüm kategorilere göz atabilirsiniz.
          </p>
          <Link
            href="/arama"
            className="mt-4 inline-block rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950"
          >
            Tüm Kataloğu Gör
          </Link>
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
