"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, CreditCard, CheckCircle2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { OrderService } from "@/server/services/order.service";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  // Form alanları
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("İstanbul");
  const [district, setDistrict] = useState("");
  const [addressLine, setAddressLine] = useState("");
  
  // Fatura & Sözleşme
  const [isCorporate, setIsCorporate] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [taxOffice, setTaxOffice] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kart Formu (Mock 3D Secure)
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const {
    items,
    getSubtotal,
    getShippingCost,
    getTotalPrice,
    discountAmount,
    couponCode,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    setMounted(false);
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const shippingCost = getShippingCost();
  const totalPrice = getTotalPrice();

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-slate-300">
        <h2 className="text-xl font-bold text-white">Sepetiniz Boş</h2>
        <p className="mt-2 text-xs text-slate-400">
          Ödeme yapabilmek için sepetinizde ürün bulunmalıdır.
        </p>
        <Link
          href="/arama"
          className="mt-6 inline-block rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptTerms) {
      setError("Lütfen Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formunu onaylayınız.");
      return;
    }

    if (!firstName || !lastName || !phone || !email || !district || !addressLine) {
      setError("Lütfen iletişim ve teslimat adresi alanlarını eksiksiz doldurunuz.");
      return;
    }

    setIsSubmitting(true);

    // Sipariş simülasyonu ve numara üretimi
    setTimeout(() => {
      const generatedOrderNo = OrderService.generateOrderNumber();
      setOrderComplete(generatedOrderNo);
      clearCart();
      setIsSubmitting(false);
    }, 1500);
  };

  // Sipariş Tamamlandı Ekranı
  if (orderComplete) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl border border-slate-800 bg-[#0e1320] p-8 sm:p-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-semibold text-amber-400">
            Siparişiniz Başarıyla Alındı
          </span>

          <h1 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
            Teşekkür Ederiz!
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Sipariş onayınız ve kargo takip bilgileriniz <span className="text-white font-medium">{email}</span> adresinize iletilecektir.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center">
            <span className="text-xs text-slate-400">Sipariş Takip Numaranız</span>
            <p className="mt-1 font-mono text-xl font-extrabold text-amber-400">
              {orderComplete}
            </p>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 text-xs font-bold text-slate-950 gold-glow"
            >
              <span>Alışverişe Devam Et</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
          Güvenli Ödeme (Checkout)
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Misafir olarak güvenle sipariş verin · 256-Bit SSL koruması
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* SOL VE ORTA: Form Alanları */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. İletişim Bilgileri */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1320] p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-extrabold text-slate-950">
                1
              </span>
              İletişim Bilgileri
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-300">E-Posta Adresi *</label>
                <input
                  type="email"
                  required
                  placeholder="ornek@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">Cep Telefonu *</label>
                <input
                  type="tel"
                  required
                  placeholder="05XX XXX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Teslimat Adresi */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1320] p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-extrabold text-slate-950">
                2
              </span>
              Teslimat Adresi
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-300">Adınız *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">Soyadınız *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-300">İl *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">İlçe *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Kadıköy"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Açık Adres (Cadde, Sokak, No, Daire) *</label>
              <textarea
                required
                rows={3}
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="Örnek: Bağdat Caddesi No: 124 Daire: 5"
                className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 3. Ödeme Yöntemi & Kart Bilgileri */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1320] p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-extrabold text-slate-950">
                3
              </span>
              Kartla Ödeme (3D Secure Korumalı)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300">Kart Üzerindeki İsim</label>
                <input
                  type="text"
                  required
                  placeholder="AHMET YILMAZ"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white uppercase focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Kart Numarası</label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 pl-10 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
                  />
                  <CreditCard className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300">Son Kullanma (AA/YY)</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300">CVV / Güvenlik Kodu</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ: Özet ve Onay */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#0e1320] p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Sipariş Özeti</h3>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 text-xs">
              {items.map((i) => (
                <div key={i.variantId} className="flex justify-between text-slate-300">
                  <span className="line-clamp-1">{i.quantity}x {i.productName}</span>
                  <span className="font-semibold text-white">{formatPrice(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-slate-800/80 pt-4 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Ara Toplam</span>
                <span className="text-white font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>İndirim ({couponCode})</span>
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
                <span>Ödenecek Tutar</span>
                <span className="text-amber-400 text-lg">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            {/* Yasal Onay Kutusu (6502 Sayılı Tüketici Kanunu Uyumu) */}
            <div className="border-t border-slate-800/80 pt-4 space-y-3">
              <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500"
                />
                <span>
                  <Link href="/mesafeli-satis-sozlesmesi" target="_blank" className="text-amber-400 underline">
                    Mesafeli Satış Sözleşmesi
                  </Link>
                  {" 'ni ve "}
                  <Link href="/iade-ve-degisim" target="_blank" className="text-amber-400 underline">
                    Ön Bilgilendirme Formu
                  </Link>
                  {" 'nu okudum, onaylıyorum."}
                </span>
              </label>

              {error && (
                <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-900">
                  {error}
                </p>
              )}

              {/* Şartname Madde 10: "Ödeme yükümlülüğü içeren sipariş" ifadesi zorunludur */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 py-3.5 text-xs font-extrabold uppercase tracking-wider text-slate-950 shadow-lg hover:from-amber-400 hover:to-yellow-400 transition-all gold-glow disabled:opacity-50"
              >
                <Lock className="h-4 w-4" />
                <span>
                  {isSubmitting
                    ? "İşlem Yapılıyor..."
                    : `Ödeme Yükümlülüğü İçeren Siparişi Onayla (${formatPrice(totalPrice)})`}
                </span>
              </button>
            </div>

            <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Kart bilgileriniz PCI-DSS standartlarında şifrelenir</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
