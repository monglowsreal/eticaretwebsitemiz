"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star, ShoppingBag, Check, Eye, Layers, Sparkles } from "lucide-react";
import { ProductItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const defaultVariant = product.variants[0];
  const primaryImage = product.images[0]?.url || "/images/placeholder.jpg";
  const secondaryImage = product.images[1]?.url || null;

  const [imgSrc, setImgSrc] = useState(primaryImage);
  const [secImgSrc, setSecImgSrc] = useState(secondaryImage);

  const discountRate =
    defaultVariant?.compareAtPrice && defaultVariant.compareAtPrice > defaultVariant.price
      ? Math.round(
          ((defaultVariant.compareAtPrice - defaultVariant.price) /
            defaultVariant.compareAtPrice) *
            100
        )
      : null;

  const savingsAmount =
    defaultVariant?.compareAtPrice && defaultVariant.compareAtPrice > defaultVariant.price
      ? defaultVariant.compareAtPrice - defaultVariant.price
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!defaultVariant) return;

    addItem(
      {
        variantId: defaultVariant.id,
        productId: product.id,
        productName: product.name,
        variantName: defaultVariant.name,
        sku: defaultVariant.sku,
        price: defaultVariant.price,
        image: imgSrc,
        stock: defaultVariant.stock,
      },
      1
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-800/90 bg-gradient-to-b from-[#101624] to-[#0a0e17] transition-all duration-500 hover:-translate-y-1.5 hover:border-amber-500/50 hover:shadow-[0_20px_50px_-12px_rgba(245,158,11,0.18)]"
    >
      {/* Sol Üst: İndirim ve Koleksiyon Rozetleri */}
      <div className="pointer-events-none absolute left-3.5 top-3.5 z-20 flex flex-col gap-1.5">
        {discountRate && (
          <span className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-2.5 py-1 text-[11px] font-extrabold text-slate-950 shadow-lg">
            %{discountRate} İNDİRİM
          </span>
        )}
        {product.isFeatured && (
          <span className="inline-flex items-center gap-1 rounded-xl border border-amber-500/40 bg-slate-950/85 px-2.5 py-1 text-[10px] font-bold text-amber-400 backdrop-blur-md">
            <Sparkles className="h-3 w-3" /> Özel Seçki
          </span>
        )}
      </div>

      {/* Sağ Üst: Fotoğraf Sayısı Rozeti */}
      {product.images.length > 1 && (
        <div className="pointer-events-none absolute right-3.5 top-3.5 z-20">
          <span className="inline-flex items-center gap-1 rounded-xl border border-slate-700/80 bg-slate-950/80 px-2 py-1 text-[10px] font-semibold text-slate-300 backdrop-blur-md">
            <Layers className="h-3 w-3 text-amber-400" />
            {product.images.length} Açı
          </span>
        </div>
      )}

      {/* Ürün Görsel Alanı (Hover'da 2. Açıya Geçiş) */}
      <Link
        href={`/urun/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-[#06090f]"
      >
        {/* Ana Görsel */}
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={`object-cover object-center transition-all duration-700 ${
            isHovered && secImgSrc
              ? "scale-105 opacity-0"
              : "scale-100 opacity-100 group-hover:scale-105"
          }`}
          onError={() => setImgSrc("/images/placeholder.jpg")}
        />

        {/* İkinci Açı Görseli (Hover durumunda belirir) */}
        {secImgSrc && (
          <Image
            src={secImgSrc}
            alt={`${product.name} - Detay Görünüm`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`object-cover object-center transition-all duration-700 ${
              isHovered ? "scale-105 opacity-100" : "scale-100 opacity-0"
            }`}
            onError={() => setSecImgSrc(null)}
          />
        )}

        {/* Alt Karartma Gradyanı ve Hızlı İncele Barı */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/40 to-transparent opacity-90" />

        <div className="absolute inset-x-3.5 bottom-3 z-10 flex items-center justify-between">
          {/* Stok Durumu */}
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800/90 bg-slate-950/85 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {defaultVariant && defaultVariant.stock > 0
              ? `Stokta (${defaultVariant.stock})`
              : "Tükendi"}
          </span>

          {/* Hızlı İncele İpucu */}
          <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-slate-950/90 px-2.5 py-1 text-[10px] font-semibold text-amber-300 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 backdrop-blur-md">
            <Eye className="h-3 w-3" /> Detayları Gör
          </span>
        </div>
      </Link>

      {/* Ürün Bilgileri */}
      <div className="flex flex-1 flex-col p-5">
        {/* Kategori ve Değerlendirme */}
        <div className="mb-2 flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold uppercase tracking-wider text-[10px] text-amber-400/90 truncate">
            {product.category.name}
          </span>
          <div className="flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-amber-300 flex-shrink-0">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold">{product.rating || 4.9}</span>
          </div>
        </div>

        {/* Ürün Başlığı */}
        <Link
          href={`/urun/${product.slug}`}
          className="line-clamp-2 text-sm font-bold leading-snug text-white transition-colors group-hover:text-amber-400"
        >
          {product.name}
        </Link>

        {/* Kısa Açıklama Özeti */}
        {product.description && (
          <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-slate-400">
            {product.description}
          </p>
        )}

        {/* Fiyat ve Sepete Ekle Aksiyonu */}
        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-2 border-t border-slate-800/80 pt-3.5">
            <div className="flex flex-col">
              {defaultVariant?.compareAtPrice && (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-slate-500 line-through">
                    {formatPrice(defaultVariant.compareAtPrice)}
                  </span>
                  {savingsAmount && (
                    <span className="text-[10px] font-bold text-emerald-400">
                      -{formatPrice(savingsAmount)}
                    </span>
                  )}
                </div>
              )}
              <span className="font-mono text-lg font-extrabold tracking-tight text-white">
                {formatPrice(defaultVariant ? defaultVariant.price : 0)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!defaultVariant || defaultVariant.stock <= 0}
              className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                added
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-95"
                  : "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 shadow-md hover:shadow-lg hover:shadow-amber-500/25"
              }`}
              aria-label="Sepete ekle"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4 stroke-[2.5]" />
                  <span>Eklendi</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Sepete Ekle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
