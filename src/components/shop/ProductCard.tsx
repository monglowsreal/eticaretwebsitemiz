"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star, ShoppingBag, Check } from "lucide-react";
import { ProductItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const defaultVariant = product.variants[0];
  const primaryImage = product.images[0]?.url || "/images/placeholder.jpg";
  const discountRate =
    defaultVariant?.compareAtPrice && defaultVariant.compareAtPrice > defaultVariant.price
      ? Math.round(
          ((defaultVariant.compareAtPrice - defaultVariant.price) /
            defaultVariant.compareAtPrice) *
            100
        )
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!defaultVariant) return;

    addItem(
      {
        variantId: defaultVariant.id,
        productId: product.id,
        productName: product.name,
        variantName: defaultVariant.name,
        sku: defaultVariant.sku,
        price: defaultVariant.price,
        image: primaryImage,
        stock: defaultVariant.stock,
      },
      1
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0e131f] transition-all duration-300 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5">
      {/* İndirim veya Öne Çıkan Rozeti */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {discountRate && (
          <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-slate-950 shadow-md">
            %{discountRate} İndirim
          </span>
        )}
        {product.isFeatured && (
          <span className="rounded-md bg-slate-900/90 border border-amber-500/40 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
            Öne Çıkan
          </span>
        )}
      </div>

      {/* Ürün Görseli */}
      <Link href={`/urun/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-slate-950">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* Ürün Bilgileri */}
      <div className="flex flex-1 flex-col p-4">
        {/* Kategori ve Puan */}
        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium text-amber-500/90 line-clamp-1">
            {product.category.name}
          </span>
          <div className="flex items-center gap-1 text-slate-300">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold">{product.rating || 5.0}</span>
            <span className="text-[10px] text-slate-500">({product.reviewCount || 10})</span>
          </div>
        </div>

        {/* Ürün Başlığı */}
        <Link
          href={`/urun/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-amber-400"
        >
          {product.name}
        </Link>

        {/* Fiyat ve Buton */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            {defaultVariant?.compareAtPrice && (
              <span className="text-xs text-slate-500 line-through">
                {formatPrice(defaultVariant.compareAtPrice)}
              </span>
            )}
            <span className="text-base font-extrabold text-white">
              {formatPrice(defaultVariant ? defaultVariant.price : 0)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              added
                ? "bg-emerald-500 text-slate-950"
                : "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md hover:shadow-amber-500/20"
            }`}
            aria-label="Sepete ekle"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                <span>Eklendi</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                <span>Ekle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
