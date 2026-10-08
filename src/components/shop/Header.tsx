"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu, X, ShieldCheck, Truck, Sparkles, User } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const totalCount = useCartStore((state) => state.getTotalCount());
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    setMounted(false);
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/arama?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navCategories = [
    { name: "Şef Bıçakları & Satırlar", href: "/kategori/sef-bicaklari-ve-satirlar" },
    { name: "Şarj & Güç Çözümleri", href: "/kategori/sarj-ve-guc-cozumleri" },
    { name: "Kamp & Outdoor", href: "/kategori/kamp-ve-outdoor-aydinlatma" },
    { name: "Wireless Hoparlör", href: "/kategori/wireless-hoparlor-ve-ses" },
    { name: "Tüm Ürünler", href: "/arama" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0b0f17]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0b0f17]/80">
      {/* Üst Bilgi Çubuğu (Announcement Bar) */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-4 py-1.5 text-center text-xs font-semibold text-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-6">
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> 500 TL Üzeri Ücretsiz Kargo
          </span>
          <span className="hidden items-center gap-1.5 md:flex">
            <ShieldCheck className="h-3.5 w-3.5" /> %100 Orijinal Ürün & 14 Gün Kolay İade
          </span>
          <span className="hidden items-center gap-1.5 lg:flex">
            <Sparkles className="h-3.5 w-3.5" /> YILDIZ10 Koduyla %10 İndirim Fırsatı!
          </span>
        </div>
      </div>

      {/* Ana Header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Sol: Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-amber-500/40 bg-black p-0.5 shadow-md transition-transform group-hover:scale-105">
            <Image
              src="/images/logo.jpg"
              alt="Sarıyıldız Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wider text-white group-hover:text-amber-400 transition-colors">
              SARIYILDIZ
            </span>
            <span className="text-[10px] tracking-widest text-amber-500 uppercase font-medium">
              Teknoloji & Ekipman
            </span>
          </div>
        </Link>

        {/* Orta: Arama Çubuğu (Desktop) */}
        <div className="hidden flex-1 max-w-md md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Şef bıçağı, GaN şarj aleti, kamp lambası, hoparlör ara..."
              className="w-full rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 rounded-full bg-amber-500 p-1.5 text-slate-950 hover:bg-amber-400 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

        {/* Sağ: İkonlar */}
        <div className="flex items-center gap-3">
          {/* Giriş Yap / Profil */}
          <Link
            href="/giris"
            className="hidden items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 hover:border-slate-700 hover:text-amber-400 sm:flex transition-colors"
          >
            <User className="h-4 w-4 text-amber-400" />
            <span>Hesabım</span>
          </Link>

          {/* Sepet Butonu */}
          <button
            onClick={openCart}
            aria-label="Sepeti Aç"
            className="relative flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden text-xs font-semibold sm:inline">Sepetim</span>
            {mounted && totalCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-slate-950 shadow-lg animate-pulse">
                {totalCount}
              </span>
            )}
          </button>

          {/* Mobil Menü Butonu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Navigasyon Bar (Kategoriler) */}
      <nav className="hidden border-t border-slate-800/80 bg-slate-950/60 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-6 py-2.5">
          {navCategories.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium tracking-wide text-slate-300 hover:text-amber-400 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobil Arama ve Menü */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-[#0b0f17] px-4 py-4 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün ara..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 pl-10 text-sm text-slate-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </form>
          <div className="flex flex-col space-y-2">
            {navCategories.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-amber-400"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/giris"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-md border border-slate-800 px-3 py-2 text-sm font-medium text-amber-400 hover:bg-slate-800"
            >
              <User className="h-4 w-4" /> Giriş Yap / Kayıt Ol
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
