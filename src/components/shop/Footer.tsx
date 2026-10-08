import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Truck, RotateCcw, CreditCard, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#070a10] text-slate-400">
      {/* Güven ve Hizmet Rozetleri */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-500/10 p-3 text-amber-400">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Hızlı & Sigortalı Kargo</h4>
              <p className="text-xs text-slate-400">500 TL üzeri tüm siparişlerde ücretsiz</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-500/10 p-3 text-amber-400">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">14 Gün Kolay İade</h4>
              <p className="text-xs text-slate-400">Koşulsuz cayma hakkı ve hızlı iade</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-500/10 p-3 text-amber-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">%100 Orijinal Ürün</h4>
              <p className="text-xs text-slate-400">Resmi garanti ve kalite kontrol</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-500/10 p-3 text-amber-400">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">256-Bit SSL Güvenli Ödeme</h4>
              <p className="text-xs text-slate-400">3D Secure korumalı kartlı ödeme</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ana Footer Bağlantıları */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Kolon 1: Marka Tanıtımı */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-amber-500/40 bg-black">
                <Image
                  src="/images/logo.jpg"
                  alt="Sarıyıldız Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-extrabold tracking-wider text-white">
                SARIYILDIZ
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 mb-6 max-w-sm">
              Sarıyıldız; profesyonel şef bıçakları, ağır hizmet satırları, GaN hızlı şarj çözümleri, kablosuz hoparlörler ve açık hava kamp ekipmanlarını en yüksek kalite standartlarında tüketicilerle buluşturur.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-amber-500" />
                <span>0850 123 45 67 (Hafta içi 09:00 - 18:00)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-amber-500" />
                <span>destek@sariyildiz.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
          </div>

          {/* Kolon 2: Kategoriler */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Kategoriler
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/kategori/sef-bicaklari-ve-satirlar" className="hover:text-amber-400 transition-colors">
                  Şef Bıçakları & Satırlar
                </Link>
              </li>
              <li>
                <Link href="/kategori/sarj-ve-guc-cozumleri" className="hover:text-amber-400 transition-colors">
                  Şarj & Güç Çözümleri
                </Link>
              </li>
              <li>
                <Link href="/kategori/kamp-ve-outdoor-aydinlatma" className="hover:text-amber-400 transition-colors">
                  Kamp & Outdoor Aydınlatma
                </Link>
              </li>
              <li>
                <Link href="/kategori/wireless-hoparlor-ve-ses" className="hover:text-amber-400 transition-colors">
                  Wireless Hoparlör & Ses
                </Link>
              </li>
              <li>
                <Link href="/arama" className="hover:text-amber-400 transition-colors">
                  Tüm Ürünler
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolon 3: Müşteri Hizmetleri */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Müşteri Hizmetleri
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/hesabim" className="hover:text-amber-400 transition-colors">
                  Sipariş Takibi
                </Link>
              </li>
              <li>
                <Link href="/kargo-ve-teslimat" className="hover:text-amber-400 transition-colors">
                  Kargo ve Teslimat
                </Link>
              </li>
              <li>
                <Link href="/iade-ve-degisim" className="hover:text-amber-400 transition-colors">
                  İade ve Cayma Hakkı
                </Link>
              </li>
              <li>
                <Link href="/sikca-sorulan-sorular" className="hover:text-amber-400 transition-colors">
                  Sıkça Sorulan Sorular (SSS)
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-amber-400 transition-colors">
                  Bize Ulaşın
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolon 4: Yasal & Kurumsal */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Kurumsal & Yasal
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/hakkimizda" className="hover:text-amber-400 transition-colors">
                  Hakkımızda
                </Link>
              </li>
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
              <li>
                <Link href="/gizlilik-politikasi" className="hover:text-amber-400 transition-colors">
                  Gizlilik & Çerez Politikası
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-600 hover:text-amber-500 transition-colors">
                  Yönetim Paneli Girişi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Telif ve Güvenlik Bandı */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 Sarıyıldız E-Ticaret Platformu. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 text-slate-300">
              iyzico 3D Secure
            </span>
            <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 text-slate-300">
              Mastercard / Visa / Troy
            </span>
            <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 text-slate-300">
              ETBİS Kayıtlı
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
