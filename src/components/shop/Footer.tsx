import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Truck, RotateCcw, CreditCard, Mail, Phone, MapPin, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#05080d] text-slate-400">
      {/* Üst Güven ve Hizmet Rozetleri Bandı */}
      <div className="border-b border-slate-800/70 bg-[#080c14] py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800/70 bg-[#0b101b]/70 p-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Hızlı & Sigortalı Kargo</h4>
              <p className="text-[11px] text-slate-400">500 ₺ üzeri tüm siparişlerde ücretsiz</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800/70 bg-[#0b101b]/70 p-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">14 Gün Koşulsuz İade</h4>
              <p className="text-[11px] text-slate-400">Kolay cayma hakkı ve hızlı iade süreci</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800/70 bg-[#0b101b]/70 p-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">%100 Orijinal Zanaat</h4>
              <p className="text-[11px] text-slate-400">Sürmene & Alman X50CrMoV15 çelik garantisi</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800/70 bg-[#0b101b]/70 p-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">256-Bit SSL Güvenli Ödeme</h4>
              <p className="text-[11px] text-slate-400">3D Secure korumalı kartlı alışveriş</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ana Footer Bağlantıları */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Kolon 1: Marka Tanıtımı */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-amber-500/40 bg-black flex items-center justify-center">
                <Image
                  src="/images/logo.jpg"
                  alt="Sarıyıldız Logo"
                  width={44}
                  height={44}
                  className="rounded-xl object-cover"
                />
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-[0.14em] text-white block">
                  SARIYILDIZ
                </span>
                <span className="text-[10px] tracking-[0.2em] text-amber-500 uppercase font-semibold block">
                  Bıçak & Ekipman Atölyesi
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 mb-6 max-w-sm">
              Sarıyıldız; el dövmesi orijinal Sürmene satırları, Alman X50CrMoV15 paslanmaz çelik şef bıçakları, doğal ceviz saplı özel koleksiyon bıçaklar ve profesyonel ekipmanları en yüksek kalite standartlarında sunar.
            </p>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 text-amber-500" />
                <span>0850 123 45 67 (Hafta içi 09:00 - 18:00)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 text-amber-500" />
                <span>destek@sariyildiz.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                <span>İstanbul / Sürmene Atölye, Türkiye</span>
              </div>
            </div>
          </div>

          {/* Kolon 2: Koleksiyonlar */}
          <div>
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Koleksiyonlar
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/kategori/sef-bicaklari" className="hover:text-amber-400 transition-colors">
                  Profesyonel Şef Bıçakları
                </Link>
              </li>
              <li>
                <Link href="/kategori/satirlar" className="hover:text-amber-400 transition-colors">
                  Sürmene & Kasap Satırları
                </Link>
              </li>
              <li>
                <Link href="/kategori/sarj-cihazlari" className="hover:text-amber-400 transition-colors">
                  Şarj & Güç Çözümleri
                </Link>
              </li>
              <li>
                <Link href="/kategori/kamp-fenerleri" className="hover:text-amber-400 transition-colors">
                  Kamp & Outdoor Ekipman
                </Link>
              </li>
              <li>
                <Link href="/arama" className="hover:text-amber-400 transition-colors">
                  Tüm Ürünler Katalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolon 3: Müşteri Hizmetleri */}
          <div>
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Müşteri Hizmetleri
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/hesabim" className="hover:text-amber-400 transition-colors">
                  Sipariş Takibi & Hesabım
                </Link>
              </li>
              <li>
                <Link href="/iade-ve-degisim" className="hover:text-amber-400 transition-colors">
                  İade ve Değişim Koşulları
                </Link>
              </li>
              <li>
                <Link href="/sepet" className="hover:text-amber-400 transition-colors">
                  Alışveriş Sepetim
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolon 4: Yasal & Kurumsal */}
          <div>
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Kurumsal & Yasal
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-amber-400 transition-colors">
                  Mesafeli Satış Sözleşmesi
                </Link>
              </li>
              <li>
                <Link href="/kvkk-aydinlatma-metni" className="hover:text-amber-400 transition-colors">
                  KVKK Aydınlatma Metni
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/yonetim"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-amber-400 font-bold hover:bg-amber-500/20 transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Yönetim Kokpiti</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Telif ve Güvenlik Bandı */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 Sarıyıldız Bıçak & Ekipman. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-slate-300">
              iyzico 3D Secure
            </span>
            <span className="rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-slate-300">
              Mastercard · Visa · Troy
            </span>
            <span className="rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-slate-300">
              ETBİS Kayıtlı Mağaza
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
