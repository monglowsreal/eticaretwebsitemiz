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
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch {
      setError("Google ile giriş başlatılamadı.");
      setGoogleLoading(false);
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

        {/* 1. Google ile Giriş Butonu */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900/90 py-3 text-xs font-semibold text-white shadow-md hover:border-slate-500 hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {/* Google Renkli SVG Logosu */}
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? "Google'a Bağlanılıyor..." : "Google ile Giriş Yap"}</span>
          </button>
        </div>

        {/* Veya Ayracı */}
        <div className="relative my-6 text-center text-xs text-slate-500">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-[#0e1320] px-3">veya e-posta ile</span>
        </div>

        {/* 2. E-Posta / Parola Formu */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
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
            disabled={loading || googleLoading}
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
