"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Lock, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError("Geçersiz e-posta adresi veya parola.");
        setLoading(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 800);
      }
    } catch {
      setError("Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail("demo@sariyildiz.com");
    setPassword("123456");
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border border-slate-800 bg-[#0e1320] p-8 shadow-2xl">
        {/* Logo ve Başlık */}
        <div className="text-center">
          <div
            className="mx-auto relative h-16 w-16 overflow-hidden rounded-full border border-amber-500/40 bg-black mb-4 flex items-center justify-center shadow-lg"
            style={{ position: "relative" }}
          >
            <Image
              src="/images/logo.jpg"
              alt="Sarıyıldız Logo"
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Giriş Yap</h1>
          <p className="mt-1 text-xs text-slate-400">
            Sarıyıldız hesabınıza giriş yaparak siparişlerinizi yönetin
          </p>
        </div>

        {/* Hata veya Başarı Bildirimi */}
        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
            <span>Giriş başarılı! Yönlendiriliyorsunuz...</span>
          </div>
        )}

        {/* E-Posta / Parola Formu */}
        <form onSubmit={handleCredentialsLogin} className="mt-6 space-y-4">
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
            <span>{loading ? "Doğrulanıyor..." : "Giriş Yap"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Hızlı Demo Doldurma Butonu (Kolay Test İçin) */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-[11px] text-slate-400 hover:text-amber-400 underline transition-colors"
          >
            ⚡ Test için demo hesap bilgilerini otomatik doldur (demo@sariyildiz.com)
          </button>
        </div>

        {/* Kayıt Ol Yönlendirmesi */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Henüz hesabınız yok mu?{" "}
          <Link href="/kayit" className="font-semibold text-amber-400 hover:underline">
            Hemen Kayıt Olun
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md py-20 text-center text-slate-400">Giriş sayfası yükleniyor...</div>}>
      <LoginForm />
    </Suspense>
  );
}
