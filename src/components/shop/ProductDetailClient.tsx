"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ShieldCheck, Truck, RotateCcw, Check, ShoppingBag, Plus, Minus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

interface ProductDetailClientProps {
  product: ProductItem;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedImage, setSelectedImage] = useState(product.images[0]?.url);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const discountRate =
    selectedVariant?.compareAtPrice &&
    selectedVariant.compareAtPrice > selectedVariant.price
      ? Math.round(
          ((selectedVariant.compareAtPrice - selectedVariant.price) /
            selectedVariant.compareAtPrice) *
            100
        )
      : null;

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
        image: selectedImage || product.images[0]?.url || "/images/placeholder.jpg",
        stock: selectedVariant.stock,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Geri Dön Butonu */}
      <div className="mb-6">
        <Link
          href={`/kategori/${product.category.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{product.category.name} Kategorisine Dön</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* SOL: Görsel Galerisi */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-800 bg-[#0e1320] shadow-xl">
            <Image
              src={selectedImage || product.images[0]?.url || "/images/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover object-center"
              priority
            />
            {discountRate && (
              <span className="absolute left-4 top-4 rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-bold text-slate-950 shadow-md">
                %{discountRate} İndirim
              </span>
            )}
          </div>

          {/* Küçük Resimler (Küçük Galeri) */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative h-20 w-20 overflow-hidden rounded-xl border transition-all ${
                    selectedImage === img.url
                      ? "border-amber-500 ring-2 ring-amber-500/30"
                      : "border-slate-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt={img.altText || ""} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SAĞ: Ürün Bilgileri ve Seçenekler */}
        <div className="flex flex-col space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              {product.brand || "Sarıyıldız"} · {product.category.name}
            </span>
            <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
              {product.name}
            </h1>

            {/* Puan ve İnceleme */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" />
                <span className="text-sm font-bold">{product.rating || 4.9}</span>
              </div>
              <span className="text-xs text-slate-400">
                ({product.reviewCount || 24} Müşteri Yorumu)
              </span>
              <span className="text-xs text-emerald-400 font-medium">· Doğrulanmış Alıcılar</span>
            </div>
          </div>

          {/* Fiyat Alanı */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1320] p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                {formatPrice(selectedVariant.price)}
              </span>
              {selectedVariant.compareAtPrice && (
                <span className="text-sm text-slate-500 line-through">
                  {formatPrice(selectedVariant.compareAtPrice)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400">
              KDV Dahil · 500 TL üzeri kargo bedava
            </p>
          </div>

          {/* Varyant Seçimi */}
          {product.variants.length > 1 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Model / Varyant Seçeneği:
              </label>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all ${
                      selectedVariant.id === v.id
                        ? "border-amber-500 bg-amber-500/10 text-amber-400 shadow-md ring-1 ring-amber-500"
                        : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {v.name || v.sku}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stok Durumu & SKU */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-b border-slate-800/80 py-3">
            <div>
              SKU: <span className="font-mono text-slate-200">{selectedVariant.sku}</span>
            </div>
            <div>
              {selectedVariant.stock > 0 ? (
                <span className="font-semibold text-emerald-400">
                  ✓ Stokta Var ({selectedVariant.stock} Adet)
                </span>
              ) : (
                <span className="font-semibold text-red-400">Tükendi</span>
              )}
            </div>
          </div>

          {/* Adet ve Sepete Ekle */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center rounded-xl border border-slate-700 bg-slate-900 px-2 py-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 text-slate-400 hover:text-white"
                aria-label="Azalt"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 text-slate-400 hover:text-white"
                aria-label="Artır"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold shadow-lg transition-all ${
                added
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 gold-glow"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>Sepete Eklendi!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  <span>Sepete Ekle ({formatPrice(selectedVariant.price * quantity)})</span>
                </>
              )}
            </button>
          </div>

          {/* Açıklama */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2">Ürün Açıklaması</h3>
            <p className="text-sm leading-relaxed text-slate-300">
              {product.description}
            </p>
          </div>

          {/* Güven ve Kargo Kutusu */}
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-800 bg-[#0e1320] p-4 text-center text-xs">
            <div className="flex flex-col items-center gap-1.5 text-slate-300">
              <Truck className="h-5 w-5 text-amber-500" />
              <span className="font-semibold text-white">Aynı Gün Kargo</span>
              <span className="text-[10px] text-slate-400">14:00'e kadar</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-slate-300">
              <RotateCcw className="h-5 w-5 text-amber-500" />
              <span className="font-semibold text-white">14 Gün İade</span>
              <span className="text-[10px] text-slate-400">Kolay cayma hakkı</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-slate-300">
              <ShieldCheck className="h-5 w-5 text-amber-500" />
              <span className="font-semibold text-white">%100 Orijinal</span>
              <span className="text-[10px] text-slate-400">Sarıyıldız garantisi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
