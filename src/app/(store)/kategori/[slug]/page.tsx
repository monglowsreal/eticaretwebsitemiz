import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Sparkles, SlidersHorizontal, ArrowLeft } from "lucide-react";
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition-colors">
          Ana Sayfa
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
        <span className="font-semibold text-amber-400">{category.name}</span>
      </nav>

      {/* Lüks Kategori Başlığı ve Atmosferik Banner */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-[#0e1422] via-[#131929] to-[#0a0e17] p-8 sm:p-10 shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-500/10 blur-[90px]" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="h-3 w-3" /> Sarıyıldız Özel Koleksiyonu
            </div>
            <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-2.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
                {category.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-xs font-mono text-slate-300">
            <span>Toplam Ürün:</span>
            <strong className="text-amber-400 text-sm">{products.length} Adet</strong>
          </div>
        </div>
      </div>

      {/* Sıralama ve Filtre Barı */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-[#0b101b] px-5 py-3.5 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <SlidersHorizontal className="h-4 w-4 text-amber-400" />
          <span>
            <strong className="text-white">{category.name}</strong> reyonunda{" "}
            <strong className="text-amber-400">{products.length}</strong> aktif ürün listeleniyor
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 mr-1">Sıralama:</span>
          <Link
            href={`/kategori/${slug}?sort=featured`}
            className={`rounded-xl border px-3.5 py-1.5 font-semibold transition-all ${
              !sort || sort === "featured"
                ? "border-amber-500/60 bg-amber-500/15 text-amber-300 shadow-sm"
                : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white"
            }`}
          >
            Öne Çıkanlar
          </Link>
          <Link
            href={`/kategori/${slug}?sort=price-asc`}
            className={`rounded-xl border px-3.5 py-1.5 font-semibold transition-all ${
              sort === "price-asc"
                ? "border-amber-500/60 bg-amber-500/15 text-amber-300 shadow-sm"
                : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white"
            }`}
          >
            En Düşük Fiyat
          </Link>
          <Link
            href={`/kategori/${slug}?sort=price-desc`}
            className={`rounded-xl border px-3.5 py-1.5 font-semibold transition-all ${
              sort === "price-desc"
                ? "border-amber-500/60 bg-amber-500/15 text-amber-300 shadow-sm"
                : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white"
            }`}
          >
            En Yüksek Fiyat
          </Link>
        </div>
      </div>

      {/* Ürün Izgarası */}
      {products.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-[#0d121d] py-16 px-4 text-center">
          <p className="text-base font-bold text-white">
            Bu kategoride henüz ürün bulunmamaktadır.
          </p>
          <p className="mt-1.5 text-xs text-slate-400">
            Diğer koleksiyonlarımızı inceleyebilir veya yönetim panelinden bu kategoriye yeni ürün ekleyebilirsiniz.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:border-amber-500/50 hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Ana Sayfaya Dön</span>
            </Link>
            <Link
              href="/arama"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
            >
              <span>Tüm Ürünleri Gör</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
