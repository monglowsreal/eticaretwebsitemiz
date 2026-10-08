"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useCartStore, FREE_SHIPPING_THRESHOLD } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const {
    items,
    isCartOpen,
    closeCart,
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

  if (!mounted || !isCartOpen) return null;

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
      setCouponMessage("Geçersiz kupon kodu.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Arka Plan Karartması */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-slate-800 bg-[#0d121c] p-6 shadow-2xl flex flex-col justify-between">
          {/* Sepet Başlığı */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold text-white">
                  Sepetiniz ({items.reduce((s, i) => s + i.quantity, 0)})
                </h3>
              </div>
              <button
                onClick={closeCart}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Ücretsiz Kargo İlerleme Çubuğu */}
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              {freeShippingRemaining > 0 ? (
                <div>
                  <p className="text-xs text-slate-300">
                    Ücretsiz kargoya <span className="font-bold text-amber-400">{formatPrice(freeShippingRemaining)}</span> kaldı!
                  </p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Tebrikler! Sepetiniz ücretsiz kargo avantajına sahip.</span>
                </div>
              )}
            </div>

            {/* Ürün Listesi */}
            <div className="mt-4 max-h-[42vh] overflow-y-auto pr-1 space-y-3">
              {items.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-500">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-medium text-slate-300">Sepetiniz şu anda boş</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Sarıyıldız koleksiyonundan ürünleri sepetinize ekleyebilirsiniz.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
                  >
                    Alışverişe Başla
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex gap-3 rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-white line-clamp-1">
                          {item.productName}
                        </h4>
                        {item.variantName && (
                          <p className="text-[11px] text-amber-500/90 font-medium">
                            {item.variantName}
                          </p>
                        )}
                        <p className="mt-1 text-xs font-bold text-white">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Adet Kontrolü */}
                        <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 px-1 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Sil Butonu */}
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                          aria-label="Ürünü sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Alt Özet ve Sipariş Butonları */}
          {items.length > 0 && (
            <div className="border-t border-slate-800 pt-4 space-y-3">
              {/* Kupon Kodu Alanı */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Tag className="h-3.5 w-3.5" /> Kupon: {couponCode} (-{formatPrice(discountAmount)})
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
                      placeholder="İndirim Kuponu (örn. YILDIZ10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                    >
                      Uygula
                    </button>
                  </form>
                )}
                {couponMessage && (
                  <p className="mt-1 text-[11px] text-amber-400">{couponMessage}</p>
                )}
              </div>

              {/* Fiyat Satırları */}
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
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
                <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold text-white">
                  <span>Genel Toplam</span>
                  <span className="text-amber-400 text-base">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Eylem Butonları */}
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/odeme"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 py-3 text-sm font-bold text-slate-950 shadow-lg hover:from-amber-400 hover:to-yellow-400 transition-all gold-glow"
                >
                  <span>Siparişi Tamamla</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/sepet"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Sepet Sayfasına Git
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
