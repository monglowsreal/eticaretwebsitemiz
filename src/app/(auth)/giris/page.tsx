"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simüle edilmiş başarılı giriş
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 800);
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border border-slate-800 bg-[#0e1320] p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto relative h-16 w-16 overflow-hidden rounded-full border border-amber-500/40 bg-black mb-4">
            <Image
              src="/images/logo.jpg"
              alt="Sarıyıldız Logo"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Giriş Yap</h1>
          <p className="mt-1 text-xs text-slate-400">
            Sarıyıldız hesabınıza giriş yaparak siparişlerinizi takip edin
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300">E-Posta Adresi</label>
            <div className="relative mt-1.5">
              <input
                type="email"
                required
                placeholder="ornek@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">Parola</label>
              <Link href="#" className="text-[11px] text-amber-400 hover:underline">
                Şifremi Unuttum
              </Link>
            </div>
            <div className="relative mt-1.5">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 py-3 text-xs font-bold text-slate-950 shadow-lg hover:from-amber-400 hover:to-yellow-400 transition-all gold-glow disabled:opacity-50"
          >
            <span>{loading ? "Giriş Yapılıyor..." : "Giriş Yap"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Henüz hesabınız yok mu?{" "}
          <Link href="/kayit" className="font-semibold text-amber-400 hover:underline">
            Kayıt Olun
          </Link>
        </div>
      </div>
    </div>
  );
}
