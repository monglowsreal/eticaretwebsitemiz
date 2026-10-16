"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ShieldCheck,
  Truck,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  Shield,
  Package,
  Award,
  Check,
  Flame,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

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
      setMobileMenuOpen(false);
    }
  };

  const handleCopyCoupon = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("YILDIZ10");
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2000);
    }
  };

  const navCategories = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Profesyonel Şef Bıçakları", href: "/kategori/sef-bicaklari", badge: "Popüler" },
    { name: "Sürmene & Kasap Satırları", href: "/kategori/satirlar", badge: "El Dövmesi" },
    { name: "Şarj & Güç Çözümleri", href: "/kategori/sarj-cihazlari" },
    { name: "Kamp & Outdoor", href: "/kategori/kamp-fenerleri" },
    { name: "Tüm Koleksiyon", href: "/arama" },
  ];

  const user = session?.user;
  const isAdmin =
    (user as unknown as { role?: string })?.role === "ADMIN" ||
    user?.email?.includes("admin") ||
    user?.email?.includes("sariyildiz");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070a0f]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[#070a0f]/85">
      {/* Üst Bilgi Çubuğu (Luxury Announcement Bar) */}
      <div className="border-b border-amber-500/20 bg-gradient-to-r from-[#0d121d] via-[#17130a] to-[#0d121d] px-4 py-2 text-center text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="hidden items-center gap-2 text-slate-300 sm:flex">
            <Award className="h-3.5 w-3.5 text-amber-400" />
            <span>Orijinal Sürmene & Alman X50CrMoV15 Çelik Garantisi</span>
          </div>

          <div className="mx-auto flex items-center gap-4 sm:mx-0">
            <span className="flex items-center gap-1.5 font-medium text-slate-200">
              <Truck className="h-3.5 w-3.5 text-amber-400" />
              <span>500 ₺ Üzeri Ücretsiz Sigortalı Kargo</span>
            </span>
            <span className="hidden text-slate-700 md:inline">|</span>
            <button
              onClick={handleCopyCoupon}
              title="Kupon kodunu kopyalamak için tıklayın"
              className="hidden items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 hover:border-amber-400 hover:bg-amber-500/20 transition-all md:inline-flex cursor-pointer"
            >
              {copiedCoupon ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-300">YILDIZ10 Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>İlk Siparişe %10 İndirim:</span>
                  <span className="font-mono font-bold text-amber-400 underline decoration-dotted">YILDIZ10</span>
                </>
              )}
            </button>
          </div>

          <div className="hidden items-center gap-3 text-[11px] text-slate-400 lg:flex">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 14 Gün Koşulsuz İade
            </span>
          </div>
        </div>
      </div>

      {/* Ana Header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        {/* Sol: Marka & Logo */}
        <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-amber-500/40 bg-black p-0.5 shadow-lg shadow-amber-500/10 transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400 flex items-center justify-center">
            <Image
              src="/images/logo.jpg"
              alt="Sarıyıldız Logo"
              width={48}
              height={48}
              className="rounded-xl object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-[0.14em] text-white group-hover:text-amber-400 transition-colors">
              SARIYILDIZ
            </span>
            <span className="text-[10px] tracking-[0.22em] text-amber-500/90 uppercase font-semibold">
              Bıçak & Ekipman Atölyesi
            </span>
          </div>
        </Link>

        {/* Orta: Arama Çubuğu (Desktop) */}
        <div className="hidden flex-1 max-w-lg md:block mx-4">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sürmene satır, X50CrMoV15 şef bıçağı, ceviz saplı bıçak ara..."
              className="w-full rounded-2xl border border-slate-800 bg-[#0d131f]/90 px-4 py-2.5 pl-11 pr-20 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500/70 focus:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-400 transition-colors" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1.5 text-[11px] font-bold text-slate-950 hover:from-amber-400 hover:to-yellow-400 transition-all shadow-sm"
            >
              Ara
            </button>
          </form>
        </div>

        {/* Sağ: Aksiyon İkonları */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Yönetim Kokpiti Hızlı Geçiş */}
          <Link
            href="/yonetim"
            className="hidden xl:flex items-center gap-1.5 rounded-xl border border-slate-800/90 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-amber-500/40 hover:text-amber-400 transition-all"
            title="Mağaza Yönetim Kokpiti"
          >
            <Shield className="h-3.5 w-3.5 text-amber-400" />
            <span>Yönetim</span>
          </Link>

          {/* Giriş Yap veya Kullanıcı Menüsü */}
          {user ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-white hover:border-amber-500/50 transition-all"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-[10px] font-extrabold text-slate-950 uppercase">
                  {user.name ? user.name.slice(0, 2) : "SY"}
                </div>
                <span className="max-w-[90px] truncate">{user.name?.split(" ")[0] || "Hesabım"}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-800 bg-[#0d121d] p-2 shadow-2xl z-50 text-xs space-y-1"
                >
                  <div className="px-3 py-2 border-b border-slate-800/80">
                    <p className="font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/hesabim"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-300 hover:bg-slate-900 hover:text-amber-400 transition-colors"
                  >
                    <Package className="h-4 w-4" />
                    <span>Siparişlerim & Profil</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/yonetim"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-amber-400 hover:bg-amber-500/10 font-medium transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Yönetim Kokpiti</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/giris"
              className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-amber-500/50 hover:text-amber-400 sm:flex transition-all"
            >
              <User className="h-4 w-4 text-amber-400" />
              <span>Giriş Yap</span>
            </Link>
          )}

          {/* Sepet Butonu */}
          <button
            onClick={openCart}
            aria-label="Sepeti Aç"
            className="relative flex items-center gap-2 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 to-yellow-500/10 px-4 py-2 text-amber-300 hover:border-amber-400 hover:from-amber-500/25 hover:to-yellow-500/20 transition-all shadow-sm"
          >
            <ShoppingBag className="h-4 w-4 text-amber-400" />
            <span className="hidden text-xs font-bold sm:inline">Sepetim</span>
            {mounted && totalCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1.5 text-[11px] font-extrabold text-slate-950 shadow-md">
                {totalCount}
              </span>
            )}
          </button>

          {/* Mobil Menü Butonu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-300 hover:border-slate-700 hover:text-white md:hidden"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Masaüstü Kategori Navigasyon Barı */}
      <nav className="hidden border-t border-slate-800/60 bg-[#05080d]/90 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-1">
            {navCategories.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-4 py-3 text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "text-amber-400"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-amber-400">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] font-medium text-amber-400/90">
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            <span>Aynı Gün Kargo & Özel Korumalı Kutu</span>
          </div>
        </div>
      </nav>

      {/* Mobil Arama ve Menü */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-[#080c14] px-4 py-5 md:hidden space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Şef bıçağı, Sürmene satır, masat ara..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 pl-10 text-xs text-slate-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </form>

          <div className="flex flex-col space-y-1">
            {navCategories.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-900 hover:text-amber-400 transition-colors"
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            <div className="border-t border-slate-800/80 pt-3 mt-2 space-y-1.5">
              <Link
                href="/yonetim"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-amber-400 hover:bg-slate-900"
              >
                <Shield className="h-4 w-4" />
                <span>Yönetim Kokpiti</span>
              </Link>

              {user ? (
                <>
                  <Link
                    href="/hesabim"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-slate-900"
                  >
                    <User className="h-4 w-4 text-amber-400" />
                    <span>{user.name} (Hesabım)</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-slate-900"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/giris"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-400"
                >
                  <User className="h-4 w-4" /> Giriş Yap / Kayıt Ol
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
