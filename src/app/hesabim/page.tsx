"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, Package, MapPin, LogOut, Shield, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-slate-400">
        Hesap bilgileri yükleniyor...
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-slate-800 bg-[#0e1320] text-amber-500">
          <User className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-white">Hesabınıza Giriş Yapın</h1>
        <p className="mt-2 text-xs text-slate-400">
          Siparişlerinizi ve hesap tercihlerinizi görüntülemek için lütfen giriş yapın.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/giris"
            className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 gold-glow"
          >
            Giriş Yap
          </Link>
          <Link
            href="/kayit"
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
          >
            Kayıt Ol
          </Link>
        </div>
      </div>
    );
  }

  const user = session.user;
  const isAdmin = (user as unknown as { role?: string })?.role === "ADMIN" || user.email?.includes("admin");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Üst Karşılama Kartı */}
      <div className="rounded-3xl border border-slate-800 bg-[#0e1320] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/40 bg-slate-900 text-amber-400 font-bold text-xl uppercase">
            {user.name ? user.name.slice(0, 2) : "SY"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{user.name || "Kullanıcı"}</h1>
              {isAdmin && (
                <span className="rounded-md bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                  YÖNETİCİ
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isAdmin && (
            <Link
              href="/admin"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all"
            >
              <Shield className="h-4 w-4" />
              <span>Yönetim Paneli</span>
            </Link>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-red-400 hover:border-red-900 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Siparişlerim & Adresler */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sol 2 Kolon: Son Siparişler */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#0e1320] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-500" />
              Sipariş Geçmişim
            </h2>
            <span className="text-xs text-slate-400">1 Sipariş</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-400">Sipariş No: </span>
                <span className="font-mono font-bold text-amber-400">SY-202610-8421</span>
              </div>
              <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                Hazırlanıyor
              </span>
            </div>

            <div className="border-t border-slate-800/80 pt-2 text-xs text-slate-300">
              <p className="font-medium text-white">Sarıyıldız Pro Dövme Şef Bıçağı 20 cm</p>
              <p className="text-[11px] text-slate-400">Adet: 1 · Fiyat: {formatPrice(84900)}</p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
              <span className="text-slate-400">Toplam Tutar:</span>
              <span className="font-bold text-white text-sm">{formatPrice(84900)}</span>
            </div>
          </div>
        </div>

        {/* Sağ 1 Kolon: Kayıtlı Adres & Güvenlik */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#0e1320] p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-500" />
              Kayıtlı Adresim
            </h3>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-white">Ev Adresi</p>
              <p className="text-slate-400">Kadıköy, İstanbul</p>
              <p className="text-[11px] text-slate-500">Varsayılan teslimat adresi</p>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-slate-900 to-[#121926] p-6 text-xs text-slate-300 space-y-3">
            <h4 className="font-bold text-white">Alışverişe Devam Et</h4>
            <p className="text-slate-400 leading-relaxed">
              En yeni GaN şarj cihazları ve dövme şef bıçakları koleksiyonumuzu inceleyin.
            </p>
            <Link
              href="/arama"
              className="inline-flex items-center gap-1.5 text-amber-400 font-semibold hover:underline"
            >
              <span>Kataloğa Göz At</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
