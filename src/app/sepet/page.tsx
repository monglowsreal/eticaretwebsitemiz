"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, ArrowLeft } from "lucide-react";
import { useCartStore, FREE_SHIPPING_THRESHOLD } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getShippingCost,
    getTotalPrice,
    getFreeShippingRemaining,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  useEffect(() => {
    setMounted(false);
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-400">
        Sepet yükleniyor...
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shippingCost = getShippingCost();
  const totalPrice = getTotalPrice();
  const freeShippingRemaining = getFreeShippingRemaining();
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === "YILDIZ10") {
      if (subtotal < 25000) {
        setCouponMessage("YILDIZ10 kuponu en az 250 TL üzeri sepetlerde geçerlidir.");
        return;
      }
      const disc = Math.round(subtotal * 0.1);
      applyCoupon(code, disc);
      setCouponMessage("Tebrikler! %10 indirim uygulandı.");
      setCouponInput("");
    } else if (code === "HOSGELDIN50") {
      if (subtotal < 50000) {
        setCouponMessage("HOSGELDIN50 kuponu en az 500 TL üzeri sepetlerde geçerlidir.");
        return;
      }
      applyCoupon(code, 5000);
      setCouponMessage("Tebrikler! 50 TL indirim uygulandı.");
      setCouponInput("");
    } else {
      setCouponMessage("Geçersiz veya süresi dolmuş kupon kodu.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-slate-800 bg-[#0e1320] text-slate-400">
          <ShoppingBag className="h-10 w-10 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Alışveriş Sepetiniz Boş</h1>
        <p className="mt-2 text-sm text-slate-400">
          Sepetinizde ürün bulunmamaktadır. Sarıyıldız koleksiyonunu inceleyerek alışverişe başlayabilirsiniz.
        </p>
        <Link
          href="/arama"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 text-xs font-bold text-slate-950 gold-glow"
        >
          <span>Ürünleri Keşfet</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-extrabold text-white sm:text-3xl mb-8">
        Alışveriş Sepeti ({items.reduce((s, i) => s + i.quantity, 0)} Ürün)
      </h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* SOL: Ürün Listesi */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ücretsiz Kargo Bildirimi */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1320] p-4">
            {freeShippingRemaining > 0 ? (
              <div>
                <p className="text-xs text-slate-300">
                  Sepetinize <span className="font-bold text-amber-400">{formatPrice(freeShippingRemaining)}</span> daha ürün ekleyin, <span className="text-white font-semibold">kargo ücretsiz olsun!</span>
                </p>
                <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-900">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
                <span>Tebrikler! Sepetiniz ücretsiz kargo avantajına ulaştı.</span>
              </div>
            )}
          </div>

          {/* Ürünler */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-[#0e1320] p-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {item.productName}
                    </h3>
                    {item.variantName && (
                      <p className="text-xs text-amber-400 font-medium mt-0.5">
                        {item.variantName}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 font-mono mt-1">
                      SKU: {item.sku}
                    </p>
                    <p className="mt-1 text-sm font-bold text-white sm:hidden">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t border-slate-800/80 sm:border-t-0">
                  {/* Adet */}
                  <div className="flex items-center rounded-xl border border-slate-700 bg-slate-900 px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="p-1 text-slate-400 hover:text-white"
                      aria-label="Azalt"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="p-1 text-slate-400 hover:text-white"
                      aria-label="Artır"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Fiyat */}
                  <div className="hidden sm:block text-right">
                    <span className="text-sm font-bold text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Sil */}
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-slate-500 hover:text-red-400 p-1.5 transition-colors"
                    aria-label="Ürünü sepetten çıkar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <Link
              href="/arama"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Alışverişe Devam Et</span>
            </Link>
          </div>
        </div>

        {/* SAĞ: Sipariş Özeti */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#0e1320] p-6 space-y-4">
            <h2 className="text-base font-bold text-white">Sipariş Özeti</h2>

            {/* Kupon Alanı */}
            <div>
              {couponCode ? (
                <div className="flex items-center justify-between rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Tag className="h-4 w-4" /> {couponCode} (-{formatPrice(discountAmount)})
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-slate-400 hover:text-red-400 underline"
                  >
                    Kaldır
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Kupon Kodu"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    Uygula
                  </button>
                </form>
              )}
              {couponMessage && (
                <p className="mt-1.5 text-[11px] text-amber-400">{couponMessage}</p>
              )}
            </div>

            {/* Tutarlar */}
            <div className="space-y-2.5 border-t border-slate-800/80 pt-4 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Ara Toplam</span>
                <span className="text-white font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Kupon İndirimi</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Kargo</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-400 font-semibold">Ücretsiz</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-3 text-base font-extrabold text-white">
                <span>Genel Toplam</span>
                <span className="text-amber-400 text-lg">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Fiyatlara KDV dahildir.
              </p>
            </div>

            {/* Ödemeye Geç */}
            <Link
              href="/odeme"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 py-3.5 text-sm font-bold text-slate-950 shadow-lg hover:from-amber-400 hover:to-yellow-400 transition-all gold-glow"
            >
              <span>Ödemeye İlerle</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
