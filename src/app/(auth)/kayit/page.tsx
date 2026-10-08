"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 800);
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border border-slate-800 bg-[#0e1320] p-8 shadow-2xl">
        <div className="text-center">
          <div
            className="mx-auto relative h-16 w-16 overflow-hidden rounded-full border border-amber-500/40 bg-black mb-4 flex items-center justify-center"
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
          <h1 className="text-2xl font-extrabold text-white">Hesap Oluştur</h1>
          <p className="mt-1 text-xs text-slate-400">
            Aramıza katılın ve özel ayrıcalıklardan yararlanın
          </p>
        </div>

        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300">Adınız</label>
              <div className="relative mt-1.5">
                <input
                  type="text"
                  required
                  placeholder="Ahmet"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Soyadınız</label>
              <div className="relative mt-1.5">
                <input
                  type="text"
                  required
                  placeholder="Yılmaz"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

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
            <label className="text-xs font-medium text-slate-300">Parola</label>
            <div className="relative mt-1.5">
              <input
                type="password"
                required
                minLength={6}
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <label className="flex items-start gap-2.5 text-[11px] text-slate-400 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500"
            />
            <span>
              Kampanya, indirim ve yeni ürün duyuruları hakkında elektronik ticari ileti almayı kabul ediyorum (İYS uyumlu).
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 py-3 text-xs font-bold text-slate-950 shadow-lg hover:from-amber-400 hover:to-yellow-400 transition-all gold-glow disabled:opacity-50"
          >
            <span>{loading ? "Kaydediliyor..." : "Hesap Oluştur"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" className="font-semibold text-amber-400 hover:underline">
            Giriş Yapın
          </Link>
        </div>
      </div>
    </div>
  );
}
