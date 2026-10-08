import { DollarSign, ShoppingCart, Users, Package, ArrowUpRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { PRODUCTS } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Toplam Ciro (Aylık)",
      value: formatPrice(18495000), // 184.950 TL
      change: "+18.4%",
      icon: DollarSign,
    },
    {
      title: "Toplam Sipariş",
      value: "248 Adet",
      change: "+12.2%",
      icon: ShoppingCart,
    },
    {
      title: "Aktif Ürün Sayısı",
      value: `${PRODUCTS.length} Ürün`,
      change: "4 Kategori",
      icon: Package,
    },
    {
      title: "Ortalama Sepet Tutarı",
      value: formatPrice(74500), // 745.00 TL
      change: "+5.1%",
      icon: Users,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-400">
            YÖNETİM PANELİ
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
            Sarıyıldız Mağaza Özeti
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/"
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
          >
            Mağazayı Görüntüle
          </Link>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-[#0e1320] p-6 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{s.title}</span>
                <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <p className="text-xl font-extrabold text-white">{s.value}</p>
                <span className="flex items-center text-xs font-bold text-emerald-400">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {s.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Siparişler ve Düşük Stok Uyarısı */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Son Siparişler (2 Kolon) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#0e1320] p-6">
          <h2 className="text-base font-bold text-white mb-4">Son Siparişler</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 text-[11px] uppercase text-slate-500">
                <tr>
                  <th className="pb-3">Sipariş No</th>
                  <th className="pb-3">Müşteri</th>
                  <th className="pb-3">Durum</th>
                  <th className="pb-3">Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                <tr>
                  <td className="py-3 font-mono text-amber-400">SY-202610-8421</td>
                  <td className="py-3">Mehmet Kaya</td>
                  <td className="py-3">
                    <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                      Ödendi
                    </span>
                  </td>
                  <td className="py-3 font-bold text-white">{formatPrice(119900)}</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-amber-400">SY-202610-8420</td>
                  <td className="py-3">Fatma Demir</td>
                  <td className="py-3">
                    <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-400 border border-blue-500/20">
                      Kargoya Verildi
                    </span>
                  </td>
                  <td className="py-3 font-bold text-white">{formatPrice(84900)}</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-amber-400">SY-202610-8419</td>
                  <td className="py-3">Can Yıldırım</td>
                  <td className="py-3">
                    <span className="rounded-md bg-yellow-500/10 px-2 py-0.5 text-[11px] font-semibold text-yellow-400 border border-yellow-500/20">
                      Hazırlanıyor
                    </span>
                  </td>
                  <td className="py-3 font-bold text-white">{formatPrice(68900)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Düşük Stok Uyarısı (1 Kolon) */}
        <div className="rounded-2xl border border-slate-800 bg-[#0e1320] p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Kritik Stok Uyarıları</h2>
          </div>
          <div className="space-y-3 text-xs">
            {PRODUCTS.slice(0, 3).map((p) => {
              const v = p.variants[0];
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3"
                >
                  <div>
                    <p className="font-semibold text-white line-clamp-1">{p.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{v.sku}</p>
                  </div>
                  <span className="rounded-md bg-amber-500/10 px-2 py-1 font-bold text-amber-400 border border-amber-500/30">
                    {v.stock} Adet
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
