import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Shield, Zap, Award, Flame } from "lucide-react";
import { ProductService } from "@/server/services/product.service";
import { ProductCard } from "@/components/shop/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await ProductService.getCategories();
  const featuredProducts = await ProductService.getFeaturedProducts();

  return (
    <div className="flex flex-col gap-12 pb-16 md:gap-16">
      {/* 1. HERO BÖLÜMÜ */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-[#0e1422] to-[#0b0f17] py-16 md:py-24">
        {/* Arka plan altın ışıltıları */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 transform">
          <div className="h-96 w-[600px] rounded-full bg-amber-500/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Sol: Metin & CTA */}
            <div className="flex flex-col items-start space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-400">
                <Sparkles className="h-4 w-4" />
                <span>Usta Zanaatı & Yeni Nesil Teknoloji</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Keskin Ustalık,{" "}
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                  Güçlü Teknoloji
                </span>
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Sarıyıldız ile mutfakta profesyonel şeflerin gücünü keşfedin; açık havada ve günlük hayatınızda GaN hızlı şarj, solar aydınlatma ve su geçirmez kablosuz ses deneyiminin keyfini çıkarın.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/kategori/sef-bicaklari-ve-satirlar"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg hover:from-amber-400 hover:to-yellow-400 transition-all gold-glow"
                >
                  <span>Şef Bıçaklarını Keşfet</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/arama"
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-white hover:border-slate-500 hover:bg-slate-800 transition-all"
                >
                  <span>Tüm Koleksiyon</span>
                </Link>
              </div>

              {/* Hızlı Güven Simgeleri */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <span>Dövme Çelik Kalitesi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <span>GaN Hızlı Şarj</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <span>Koşulsuz 14 Gün İade</span>
                </div>
              </div>
            </div>

            {/* Sağ: Marka Banner & Görsel Kompozisyonu */}
            <div className="relative flex justify-center lg:justify-end" style={{ position: "relative" }}>
              <div
                className="relative h-72 w-72 sm:h-88 sm:w-88 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-black to-slate-950 p-6 shadow-2xl gold-glow flex items-center justify-center"
                style={{ position: "relative" }}
              >
                <Image
                  src="/images/logo.jpg"
                  alt="Sarıyıldız Marka"
                  width={300}
                  height={300}
                  className="object-contain rounded-2xl max-w-full h-auto drop-shadow-2xl"
                  priority
                />
                <div
                  className="absolute -bottom-4 -left-4 rounded-xl border border-slate-800 bg-slate-900/95 px-4 py-2.5 shadow-xl backdrop-blur"
                  style={{ position: "absolute" }}
                >
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-amber-400" />
                    <div>
                      <p className="text-xs font-bold text-white">500+ Mutlu Müşteri</p>
                      <p className="text-[10px] text-slate-400">4.9 / 5.0 Mükemmel Puan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ÖNE ÇIKAN KATEGORİLER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Kategorilere Göz Atın
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              İhtiyacınıza uygun zengin ürün yelpazesi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/kategori/${cat.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0e131f] transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <Image
                  src={cat.image || "/images/placeholder.jpg"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e131f] via-transparent to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-500">
                  <span>Ürünleri İncele</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. ÖNE ÇIKAN VE ÇOK SATAN ÜRÜNLER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500">
              <Sparkles className="h-3.5 w-3.5" /> Çok Satanlar
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Öne Çıkan Ürünlerimiz
            </h2>
          </div>
          <Link
            href="/arama"
            className="hidden items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 sm:flex"
          >
            <span>Tümünü Gör</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/arama"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white"
          >
            <span>Tüm Ürünleri Gör</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* 4. MARKA VURGUSU & KAMPANYA BANNERI */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-[#121926] p-8 md:p-12">
          <div className="max-w-2xl space-y-4">
            <span className="rounded-md bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400">
              ÖZEL FIRSAT
            </span>
            <h3 className="text-2xl font-extrabold text-white sm:text-4xl">
              İlk Siparişinize Özel <span className="text-amber-400">%10 İndirim</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              Ödeme sayfasında <span className="font-mono font-bold text-amber-400">YILDIZ10</span> kupon kodunu kullanarak 250 TL üzeri sepetinizde %10 anında indirimden yararlanın.
            </p>
            <div className="pt-2">
              <Link
                href="/arama"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
              >
                <span>Hemen Alışverişe Başla</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
