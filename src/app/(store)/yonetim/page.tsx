"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Plus,
  RefreshCw,
  ExternalLink,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  Edit,
  ArrowRight,
  Search,
  Lock,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  brand?: string;
  price: number; // Kuruş
  compareAtPrice?: number | null;
  stock: number;
  sku?: string;
  description?: string;
  isFeatured?: boolean;
  status?: string;
  category?: any;
  images?: any[];
}

interface OrderItem {
  id?: string;
  productName: string;
  sku?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  totalAmount: number; // Kuruş
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippingAddress?: {
    city?: string;
    district?: string;
    addressLine?: string;
  };
  items?: OrderItem[];
  createdAt: string;
  notes?: string;
}

export default function AdminDashboardPage() {
  // Giriş / Yetki State'leri
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Panel State'leri
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "stock">("products");
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Yapay Zeka ve Ürün Formu State'leri
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);
  const [aiErrorMsg, setAiErrorMsg] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState("sef-bicaklari");
  const [formBrand, setFormBrand] = useState("Sarıyıldız");
  const [formPriceTl, setFormPriceTl] = useState("");
  const [formCompareAtPriceTl, setFormCompareAtPriceTl] = useState("");
  const [formStock, setFormStock] = useState("20");
  const [formSku, setFormSku] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formImageUrl, setFormImageUrl] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);

  // Arama ve Filtre
  const [productSearch, setProductSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("ALL");

  // 1. Yetki Durumunu Denetle
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      if (data.authenticated && data.user) {
        setIsAuthenticated(true);
        setAdminUser(data.user);
        fetchAllData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // 2. Giriş Yap (Login)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError("Lütfen e-posta ve şifrenizi girin.");
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      }

      setIsAuthenticated(true);
      setAdminUser(data.user);
      fetchAllData();
    } catch (err: any) {
      setLoginError(err.message || "Giriş yapılamadı.");
    } finally {
      setLoginLoading(false);
    }
  };

  // 3. Çıkış Yap (Logout)
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {}
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  // 4. Panel Verilerini Çek
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [metRes, prodRes, ordRes] = await Promise.all([
        fetch("/api/admin/metrics").then((r) => r.json()),
        fetch("/api/admin/products").then((r) => r.json()),
        fetch("/api/admin/orders").then((r) => r.json()),
      ]);

      if (metRes.success) setMetrics(metRes.metrics);
      if (prodRes.success && Array.isArray(prodRes.products)) {
        setProducts(prodRes.products);
      }
      if (ordRes.success && Array.isArray(ordRes.orders)) {
        setOrders(ordRes.orders);
      }
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  // Gemini ile Otomatik Ürün İçeriği Doldur
  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim()) {
      setAiErrorMsg("Lütfen ürün fikri veya özelliklerini yazın.");
      return;
    }

    setAiGenerating(true);
    setAiSuccessMsg(null);
    setAiErrorMsg(null);

    try {
      const res = await fetch("/api/admin/ai/generate-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt.trim(), categoryHint: formCategory }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gemini yanıt üretemedi.");
      }

      const p = data.product;
      setFormName(p.name || "");
      setFormSlug(p.slug || "");
      setFormBrand(p.brand || "Sarıyıldız");
      setFormPriceTl((p.price / 100).toFixed(2));
      if (p.compareAtPrice) {
        setFormCompareAtPriceTl((p.compareAtPrice / 100).toFixed(2));
      }
      setFormStock(String(p.stock || 20));
      setFormSku(p.sku || "");
      setFormDescription(p.description || "");
      setFormIsFeatured(Boolean(p.isFeatured));
      setFormCategory(p.categorySlug || formCategory);
      if (p.suggestedImageUrl) {
        setFormImageUrl(p.suggestedImageUrl);
      }

      setAiSuccessMsg(`✨ "${p.name}" için tüm teknik detaylar, fiyat ve SEO metni Gemini tarafından hazırlandı!`);
    } catch (err: any) {
      setAiErrorMsg(err.message || "Yapay zeka yanıt veremedi.");
    } finally {
      setAiGenerating(false);
    }
  };

  // Ürünü Veritabanına Kaydet & Canlıya Al
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPriceTl) {
      alert("Lütfen en azından Ürün Adı ve Fiyat girin.");
      return;
    }

    setSavingProduct(true);
    try {
      const priceKurus = Math.round(parseFloat(formPriceTl.replace(",", ".")) * 100);
      const compareAtPriceKurus = formCompareAtPriceTl
        ? Math.round(parseFloat(formCompareAtPriceTl.replace(",", ".")) * 100)
        : null;

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          slug: formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          categorySlug: formCategory,
          brand: formBrand,
          price: priceKurus,
          compareAtPrice: compareAtPriceKurus,
          sku: formSku || `SY-${Date.now().toString().slice(-6)}`,
          stock: parseInt(formStock) || 0,
          description: formDescription,
          isFeatured: formIsFeatured,
          imageUrl: formImageUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Ürün kaydedilemedi.");
      }

      alert("🎉 Ürün başarıyla kaydedildi ve mağazada canlıya alındı!");
      setFormName("");
      setFormSlug("");
      setFormPriceTl("");
      setFormCompareAtPriceTl("");
      setFormStock("20");
      setFormSku("");
      setFormDescription("");
      setFormImageUrl("");
      setAiPrompt("");
      setAiSuccessMsg(null);
      fetchAllData();
    } catch (err: any) {
      alert("Hata: " + (err.message || "Bilinmeyen bir hata oluştu."));
    } finally {
      setSavingProduct(false);
    }
  };

  // Hızlı Stok Değiştir
  const handleQuickStock = async (productId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
        );
      }
    } catch (err) {
      console.error("Stok güncelleme hatası:", err);
    }
  };

  // Ürünü Sil
  const handleDeleteProduct = async (productId: string, name: string) => {
    if (!confirm(`"${name}" ürününü mağazadan silmek istediğinize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        alert("Ürün silindi.");
      }
    } catch {
      alert("Silme işlemi başarısız oldu.");
    }
  };

  // Sipariş Durumu Güncelle
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        alert(`Sipariş durumu güncellendi: ${newStatus}`);
      }
    } catch (err) {
      alert("Sipariş güncellenemedi.");
    }
  };

  // Kargo Bilgisi Güncelle
  const handleUpdateShipping = async (orderId: string, carrier: string, trackingNumber: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carrier,
          trackingNumber,
          status: "shipped",
        }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, carrier, trackingNumber, status: "shipped" }
              : o
          )
        );
        alert("Kargo bilgisi kaydedildi ve sipariş 'Kargoya Verildi' olarak güncellendi.");
      }
    } catch {
      alert("Kargo bilgisi güncellenemedi.");
    }
  };

  // Filtreli Ürünler
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()))
  );

  // Filtreli Siparişler
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "ALL") return true;
    return o.status === orderFilter;
  });

  // ==========================================
  // DURUM 1: YÜKLENİYOR
  // ==========================================
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-slate-100 font-sans">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Yönetici yetkisi denetleniyor...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // DURUM 2: GİRİŞ YAPILMAMIŞ - GİRİŞ EKRANI
  // ==========================================
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-slate-100 font-sans px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo & Marka Başlığı */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 items-center justify-center font-bold text-slate-950 text-2xl shadow-xl shadow-amber-500/20 mb-3">
              ★
            </div>
            <h1 className="text-2xl font-black tracking-wider text-white">SARIYILDIZ</h1>
            <p className="text-xs text-amber-400/90 font-bold uppercase tracking-widest mt-1">
              Yönetim Kokpiti Girişi
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Bu alana yalnızca yetkili mağaza yöneticileri giriş yapabilir.
            </p>
          </div>

          {/* Giriş Kartı */}
          <div className="bg-[#0c1324] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Yönetici E-Posta Adresi
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@sariyildiz.com veya kendi e-postanız"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Yönetici Şifresi
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm py-3 rounded-xl transition shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className={`w-4 h-4 ${loginLoading ? "animate-spin" : ""}`} />
                <span>{loginLoading ? "Giriş Yapılıyor..." : "Yönetici Girişi Yap"}</span>
              </button>
            </form>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-amber-400 transition flex items-center justify-center gap-1.5"
            >
              <span>← Mağaza Vitrinine Dön</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // DURUM 3: GİRİŞ YAPILMIŞ - YÖNETİM KOKPİTİ
  // ==========================================
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-24">
      {/* ÜST BAŞLIK & MARKA ÇUBUĞU */}
      <header className="border-b border-slate-800 bg-[#0a101f]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-amber-500/20">
              ★
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white">SARIYILDIZ</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Yönetim Kokpiti
                </span>
              </div>
              <p className="text-xs text-slate-400">Ürün, Sipariş ve Stok Kontrol Masası</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Yönetici Rozeti */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium text-slate-300">{adminUser?.email}</span>
            </div>

            <button
              onClick={fetchAllData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-900/60 text-xs font-semibold text-slate-300 hover:text-white transition"
              title="Verileri Yenile"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-400" : ""}`} />
              <span className="hidden sm:inline">Yenile</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20"
            >
              <span>Mağaza</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 text-xs font-semibold transition"
              title="Güvenli Çıkış"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      {/* METRİK ŞERİDİ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0c1324] border border-slate-800/80 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Toplam Ciro</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400">
              {metrics ? (metrics.totalRevenueKurus / 100).toLocaleString("tr-TR") : "0"} ₺
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Ödenen siparişler toplamı</div>
          </div>

          <div className="bg-[#0c1324] border border-slate-800/80 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Siparişler</span>
              <ShoppingCart className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {metrics ? metrics.totalOrdersCount : orders.length} Adet
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Toplam kayıtlı sipariş</div>
          </div>

          <div className="bg-[#0c1324] border border-slate-800/80 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Yayındaki Ürünler</span>
              <Package className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {products.length} Ürün
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Aktif mağaza envanteri</div>
          </div>

          <div className="bg-[#0c1324] border border-slate-800/80 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Kritik Stok</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-rose-400">
              {products.filter((p) => p.stock <= 5).length} Ürün
            </div>
            <div className="text-[11px] text-rose-400/80 mt-1">≤ 5 adet kalanlar</div>
          </div>
        </div>
      </section>

      {/* ANA SEKMELER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex border-b border-slate-800 gap-2 mb-6">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
              activeTab === "products"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Ürün Ekle & Gemini AI</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
              activeTab === "orders"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Siparişler & Kargo Takibi ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("stock")}
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
              activeTab === "stock"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Stok Masası & Envanter</span>
          </button>
        </div>

        {/* ===================== SEKME 1: ÜRÜNLER & YAPAY ZEKA ===================== */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SOL: ÜRÜN EKLEME & GEMINI AI ALANI */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* 1.1 Gemini AI Akıllı Üretici Kartı */}
              <div className="bg-gradient-to-br from-[#0c1427] to-[#141f36] border border-amber-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full tracking-wider">
                    GEMINI 2.5 FLASH
                  </span>
                  <h3 className="font-bold text-white text-sm">Yapay Zeka ile Otomatik Doldur</h3>
                </div>

                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  Aklınızdaki ürünü bir cümleyle yazın; başlık, teknik özellikler, fiyat (TL) ve SEO metnini aşağıdaki forma doldursun.
                </p>

                {/* Hızlı Şablonlar */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[
                    "67 Katman VG10 Şam Çeliği Şef Bıçağı",
                    "100W GaN Pro 4 Port Hızlı Şarj Cihazı",
                    "Solar Şarjlı 10.000mAh Kamp Lambası",
                    "IPX7 Su Geçirmez 30W Bluetooth Hoparlör",
                  ].map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAiPrompt(tpl)}
                      className="text-[10px] bg-slate-900/80 border border-slate-700/80 hover:border-amber-400/50 hover:text-amber-300 text-slate-300 px-2 py-1 rounded transition"
                    >
                      {tpl}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Örnek: 20 cm Şam çeliği ceviz saplı santoku bıçağı..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleGenerateWithAi();
                      }
                    }}
                  />
                  <button
                    type="button"
                    disabled={aiGenerating}
                    onClick={handleGenerateWithAi}
                    className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${aiGenerating ? "animate-spin" : ""}`} />
                    <span>{aiGenerating ? "Üretiyor..." : "Üret"}</span>
                  </button>
                </div>

                {aiSuccessMsg && (
                  <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                    {aiSuccessMsg}
                  </div>
                )}
                {aiErrorMsg && (
                  <div className="mt-3 p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
                    {aiErrorMsg}
                  </div>
                )}
              </div>

              {/* 1.2 Ürün Ekleme / Düzenleme Formu */}
              <form onSubmit={handleSaveProduct} className="bg-[#0c1324] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>Yeni Ürünü Kaydet</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">Doğrudan Mağazaya Ekler</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Ürün Adı *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Sarıyıldız VG-10 Şam Çeliği 67 Katman Şef Bıçağı"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Kategori</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="sef-bicaklari">Mutfak & Şef Bıçakları</option>
                      <option value="sarj-cihazlari">Elektronik & Şarj Çözümleri</option>
                      <option value="kamp-fenerleri">Outdoor & Kamp Lambaları</option>
                      <option value="hoparlorler">Ses & Bluetooth Hoparlörler</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Marka</label>
                    <input
                      type="text"
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Satış Fiyatı (TL) *</label>
                    <input
                      type="text"
                      required
                      value={formPriceTl}
                      onChange={(e) => setFormPriceTl(e.target.value)}
                      placeholder="299.90"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Eski Fiyat (TL)</label>
                    <input
                      type="text"
                      value={formCompareAtPriceTl}
                      onChange={(e) => setFormCompareAtPriceTl(e.target.value)}
                      placeholder="399.90 (Opsiyonel)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Başlangıç Stoku *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Stok Kodu (SKU)</label>
                    <input
                      type="text"
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      placeholder="SY-KN-VG10"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Görsel URL</label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... (boşsa varsayılan atanır)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Ürün Açıklaması</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Ürünün malzeme kalitesi, teknik özellikleri ve kullanım detayları..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                  />
                  <label htmlFor="featuredCheckbox" className="text-xs text-slate-300 select-none">
                    ⭐ Öne Çıkan Ürün (Ana Sayfada Göster)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={savingProduct}
                  className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm py-3 rounded-xl transition shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{savingProduct ? "Veritabanına Kaydediliyor..." : "Ürünü Kaydet & Canlıya Al"}</span>
                </button>
              </form>
            </div>

            {/* SAĞ: MEVCUT ÜRÜNLER LİSTESİ */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-[#0c1324] border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-bold text-white text-base">Mağazadaki Ürünler ({filteredProducts.length})</h3>
                    <p className="text-xs text-slate-400">Ürünlerinizi görüntüleyin, stoklarını anında güncelleyin veya silin.</p>
                  </div>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Ürün veya SKU ara..."
                      className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full sm:w-56"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                        <th className="py-2.5 px-3">Ürün</th>
                        <th className="py-2.5 px-3">Fiyat</th>
                        <th className="py-2.5 px-3 text-center">Stok</th>
                        <th className="py-2.5 px-3 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/40 transition">
                          <td className="py-3 px-3">
                            <div className="font-bold text-white line-clamp-1">{p.name}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>SKU: {p.sku || "-"}</span>
                              {p.isFeatured && (
                                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-semibold">
                                  Öne Çıkan
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-amber-400">
                            {(p.price / 100).toFixed(2)} ₺
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleQuickStock(p.id, p.stock, -1)}
                                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs"
                                title="1 Azalt"
                              >
                                -
                              </button>
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-bold font-mono min-w-9 text-center ${
                                  p.stock <= 5
                                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                    : p.stock <= 15
                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                }`}
                              >
                                {p.stock}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQuickStock(p.id, p.stock, 1)}
                                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs"
                                title="1 Arttır"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded transition"
                              title="Ürünü Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-500 text-xs">
                            Kayıtlı ürün bulunamadı. Soldaki formdan veya Gemini ile ilk ürününüzü ekleyin.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== SEKME 2: SİPARİŞLER & KARGO ===================== */}
        {activeTab === "orders" && (
          <div className="bg-[#0c1324] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="font-bold text-white text-base">Sipariş & Kargo Yönetim Masası</h3>
                <p className="text-xs text-slate-400">
                  Gelen siparişleri inceleyin, durumlarını değiştirin ve kargo takip numaralarını girin.
                </p>
              </div>

              {/* Filtre Butonları */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Tümü", value: "ALL" },
                  { label: "Ödeme Bekleniyor", value: "pending_payment" },
                  { label: "Ödendi", value: "paid" },
                  { label: "Hazırlanıyor", value: "processing" },
                  { label: "Kargoda", value: "shipped" },
                  { label: "Teslim Edildi", value: "delivered" },
                ].map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setOrderFilter(f.value)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                      orderFilter === f.value
                        ? "bg-amber-400 text-slate-950 font-bold"
                        : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sipariş Listesi */}
            <div className="flex flex-col gap-4">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition"
                >
                  {/* Sipariş & Müşteri Özeti */}
                  <div className="flex flex-col gap-1 min-w-[280px]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">
                        {ord.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.status === "paid"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : ord.status === "shipped"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : ord.status === "delivered"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : ord.status === "processing"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {ord.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 font-semibold mt-1">
                      👤 {ord.customerName || "Misafir Müşteri"} ({ord.customerEmail || "-"})
                    </div>
                    {ord.customerPhone && (
                      <div className="text-[11px] text-slate-400">📞 {ord.customerPhone}</div>
                    )}
                    {ord.shippingAddress && (
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        📍 {ord.shippingAddress.city} / {ord.shippingAddress.district} - {ord.shippingAddress.addressLine}
                      </div>
                    )}
                  </div>

                  {/* Kalemler & Tutar */}
                  <div className="flex flex-col gap-1 text-xs text-slate-300">
                    <div className="font-bold text-amber-400 font-mono text-sm">
                      {(ord.totalAmount / 100).toFixed(2)} ₺
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {ord.items && ord.items.length > 0
                        ? ord.items.map((i) => `${i.productName} (${i.quantity} ad.)`).join(", ")
                        : "Detay belirtilmemiş"}
                    </div>
                  </div>

                  {/* Durum & Kargo İşlemleri */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
                    >
                      <option value="pending_payment">💳 Ödeme Bekleniyor</option>
                      <option value="paid">✅ Ödendi (Onaylandı)</option>
                      <option value="processing">📦 Hazırlanıyor</option>
                      <option value="shipped">🚚 Kargoya Verildi</option>
                      <option value="delivered">🎉 Teslim Edildi</option>
                      <option value="cancelled">❌ İptal Edildi</option>
                      <option value="refunded">🔄 İade Edildi</option>
                    </select>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        defaultValue={ord.trackingNumber || ""}
                        placeholder="Kargo Takip No..."
                        id={`track-${ord.id}`}
                        className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 w-32 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById(`track-${ord.id}`) as HTMLInputElement;
                          handleUpdateShipping(ord.id, ord.carrier || "Yurtiçi Kargo", input?.value || "");
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-2.5 py-1.5 rounded-lg transition"
                      >
                        Kaydet
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-xs">
                  Bu filtrede görüntülenecek sipariş bulunmuyor.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== SEKME 3: STOK MASASI ===================== */}
        {activeTab === "stock" && (
          <div className="bg-[#0c1324] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-6">
            <div>
              <h3 className="font-bold text-white text-base">Canlı Stok Masası & Envanter Kontrolü</h3>
              <p className="text-xs text-slate-400">
                Tüm ürünlerin anlık stok durumunu kontrol edin ve tükenmekte olan ürünleri hızlıca ikmal edin.
              </p>
            </div>

            {/* Kritik Stok Kutusu */}
            <div className="border border-rose-500/30 bg-rose-500/10 rounded-xl p-4">
              <h4 className="font-bold text-rose-300 text-xs flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Kritik Stok Uyarısı (≤ 5 Adet Kalanlar)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {products
                  .filter((p) => p.stock <= 5)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="bg-slate-950/80 border border-rose-500/20 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white text-xs line-clamp-1">{p.name}</div>
                        <div className="text-[11px] text-rose-400 font-bold mt-0.5">
                          Kalan: {p.stock} adet
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuickStock(p.id, p.stock, 20)}
                        className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs px-2.5 py-1 rounded transition"
                      >
                        +20 Ekle
                      </button>
                    </div>
                  ))}
                {products.filter((p) => p.stock <= 5).length === 0 && (
                  <div className="col-span-3 text-emerald-400 text-xs py-2">
                    ✅ Tebrikler! Kritik stok seviyesinde ürün bulunmuyor.
                  </div>
                )}
              </div>
            </div>

            {/* Toplu Stok İkmal Tablosu */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="py-2.5 px-3">Ürün Adı</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3">Mevcut Stok</th>
                    <th className="py-2.5 px-3">Durum</th>
                    <th className="py-2.5 px-3 text-right">Hızlı İkmal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-3 px-3 font-semibold text-white">{p.name}</td>
                      <td className="py-3 px-3 font-mono text-slate-400">{p.sku || "-"}</td>
                      <td className="py-3 px-3 font-mono font-bold text-white text-sm">
                        {p.stock}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.stock === 0
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              : p.stock <= 5
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          }`}
                        >
                          {p.stock === 0 ? "Tükendi" : p.stock <= 5 ? "Kritik" : "Yeterli"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickStock(p.id, p.stock, 10)}
                            className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-2 py-1 rounded text-slate-200 transition"
                          >
                            +10
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickStock(p.id, p.stock, 50)}
                            className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-2 py-1 rounded text-slate-200 transition"
                          >
                            +50
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
