import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Award,
  Flame,
  CheckCircle2,
  Star,
  Compass,
  Layers,
  Truck,
} from "lucide-react";
import { ProductService } from "@/server/services/product.service";
import { ProductCard } from "@/components/shop/ProductCard";

export const dynamic = "force-dynamic";

// Kategori görseli yoksa gerçek ürün fotoğraflarımızdan eşleştirme
const CATEGORY_COVER_FALLBACKS: Record<string, string> = {
  "sef-bicaklari": "/uploads/X50CrMoV15_Ana_Urun.jpg",
  satirlar: "/uploads/Surmene_Celik_Satir_Ana_Urun.jpg",
  "sarj-cihazlari": "/images/logo.jpg",
  "kamp-fenerleri": "/images/logo.jpg",
};

export default async function HomePage() {
  const categories = await ProductService.getCategories();
  const featuredProducts = await ProductService.getFeaturedProducts();

  // Vitrin görselleri için ilk ürünleri veya yüklenen gerçek görselleri kullan
  const heroPrimaryImage =
    featuredProducts.find((p) => p.slug.includes("surmene"))?.images[0]?.url ||
    featuredProducts[0]?.images[0]?.url ||
    "/uploads/Surmene_Celik_Satir_Ana_Urun.jpg";

  const heroSecondaryImage =
    featuredProducts.find((p) => p.slug.includes("x50"))?.images[0]?.url ||
    featuredProducts[1]?.images[0]?.url ||
    "/uploads/X50CrMoV15_Ana_Urun.jpg";

  return (
    <div className="flex flex-col gap-16 pb-20 md:gap-24">
      {/* 1. MONUMENTAL HERO BÖLÜMÜ */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-[#070a0f] bg-luxury-grid pt-12 pb-20 md:py-24 lg:py-28">
        {/* Arka plan altın ve kehribar ışık katmanları */}
        <div className="pointer-events-none absolute left-1/4 top-0 -translate-x-1/2 transform">
          <div className="h-[420px] w-[680px] rounded-full bg-amber-500/12 blur-[140px]" />
        </div>
        <div className="pointer-events-none absolute right-10 bottom-0">
          <div className="h-[320px] w-[480px] rounded-full bg-yellow-500/8 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Sol: Editorial Metin, Çelik Spekleri & CTA (7 Kolon) */}
            <div className="flex flex-col items-start space-y-6 text-left lg:col-span-7">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-500/35 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent px-4 py-1.5 text-xs font-bold tracking-wider uppercase text-amber-400 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Sürmene & Alman X50CrMoV15 Özel Koleksiyonu</span>
              </div>

              <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.12]">
                Asırlık Zanaat,{" "}
                <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Kusursuz Keskinlik
                </span>
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Karadeniz’in geleneksel el dövmesi Sürmene satırlarından, dünyaca ünlü Alman{" "}
                <span className="font-mono text-amber-300 font-semibold">X50CrMoV15</span> paslanmaz çeliği ve doğal ceviz saplı profesyonel şef bıçaklarına uzanan usta işi koleksiyon.
              </p>

              {/* Aksiyon Butonları */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/kategori/sef-bicaklari"
                  className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 px-7 py-4 text-sm font-extrabold text-slate-950 shadow-xl hover:brightness-110 transition-all gold-glow"
                >
                  <span>Şef Bıçaklarını Keşfet</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </Link>
                <Link
                  href="/kategori/satirlar"
                  className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-slate-900/90 px-6 py-4 text-sm font-bold text-amber-300 hover:border-amber-400 hover:bg-slate-800/90 transition-all"
                >
                  <span>Sürmene Satırlar</span>
                </Link>
                <Link
                  href="/arama"
                  className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-4 text-sm font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-all"
                >
                  <span>Tüm Katalog ({featuredProducts.length})</span>
                </Link>
              </div>

              {/* Teknik Kalite Göstergeleri */}
              <div className="grid w-full grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 sm:gap-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Award className="h-4 w-4 flex-shrink-0" />
                    <span className="font-mono text-sm font-extrabold text-white">58-60 HRC</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Rockwell Çelik Sertliği</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Compass className="h-4 w-4 flex-shrink-0" />
                    <span className="font-mono text-sm font-extrabold text-white">15° V-Edge</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Lazer Hassas Ağız Açımı</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Shield className="h-4 w-4 flex-shrink-0" />
                    <span className="font-mono text-sm font-extrabold text-white">%100 El İşi</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Doğal Ceviz & İşlemeli Sap</span>
                </div>
              </div>
            </div>

            {/* Sağ: Lüks Ürün Vitrin Kompozisyonu (5 Kolon) */}
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Ana Vitrin Kartı */}
                <Link
                  href="/kategori/satirlar"
                  className="group relative block aspect-[4/4.2] w-full overflow-hidden rounded-3xl border border-amber-500/40 bg-[#0d121c] p-2 shadow-2xl gold-glow"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-2xl">
                    <Image
                      src={heroPrimaryImage}
                      alt="Sarıyıldız El Yapımı Sürmene Çelik Satır"
                      fill
                      priority
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070a0f] via-transparent to-transparent opacity-80" />

                    {/* Alt Bilgi Bandı */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                      <div>
                        <span className="inline-block rounded-lg bg-amber-500 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-950">
                          Başyapıt Serisi
                        </span>
                        <h3 className="mt-1.5 text-base font-extrabold text-white group-hover:text-amber-300 transition-colors">
                          Orijinal Sürmene Dövme Satır
                        </h3>
                        <p className="text-xs text-slate-300">
                          Özel İşlemeli Kabza · Ağır Hizmet Çeliği
                        </p>
                      </div>
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-lg group-hover:bg-amber-400 transition-colors">
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Sol Üst Yüzen Rozet: Müşteri Memnuniyeti */}
                <div className="absolute -top-4 -left-4 z-20 hidden rounded-2xl border border-slate-700/80 bg-[#0d1320]/95 px-4 py-3 shadow-2xl backdrop-blur-md sm:flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-extrabold text-white">4.9 / 5.0 Puan</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Profesyonel Şeflerin Tercihi</p>
                  </div>
                </div>

                {/* Sağ Alt Yüzen Mini Kart: X50CrMoV15 Şef Bıçağı */}
                <Link
                  href="/kategori/sef-bicaklari"
                  className="group absolute -bottom-6 -right-4 z-20 hidden w-56 items-center gap-3 rounded-2xl border border-amber-500/30 bg-[#0d1320]/95 p-2.5 shadow-2xl backdrop-blur-md hover:border-amber-400 transition-all sm:flex"
                >
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-700">
                    <Image
                      src={heroSecondaryImage}
                      alt="X50CrMoV15 Şef Bıçağı"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono font-bold text-amber-400">
                      X50CrMoV15 ÇELİK
                    </span>
                    <p className="truncate text-xs font-bold text-white group-hover:text-amber-300">
                      Alman Şef Bıçakları
                    </p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      Koleksiyonu Gör <ArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ÖNE ÇIKAN KOLEKSİYONLAR VE KATEGORİLER */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-500">
              <Layers className="h-3.5 w-3.5" /> Özel Reyonlar
            </div>
            <h2 className="font-display mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-4xl">
              Koleksiyonlara Göz Atın
            </h2>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-slate-400 sm:text-right">
            Profesyonel mutfak bıçaklarından el dövmesi kasap satırlarına kadar her ihtiyaca özel üretilmiş kategorilerimiz.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories
            .filter((c) => c.slug !== "genel")
            .slice(0, 4)
            .map((cat) => {
              const coverImage =
                cat.image && cat.image !== "/images/logo.jpg"
                  ? cat.image
                  : CATEGORY_COVER_FALLBACKS[cat.slug] || "/images/logo.jpg";

              return (
                <Link
                  key={cat.id}
                  href={`/kategori/${cat.slug}`}
                  className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-3xl border border-slate-800/90 bg-[#0d121d] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-amber-500/60 hover:shadow-[0_20px_50px_-12px_rgba(245,158,11,0.2)]"
                >
                  <Image
                    src={coverImage}
                    alt={cat.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Çok Katmanlı Karartma */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06090f] via-[#06090f]/60 to-transparent" />

                  <div className="relative z-10">
                    <span className="inline-block rounded-lg border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur-sm">
                      Sarıyıldız Koleksiyonu
                    </span>
                    <h3 className="mt-2 text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
                      {cat.description || "Usta işi yüksek karbonlu çelik ve dayanıklı ekipman serisi."}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <span>Koleksiyonu İncele</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>

      {/* 3. VİTRİN & ÖNE ÇIKAN ÜRÜNLER */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-500">
              <Sparkles className="h-3.5 w-3.5" /> Atölyeden Seçkiler
            </div>
            <h2 className="font-display mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-4xl">
              Profesyonel Bıçak & Satır Koleksiyonu
            </h2>
          </div>

          {/* Hızlı Kategori Geçiş Hapları */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/arama"
              className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all"
            >
              Tümü ({featuredProducts.length})
            </Link>
            <Link
              href="/kategori/sef-bicaklari"
              className="rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-amber-500/40 hover:text-white transition-all"
            >
              Şef Bıçakları
            </Link>
            <Link
              href="/kategori/satirlar"
              className="rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-amber-500/40 hover:text-white transition-all"
            >
              Sürmene & Çelik Satırlar
            </Link>
          </div>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-[#0d121d] p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Henüz Ürün Eklenmedi</h3>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-400">
              Mağazanızı doldurmak için yönetim panelinden yapay zeka destekli veya manuel olarak yeni ürünler ekleyebilirsiniz.
            </p>
            <Link
              href="/yonetim"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg hover:from-amber-400 hover:to-yellow-400 transition-all"
            >
              <span>Yönetim Paneline Git</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. USTALIĞIN ANATOMİSİ (CRAFTSMANSHIP PILLARS) */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-gradient-to-b from-[#0e1422] to-[#080c14] p-8 sm:p-12">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-400">
              <Award className="h-3.5 w-3.5" /> Neden Sarıyıldız?
            </span>
            <h2 className="font-display mt-3 text-2xl font-bold text-white sm:text-4xl">
              Kusursuz Çeliğin 3 Altın Kuralı
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Her bir Sarıyıldız bıçağı ve satırı, mutfakta yıllarca ilk günkü keskinliğini ve dengesini koruması için titizlikle işlenir.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800/90 bg-[#0a0f18]/90 p-6 hover:border-amber-500/40 transition-colors">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono font-extrabold text-lg">
                01
              </div>
              <h3 className="text-base font-bold text-white">
                Alman X50CrMoV15 & Sürmene Çeliği
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Yüksek karbon ve krom-molibden-vanadyum alaşımlı çelik yapımız, paslanmaya karşı maksimum direnç ve 58+ HRC sertlik derecesi sunar.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/90 bg-[#0a0f18]/90 p-6 hover:border-amber-500/40 transition-colors">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono font-extrabold text-lg">
                02
              </div>
              <h3 className="text-base font-bold text-white">
                Ergonomik Ceviz & İşlemeli Kabza
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Doğal ceviz ağacı ve el işlemeli özel tasarım kabzalarımız, tam pırazvana (full-tang) ağırlık dengesiyle uzun süreli doğramalarda bile bileğinizi yormaz.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/90 bg-[#0a0f18]/90 p-6 hover:border-amber-500/40 transition-colors">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono font-extrabold text-lg">
                03
              </div>
              <h3 className="text-base font-bold text-white">
                Jilet Keskinliğinde Lazer Ağız Açımı
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Usta zanaatkarlarımız tarafından çift taraflı 15° açıyla taşlanan kesim yüzeyi; et, balık, lakerda ve sebzeleri dokusunu ezmeden pürüzsüzce dilimler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ŞEFLERİN VE MÜŞTERİLERİN YORUMLARI */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              ★ Doğrulanmış Müşteri Deneyimleri
            </span>
            <h2 className="font-display mt-1 text-2xl font-bold text-white sm:text-3xl">
              Mutfak Ustaları Ne Diyor?
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              name: "Şef Kemal Arslan",
              role: "Executive Chef · İstanbul",
              product: "X50CrMoV15 Alman Çeliği Şef Bıçağı",
              comment:
                "Profesyonel mutfakta her gün saatlerce hazırlık yapıyoruz. Bilek dengesi, çeliğin ağız tutuşu ve ceviz sapın ele oturuşu gerçekten Avrupa standartlarının üzerinde.",
            },
            {
              name: "Murat Karadeniz",
              role: "Gurme & Et Ustası · Ankara",
              product: "El Yapımı Sürmene Çelik Satır",
              comment:
                "Sürmene satırının ağırlık merkezi muazzam. Kemikli etlerde ve sebze doğramada hiç güç harcamadan kendi ağırlığıyla kesiyor. Kabza işlemeleri tam bir sanat eseri.",
            },
            {
              name: "Sinan Aydın",
              role: "Restoran İşletmecisi · İzmir",
              product: "Atainox Profesyonel Şef Bıçağı & Masat",
              comment:
                "Hem Atainox şef bıçağını hem de bileme masatını set olarak aldık. Kargolama çok özenliydi, kutusundan çıktığı andaki jilet keskinliği hayran bıraktı.",
            },
          ].map((review, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-3xl border border-slate-800/90 bg-[#0d121d] p-6 shadow-lg"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300 italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>
              <div className="mt-6 border-t border-slate-800/80 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{review.name}</p>
                  <p className="text-[11px] text-slate-400">{review.role}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Onaylı Alıcı
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. ÖZEL KAMPANYA & KUPON BANNERI */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-r from-[#111622] via-[#18130a] to-[#0e131f] p-8 md:p-12 shadow-2xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/15 blur-[90px]" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-extrabold text-amber-300">
                <Sparkles className="h-3.5 w-3.5" /> İLK SİPARİŞE ÖZEL AVANTAJ
              </span>
              <h3 className="font-display text-2xl font-extrabold text-white sm:text-4xl">
                Tüm Şef Bıçakları ve Satırlarda{" "}
                <span className="text-amber-400">%10 Ek İndirim</span>
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                Sepetinizde veya ödeme adımında{" "}
                <span className="rounded border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 font-mono font-bold text-amber-300">
                  YILDIZ10
                </span>{" "}
                kupon kodunu kullanarak anında %10 indirim ve 500 ₺ üzeri ücretsiz sigortalı kargo fırsatından yararlanın.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <Link
                href="/arama"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 px-7 py-4 text-xs sm:text-sm font-extrabold text-slate-950 shadow-xl hover:brightness-110 transition-all gold-glow"
              >
                <span>Koleksiyonu İncele</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-xs text-slate-300">
                <Truck className="h-4 w-4 text-amber-400" />
                <span>Aynı Gün Sigortalı Kargo</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
