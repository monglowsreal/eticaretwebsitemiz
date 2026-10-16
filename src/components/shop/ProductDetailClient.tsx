"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingBag,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Award,
  Sparkles,
  CheckCircle2,
  Info,
} from "lucide-react";
import Link from "next/link";
import { ProductItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

interface ProductDetailClientProps {
  product: ProductItem;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "care" | "shipping">("details");

  const addItem = useCartStore((state) => state.addItem);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ id: "default", url: "/images/placeholder.jpg", altText: product.name }];

  const currentImage = images[selectedImageIndex]?.url || "/images/placeholder.jpg";

  const discountRate =
    selectedVariant?.compareAtPrice &&
    selectedVariant.compareAtPrice > selectedVariant.price
      ? Math.round(
          ((selectedVariant.compareAtPrice - selectedVariant.price) /
            selectedVariant.compareAtPrice) *
            100
        )
      : null;

  const savingsAmount =
    selectedVariant?.compareAtPrice &&
    selectedVariant.compareAtPrice > selectedVariant.price
      ? selectedVariant.compareAtPrice - selectedVariant.price
      : null;

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        variantName: selectedVariant.name,
        sku: selectedVariant.sku,
        price: selectedVariant.price,
        image: currentImage,
        stock: selectedVariant.stock,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Üst Breadcrumb Navigasyonu */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition-colors">
          Ana Sayfa
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
        <Link
          href={`/kategori/${product.category.slug}`}
          className="hover:text-amber-400 transition-colors"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
        <span className="font-semibold text-amber-400 truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* SOL: Çok Açılı Lüks Görsel Galerisi (6 Kolon) */}
        <div className="flex flex-col gap-4 lg:col-span-6">
          <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-800 bg-[#0b101b] shadow-2xl">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-cover object-center transition-all duration-500"
              priority
            />

            {/* Sol Üst İndirim ve Öne Çıkan Rozetleri */}
            <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
              {discountRate && (
                <span className="rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-3 py-1 text-xs font-extrabold text-slate-950 shadow-lg">
                  %{discountRate} İNDİRİM
                </span>
              )}
              {product.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-xl border border-amber-500/40 bg-slate-950/85 px-3 py-1 text-[11px] font-bold text-amber-400 backdrop-blur-md">
                  <Sparkles className="h-3 w-3" /> Usta Seçkisi
                </span>
              )}
            </div>

            {/* Sağ Alt Görsel Sayacı */}
            <div className="absolute bottom-4 right-4 z-10 rounded-xl border border-slate-700/80 bg-slate-950/85 px-3 py-1 text-xs font-mono font-bold text-slate-200 backdrop-blur-md">
              {selectedImageIndex + 1} / {images.length} Açı
            </div>

            {/* Önceki / Sonraki Okları */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  aria-label="Önceki fotoğraf"
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-white opacity-80 hover:border-amber-400 hover:text-amber-400 hover:opacity-100 transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  aria-label="Sonraki fotoğraf"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-white opacity-80 hover:border-amber-400 hover:text-amber-400 hover:opacity-100 transition-all cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Küçük Resimler (4 Açı Galeri Şeridi) */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? "border-amber-500 ring-2 ring-amber-500/30 scale-[1.02]"
                      : "border-slate-800/90 opacity-60 hover:opacity-100 hover:border-slate-600"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `${product.name} - Açı ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SAĞ: Ürün Detayları, Teknik Spekler ve Satın Alma (6 Kolon) */}
        <div className="flex flex-col space-y-6 lg:col-span-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                <Award className="h-3.5 w-3.5" />
                {product.brand || "Sarıyıldız"} · {product.category.name}
              </span>

              <span className="font-mono text-xs text-slate-400">
                Stok Kodu: <strong className="text-slate-200">{selectedVariant.sku}</strong>
              </span>
            </div>

            <h1 className="font-display mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
              {product.name}
            </h1>

            {/* Puan, Yorum ve Stok Rozeti */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <span className="font-bold">{product.rating || 4.9}</span>
                <span className="text-slate-400">({product.reviewCount || 28} Değerlendirme)</span>
              </div>

              {selectedVariant.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Stokta Hazır ({selectedVariant.stock} Adet) · Aynı Gün Kargo
                </span>
              ) : (
                <span className="font-semibold text-red-400">Stokta Kalmadı</span>
              )}
            </div>
          </div>

          {/* Fiyat ve Tasarruf Kutusu */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-[#101726] via-[#131926] to-[#0d121d] p-5 shadow-lg">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                {selectedVariant.compareAtPrice && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-slate-500 line-through">
                      {formatPrice(selectedVariant.compareAtPrice)}
                    </span>
                    {savingsAmount && (
                      <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                        {formatPrice(savingsAmount)} Kazanç
                      </span>
                    )}
                  </div>
                )}
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-white">
                  {formatPrice(selectedVariant.price)}
                </span>
              </div>

              <div className="flex flex-col items-end text-right">
                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-400">
                  <Truck className="h-3.5 w-3.5" /> Ücretsiz Sigortalı Kargo
                </span>
                <span className="mt-1 text-[11px] text-slate-400">
                  KDV Dahil · 14 Gün Koşulsuz İade
                </span>
              </div>
            </div>
          </div>

          {/* Teknik Özellik Özeti Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-800/90 bg-[#0b101b] p-3">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                Çelik Kalitesi
              </span>
              <span className="mt-0.5 font-mono text-xs font-bold text-amber-300 block">
                Paslanmaz Dövme
              </span>
            </div>
            <div className="rounded-2xl border border-slate-800/90 bg-[#0b101b] p-3">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                Sertlik Derecesi
              </span>
              <span className="mt-0.5 font-mono text-xs font-bold text-white block">
                58 - 60 HRC
              </span>
            </div>
            <div className="rounded-2xl border border-slate-800/90 bg-[#0b101b] p-3">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                Sap Tasarımı
              </span>
              <span className="mt-0.5 text-xs font-bold text-white block">
                Ergonomik El İşi
              </span>
            </div>
            <div className="rounded-2xl border border-slate-800/90 bg-[#0b101b] p-3">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                Bileme Açısı
              </span>
              <span className="mt-0.5 font-mono text-xs font-bold text-white block">
                15° Lazer V-Ağız
              </span>
            </div>
          </div>

          {/* Adet Seçimi ve Sepete Ekle Butonu */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-1">
            <div className="flex items-center justify-between rounded-2xl border border-slate-700 bg-[#0b101b] px-3 py-3 sm:w-36">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                aria-label="Azalt"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-mono text-base font-extrabold text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                aria-label="Artır"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={selectedVariant.stock <= 0}
              className={`flex flex-1 items-center justify-center gap-2.5 rounded-2xl py-4 px-6 text-sm font-extrabold shadow-xl transition-all cursor-pointer ${
                added
                  ? "bg-emerald-500 text-slate-950 scale-[0.99]"
                  : "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 gold-glow"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-5 w-5 stroke-[2.5]" />
                  <span>Sepete Eklendi!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  <span>
                    Sepete Ekle · {formatPrice(selectedVariant.price * quantity)}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Bilgi Sekmeleri: Açıklama / Bakım Rehberi / Kargo */}
          <div className="rounded-3xl border border-slate-800/90 bg-[#0b101b] p-5">
            <div className="flex border-b border-slate-800 pb-3 gap-2">
              <button
                onClick={() => setActiveTab("details")}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "details"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Ürün Açıklaması
              </button>
              <button
                onClick={() => setActiveTab("care")}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "care"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Bıçak Bakım Rehberi
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "shipping"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Teslimat & Garanti
              </button>
            </div>

            <div className="pt-4 text-xs sm:text-sm leading-relaxed text-slate-300">
              {activeTab === "details" && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200/90">
                    <Info className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>
                      Her ürünümüz gönderim öncesinde usta kontrolünden geçirilir ve özel uç koruyucu kılıfıyla paketlenir.
                    </span>
                  </div>
                </div>
              )}

              {activeTab === "care" && (
                <ul className="space-y-2 text-xs text-slate-300 list-disc pl-4">
                  <li>
                    <strong>Elde Yıkama Önerilir:</strong> Bulaşık makinesinin yüksek ısısı ve ağır kimyasal tuzları çeliğin keskin ağzına ve doğal ahşap sapına zarar verebilir. Kullanım sonrası ılık suyla elde yıkayıp hemen kurulayınız.
                  </li>
                  <li>
                    <strong>Kesim Yüzeyi:</strong> Mermer, cam veya metal yüzeyler yerine ahşap ya da polietilen kesim tahtası kullanınız.
                  </li>
                  <li>
                    <strong>Düzenli Masatlama:</strong> Bıçağınızın ilk günkü jilet performansını korumak için Sarıyıldız Bileme Masatı ile düzenli ağız hizalaması yapabilirsiniz.
                  </li>
                </ul>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-2 text-xs text-slate-300">
                  <p>
                    • Saat <strong>14:00&apos;e kadar</strong> verilen tüm siparişler aynı iş günü içinde anlaşmalı kargo ile sigortalı olarak gönderilir.
                  </p>
                  <p>
                    • 14 gün içerisinde koşulsuz iade ve değişim garantisi mevcuttur.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Alt Güven Rozetleri */}
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-800/80 bg-[#0b101b]/70 p-4 text-center text-xs">
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-5 w-5 text-amber-400" />
              <span className="font-bold text-white">Aynı Gün Kargo</span>
              <span className="text-[10px] text-slate-400">Özel Korumalı Kutu</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="h-5 w-5 text-amber-400" />
              <span className="font-bold text-white">14 Gün İade</span>
              <span className="text-[10px] text-slate-400">Koşulsuz Güvence</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              <span className="font-bold text-white">%100 Orijinal</span>
              <span className="text-[10px] text-slate-400">Sarıyıldız Garantisi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
