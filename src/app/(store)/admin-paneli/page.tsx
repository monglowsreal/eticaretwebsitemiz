"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Package,
  ShoppingCart,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Copy,
  ExternalLink,
  Printer,
  TrendingUp,
  DollarSign,
  Plus,
  RefreshCw,
  Search,
  Check,
  ChevronRight,
  ShieldCheck,
  Tag,
  ArrowRight,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

type TabType = "ai-wizard" | "orders" | "analytics" | "coupons";

export default function AdminHubPage() {
  const [activeTab, setActiveTab] = useState<TabType>("ai-wizard");

  // AI Wizard State
  const [prompt, setPrompt] = useState("");
  const [categoryHint, setCategoryHint] = useState("sef-bicaklari");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [generatedProduct, setGeneratedProduct] = useState<any>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [carrierInput, setCarrierInput] = useState("Yurtiçi Kargo");
  const [trackingNumberInput, setTrackingNumberInput] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Metrics State
  const [metrics, setMetrics] = useState<any>({
    totalRevenueKurus: 18495000,
    totalOrdersCount: 248,
    totalProductsCount: 9,
    averageOrderKurus: 74500,
    lowStockItems: [],
  });

  // Coupons State
  const [coupons, setCoupons] = useState([
    {
      code: "YILDIZ10",
      type: "Yüzde",
      value: "%10 İndirim",
      minOrder: 25000,
      isActive: true,
      usageCount: 142,
    },
    {
      code: "HOSGELDIN50",
      type: "Sabit Tutar",
      value: "50.00 TL",
      minOrder: 50000,
      isActive: true,
      usageCount: 89,
    },
    {
      code: "BAHAR2026",
      type: "Yüzde",
      value: "%15 İndirim",
      minOrder: 40000,
      isActive: false,
      usageCount: 64,
    },
  ]);

  // Load Initial Data
  useEffect(() => {
    fetchOrders();
    fetchMetrics();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/admin/metrics");
      const data = await res.json();
      if (data.success && data.metrics) {
        setMetrics(data.metrics);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // AI Product Generation Handler
  const handleGenerateAI = async () => {
    if (!prompt.trim()) {
      setAiError("Lütfen bir ürün fikri, modeli veya özellikleri yazın.");
      return;
    }
    setIsGenerating(true);
    setAiError("");
    setSaveSuccessMessage("");

    try {
      const res = await fetch("/api/admin/ai/generate-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, categoryHint }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gemini yanıt üretemedi.");
      }
      setGeneratedProduct(data.product);
    } catch (err: any) {
      setAiError(err.message || "Bir hata oluştu.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Save AI Generated Product into Database
  const handleSaveProduct = async () => {
    if (!generatedProduct) return;
    setIsSavingProduct(true);
    setAiError("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: generatedProduct.name,
          slug: generatedProduct.slug,
          categorySlug: generatedProduct.categorySlug,
          brand: generatedProduct.brand || "Sarıyıldız",
          price: generatedProduct.price,
          compareAtPrice: generatedProduct.compareAtPrice,
          sku: generatedProduct.sku,
          stock: generatedProduct.stock,
          description: generatedProduct.description,
          isFeatured: generatedProduct.isFeatured,
          imageUrl: generatedProduct.suggestedImageUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Ürün kaydedilemedi.");
      }
      setSaveSuccessMessage(
        `🎉 "${generatedProduct.name}" başarıyla veritabanına kaydedildi ve mağazada canlıya alındı!`
      );
      fetchMetrics();
    } catch (err: any) {
      setAiError(err.message || "Kaydetme sırasında hata oluştu.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string,
    carrier?: string,
    trackingNo?: string
  ) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          carrier: carrier || carrierInput,
          trackingNumber: trackingNo || trackingNumberInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: newStatus,
                  shipments:
                    newStatus === "SHIPPED"
                      ? [
                          {
                            carrier: carrier || carrierInput,
                            trackingNumber: trackingNo || trackingNumberInput,
                            status: "Kargoya Verildi",
                          },
                        ]
                      : o.shipments,
                }
              : o
          )
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev: any) => ({
            ...prev,
            status: newStatus,
          }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      orderStatusFilter === "ALL" || o.status === orderStatusFilter;
    const q = orderSearch.toLowerCase();
    const matchesSearch =
      !orderSearch ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.guestName?.toLowerCase().includes(q) ||
      o.guestEmail?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 pb-20">
      {/* Üst Yönetici Başlık Barı */}
      <div className="border-b border-slate-800 bg-[#0b0f17]/90 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shadow-lg shadow-amber-500/10">
              SY
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-wide">
                  Sarıyıldız Komuta Merkezi
                </h1>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-400 border border-amber-500/30">
                  AI & OMS PRO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Yapay Zeka Destekli Ürün ve Profesyonel Sipariş Yönetimi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
            >
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              Payload CMS Veritabanı
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </Link>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20"
            >
              Mağazayı Canlıda Gör
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Sekme Menüsü */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto border-t border-slate-800/60 pt-2 pb-2 text-xs font-semibold scrollbar-none">
            <button
              onClick={() => setActiveTab("ai-wizard")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
                activeTab === "ai-wizard"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              Gemini AI Ürün Sihirbazı
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
                activeTab === "orders"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <ShoppingCart className="h-4 w-4 text-amber-400" />
              Sipariş Komuta Merkezi ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
                activeTab === "analytics"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <TrendingUp className="h-4 w-4 text-amber-400" />
              Mağaza Analitiği & Kritik Stok
            </button>
            <button
              onClick={() => setActiveTab("coupons")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
                activeTab === "coupons"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Tag className="h-4 w-4 text-amber-400" />
              Kupon & Kampanya Yönetimi
            </button>
          </div>
        </div>
      </div>

      {/* Ana İçerik Alanı */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* ========================================================================= */}
        {/* SEKME 1: GEMINI AI ÜRÜN SİHİRBAZI */}
        {/* ========================================================================= */}
        {activeTab === "ai-wizard" && (
          <div className="space-y-8">
            {/* Tanıtım Kartı */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#121926] via-[#0e1420] to-[#141b2a] p-6 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 h-40 w-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/30">
                  <Sparkles className="h-3.5 w-3.5" />
                  Google Gemini 2.5 Flash Entegrasyonu
                </span>
                <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                  Saniyeler İçinde Kusursuz Ürün Oluşturun
                </h2>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Ürününüzün temel özelliklerini, modelini veya sadece kaba bir fikrini yazın. Gemini yapay zekası; SEO dostu başlık, ikna edici e-ticaret metni, teknik özellikler tablosu, tavsiye edilen fiyat ve kurumsal SKU kodunu otomatik hazırlar.
                </p>
              </div>

              {/* Hızlı Şablonlar */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <p className="text-xs font-semibold text-slate-400 mb-2.5">
                  Hızlı Başlangıç Şablonları (Tıklayın ve Deneyin):
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      label: "🔪 67 Katman VG-10 Şam Çeliği Santoku Bıçağı",
                      prompt:
                        "Japon VG-10 Şam Çeliği Santoku Bıçağı, 67 katman, doğal gül ağacı ergonomik sap, 18 cm, ultra keskinlik ve mükemmel denge.",
                      cat: "sef-bicaklari",
                    },
                    {
                      label: "⚡ 120W GaN Pro 4 Portlu Hızlı Şarj Cihazı",
                      prompt:
                        "120W GaN Pro 3x Type-C + 1x USB-A portlu masaüstü hızlı şarj adaptörü, PD 3.0, QC 4+, laptop ve telefonlar için aşırı ısınma korumalı.",
                      cat: "sarj-cihazlari",
                    },
                    {
                      label: "🏮 Solar Şarjlı 10.000mAh Teleskopik Kamp Feneri",
                      prompt:
                        "Güneş enerjili solar kamp lambası, dahili 10000mAh powerbank özelliği, IPX6 su geçirmez, manyetik taban, 4 farklı aydınlatma modu.",
                      cat: "kamp-fenerleri",
                    },
                    {
                      label: "🔊 360° Çift Pasif Radyatörlü Su Geçirmez Hoparlör",
                      prompt:
                        "IPX7 su geçirmez kablosuz bluetooth hoparlör, 30W güçlü stereo bas, 24 saat çalma süresi, TWS çift hoparlör eşleştirme desteği.",
                      cat: "hoparlorler",
                    },
                  ].map((tpl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPrompt(tpl.prompt);
                        setCategoryHint(tpl.cat);
                      }}
                      className="rounded-xl border border-slate-700/80 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 hover:border-amber-500/60 hover:text-amber-300 hover:bg-slate-800 transition-all"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Prompt Giriş Formu */}
            <div className="rounded-2xl border border-slate-800 bg-[#0e1320] p-6 shadow-md">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                <div className="md:col-span-3 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span>Ürün Fikri, Notu veya Özellikleri</span>
                    <span className="text-[11px] font-normal text-slate-500">
                      Gemini 2.5 Flash ile işlenecektir
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Örnek: Şam çeliği 20 cm şef bıçağı, ceviz ağacı sap, 60 HRC sertlik, özel hediyelik ahşap kutusunda..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                      Kategori Tercihi
                    </label>
                    <select
                      value={categoryHint}
                      onChange={(e) => setCategoryHint(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="sef-bicaklari">🔪 Şef Bıçakları & Satırlar</option>
                      <option value="sarj-cihazlari">⚡ GaN Hızlı Şarj Cihazları</option>
                      <option value="kamp-fenerleri">🏮 Solar Kamp Fenerleri</option>
                      <option value="hoparlorler">🔊 Bluetooth Hoparlörler</option>
                    </select>
                  </div>

                  <button
                    disabled={isGenerating}
                    onClick={handleGenerateAI}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-300 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Gemini Düşünüyor...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Gemini ile Üret & Analiz Et
                      </>
                    )}
                  </button>
                </div>
              </div>

              {aiError && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  {aiError}
                </div>
              )}

              {saveSuccessMessage && (
                <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-400 flex items-center justify-between">
                  <span>{saveSuccessMessage}</span>
                  <Link
                    href={`/urun/${generatedProduct?.slug}`}
                    target="_blank"
                    className="underline font-bold flex items-center gap-1 hover:text-emerald-300"
                  >
                    Mağazada Görüntüle <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* Üretilen Ürün Detayları ve Önizleme Kartı */}
            {generatedProduct && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sol Kolon: Düzenleme Formu (2 Kolon) */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#0e1320] p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-400">
                        {generatedProduct.badge || "AI ÜRETİMİ"}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">
                        Yapay Zekanın Hazırladığı Ürün Taslağı
                      </h3>
                    </div>
                    <button
                      disabled={isSavingProduct}
                      onClick={handleSaveProduct}
                      className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSavingProduct ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Vitrinde Canlıya Al
                        </>
                      )}
                    </button>
                  </div>

                  {/* Alanlar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-slate-400 font-semibold">Ürün Adı</label>
                      <input
                        type="text"
                        value={generatedProduct.name}
                        onChange={(e) =>
                          setGeneratedProduct({ ...generatedProduct, name: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">URL Slug</label>
                      <input
                        type="text"
                        value={generatedProduct.slug}
                        onChange={(e) =>
                          setGeneratedProduct({ ...generatedProduct, slug: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">Stok Kodu (SKU)</label>
                      <input
                        type="text"
                        value={generatedProduct.sku}
                        onChange={(e) =>
                          setGeneratedProduct({ ...generatedProduct, sku: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">
                        Satış Fiyatı (TL)
                      </label>
                      <input
                        type="number"
                        value={(generatedProduct.price / 100).toFixed(2)}
                        onChange={(e) =>
                          setGeneratedProduct({
                            ...generatedProduct,
                            price: Math.round(Number(e.target.value) * 100),
                          })
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">
                        Liste / Çizili Fiyat (TL)
                      </label>
                      <input
                        type="number"
                        value={((generatedProduct.compareAtPrice || 0) / 100).toFixed(2)}
                        onChange={(e) =>
                          setGeneratedProduct({
                            ...generatedProduct,
                            compareAtPrice: Math.round(Number(e.target.value) * 100),
                          })
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">Başlangıç Stoku</label>
                      <input
                        type="number"
                        value={generatedProduct.stock}
                        onChange={(e) =>
                          setGeneratedProduct({
                            ...generatedProduct,
                            stock: Number(e.target.value),
                          })
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">Görsel URL</label>
                      <input
                        type="text"
                        value={generatedProduct.suggestedImageUrl}
                        onChange={(e) =>
                          setGeneratedProduct({
                            ...generatedProduct,
                            suggestedImageUrl: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white text-[11px]"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-slate-400 font-semibold">
                        Satış Odaklı Açıklama
                      </label>
                      <textarea
                        rows={5}
                        value={generatedProduct.description}
                        onChange={(e) =>
                          setGeneratedProduct({
                            ...generatedProduct,
                            description: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Teknik Özellikler Tablosu */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-amber-400 mb-2">
                      Teknik Özellikler
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(generatedProduct.specifications || {}).map(
                        ([key, val]: any, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 flex justify-between"
                          >
                            <span className="text-slate-400">{key}:</span>
                            <span className="font-semibold text-white">{val}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Sağ Kolon: Canlı Önizleme Kartı (1 Kolon) */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Müşterinin Göreceği Canlı Kart Önizlemesi
                  </h3>

                  <div className="rounded-2xl border border-slate-800 bg-[#0e1320] overflow-hidden shadow-xl">
                    <div className="relative aspect-square w-full bg-slate-950">
                      <Image
                        src={generatedProduct.suggestedImageUrl}
                        alt={generatedProduct.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span className="rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-black text-slate-950 uppercase tracking-wider shadow">
                          {generatedProduct.badge || "YENİ"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <p className="text-[11px] font-mono text-amber-400">
                        {generatedProduct.sku}
                      </p>
                      <h4 className="text-sm font-bold text-white line-clamp-2">
                        {generatedProduct.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {generatedProduct.shortDescription || generatedProduct.description}
                      </p>

                      <div className="pt-2 flex items-baseline justify-between border-t border-slate-800">
                        <div>
                          <p className="text-base font-extrabold text-white">
                            {formatPrice(generatedProduct.price)}
                          </p>
                          {generatedProduct.compareAtPrice && (
                            <p className="text-xs text-slate-500 line-through">
                              {formatPrice(generatedProduct.compareAtPrice)}
                            </p>
                          )}
                        </div>
                        <span className="rounded-lg bg-slate-900 border border-slate-800 px-2 py-1 text-[11px] text-emerald-400 font-semibold">
                          {generatedProduct.stock} Adet Stokta
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SEO Önizlemesi */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-1.5 text-xs">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      Google Arama Görünümü (SEO)
                    </p>
                    <p className="text-blue-400 font-medium hover:underline truncate">
                      {generatedProduct.seo?.title || generatedProduct.name}
                    </p>
                    <p className="text-[11px] text-emerald-500 font-mono">
                      https://sariyildiz.com/urun/{generatedProduct.slug}
                    </p>
                    <p className="text-slate-400 text-[11px] line-clamp-2">
                      {generatedProduct.seo?.description || generatedProduct.shortDescription}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SEKME 2: SİPARİŞ KOMUTA MERKEZİ (OMS) */}
        {/* ========================================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Sipariş Yönetim Merkezi</h2>
                <p className="text-xs text-slate-400">
                  Müşteri siparişlerini izleyin, durumları güncelleyin ve kargo takip numarası atayın.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchOrders}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Yenile
                </button>
              </div>
            </div>

            {/* Arama ve Durum Filtreleri */}
            <div className="rounded-2xl border border-slate-800 bg-[#0e1320] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
                {[
                  { label: "Tümü", val: "ALL" },
                  { label: "Ödeme Bekleyen", val: "PENDING_PAYMENT" },
                  { label: "Ödendi", val: "PAID" },
                  { label: "Hazırlanıyor", val: "PROCESSING" },
                  { label: "Kargoya Verildi", val: "SHIPPED" },
                  { label: "Teslim Edildi", val: "DELIVERED" },
                ].map((f) => (
                  <button
                    key={f.val}
                    onClick={() => setOrderStatusFilter(f.val)}
                    className={`rounded-lg px-3 py-1.5 transition-all ${
                      orderStatusFilter === f.val
                        ? "bg-amber-500 text-slate-950 font-bold shadow"
                        : "bg-slate-900/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Sipariş no, müşteri veya e-posta..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Sipariş Listesi Tablosu */}
            <div className="rounded-2xl border border-slate-800 bg-[#0e1320] overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase text-slate-400">
                    <tr>
                      <th className="p-4">Sipariş No</th>
                      <th className="p-4">Müşteri</th>
                      <th className="p-4">Durum</th>
                      <th className="p-4">Kalemler</th>
                      <th className="p-4">Toplam Tutar</th>
                      <th className="p-4">Tarih</th>
                      <th className="p-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          Bu filtreye uygun sipariş bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const statusColors: any = {
                          PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                          PROCESSING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                          SHIPPED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                          DELIVERED: "bg-slate-500/10 text-slate-300 border-slate-500/20",
                          PENDING_PAYMENT: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                        };

                        const statusLabels: any = {
                          PAID: "Ödendi",
                          PROCESSING: "Hazırlanıyor",
                          SHIPPED: "Kargoda",
                          DELIVERED: "Teslim Edildi",
                          PENDING_PAYMENT: "Ödeme Bekliyor",
                        };

                        return (
                          <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-4 font-mono font-bold text-amber-400">
                              {ord.orderNumber}
                            </td>
                            <td className="p-4">
                              <p className="font-semibold text-white">
                                {ord.guestName ||
                                  `${ord.user?.firstName || ""} ${ord.user?.lastName || ""}`}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {ord.guestEmail || ord.user?.email}
                              </p>
                            </td>
                            <td className="p-4">
                              <span
                                className={`rounded-md px-2.5 py-0.5 text-[11px] font-semibold border ${
                                  statusColors[ord.status] || "bg-slate-800 text-slate-300"
                                }`}
                              >
                                {statusLabels[ord.status] || ord.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="line-clamp-1 max-w-[200px]">
                                {ord.items?.[0]?.productName || "Ürün kalemi"}
                              </p>
                              {ord.items?.length > 1 && (
                                <span className="text-[10px] text-slate-500">
                                  +{ord.items.length - 1} diğer ürün
                                </span>
                              )}
                            </td>
                            <td className="p-4 font-bold text-white">
                              {formatPrice(ord.totalAmount)}
                            </td>
                            <td className="p-4 text-slate-400 text-[11px]">
                              {new Date(ord.createdAt).toLocaleDateString("tr-TR", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                              >
                                İncele & Yönet
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sipariş Detay Modalı */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0e1320] p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {selectedOrder.orderNumber}
                      </span>
                      <h3 className="text-base font-bold text-white">
                        Sipariş Detayı & Kargo İşlemleri
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="rounded-lg bg-slate-900 p-2 text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Müşteri ve Teslimat Adresi */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                      <p className="font-bold uppercase text-slate-400 text-[11px]">
                        Müşteri İletişim
                      </p>
                      <p className="font-semibold text-white">
                        {selectedOrder.guestName ||
                          `${selectedOrder.user?.firstName || ""} ${selectedOrder.user?.lastName || ""}`}
                      </p>
                      <p className="text-slate-300">{selectedOrder.guestEmail || selectedOrder.user?.email}</p>
                      <p className="text-slate-300">{selectedOrder.guestPhone || selectedOrder.user?.phone}</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-bold uppercase text-slate-400 text-[11px]">
                          Teslimat Adresi
                        </p>
                        <button
                          onClick={() => {
                            const addr = selectedOrder.shippingAddress;
                            const text = `${addr?.fullName || ""}, ${addr?.addressLine || ""}, ${addr?.district || ""}/${addr?.city || ""}`;
                            copyToClipboard(text, "addr");
                          }}
                          className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          {copiedId === "addr" ? "Kopyalandı" : "Adresi Kopyala"}
                        </button>
                      </div>
                      <p className="text-slate-300">
                        {selectedOrder.shippingAddress?.addressLine || "Adres detayı belirtilmemiş"}
                      </p>
                      <p className="text-slate-400 font-medium">
                        {selectedOrder.shippingAddress?.district} / {selectedOrder.shippingAddress?.city}
                      </p>
                    </div>
                  </div>

                  {/* Kalemler */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">
                      Sipariş Kalemleri
                    </h4>
                    <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950 text-xs">
                      {selectedOrder.items?.map((item: any, i: number) => (
                        <div key={i} className="p-3 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white">{item.productName}</p>
                            <p className="text-[11px] text-slate-500 font-mono">
                              SKU: {item.productSku} · {item.quantity} Adet
                            </p>
                          </div>
                          <span className="font-bold text-white">
                            {formatPrice(item.totalPrice)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kargo İşlemleri ve Takip Kodu */}
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
                    <p className="text-xs font-bold text-amber-400 uppercase">
                      Kargo ve Gönderim Bilgisi Ekle
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1">Kargo Firması</label>
                        <select
                          value={carrierInput}
                          onChange={(e) => setCarrierInput(e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
                        >
                          <option value="Yurtiçi Kargo">Yurtiçi Kargo</option>
                          <option value="Aras Kargo">Aras Kargo</option>
                          <option value="MNG Kargo">MNG Kargo</option>
                          <option value="Sürat Kargo">Sürat Kargo</option>
                          <option value="PTT Kargo">PTT Kargo</option>
                          <option value="Kolay Gelsin">Kolay Gelsin</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Takip Numarası</label>
                        <input
                          type="text"
                          placeholder="Örn: YK-8492019"
                          value={trackingNumberInput}
                          onChange={(e) => setTrackingNumberInput(e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(
                            selectedOrder.id,
                            "PROCESSING"
                          )
                        }
                        className="rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 text-xs font-semibold transition-all"
                      >
                        Hazırlanıyor Olarak İşaretle
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(
                            selectedOrder.id,
                            "SHIPPED",
                            carrierInput,
                            trackingNumberInput
                          )
                        }
                        className="rounded-lg bg-blue-500 hover:bg-blue-400 text-slate-950 px-3.5 py-1.5 text-xs font-bold transition-all shadow"
                      >
                        Kargoya Verildi Olarak Güncelle
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(
                            selectedOrder.id,
                            "DELIVERED"
                          )
                        }
                        className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-1.5 text-xs font-bold transition-all shadow"
                      >
                        Teslim Edildi
                      </button>
                    </div>
                  </div>

                  {/* Kapat Butonu */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => window.print()}
                      className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Paketleme Fişi Yazdır
                    </button>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700"
                    >
                      Kapat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SEKME 3: MAĞAZA ANALİTİĞİ & KRİTİK STOK */}
        {/* ========================================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white">Mağaza Performans Özeti</h2>
              <p className="text-xs text-slate-400">
                Ciro, sipariş hacmi ve kritik stok durumunu canlı takip edin.
              </p>
            </div>

            {/* Metrik Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-[#0e1320] p-6 shadow-md">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Toplam Tahsilat (Ciro)</span>
                  <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black text-white">
                  {formatPrice(metrics.totalRevenueKurus)}
                </p>
                <span className="mt-2 inline-flex items-center text-xs font-bold text-emerald-400">
                  +18.4% Geçen Aya Göre
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#0e1320] p-6 shadow-md">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Toplam Sipariş</span>
                  <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black text-white">
                  {metrics.totalOrdersCount} Adet
                </p>
                <span className="mt-2 inline-flex items-center text-xs font-bold text-emerald-400">
                  +12.2% Sipariş Artışı
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#0e1320] p-6 shadow-md">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Ortalama Sepet Tutarı</span>
                  <div className="rounded-xl bg-purple-500/10 p-2 text-purple-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black text-white">
                  {formatPrice(metrics.averageOrderKurus)}
                </p>
                <span className="mt-2 inline-flex items-center text-xs font-bold text-emerald-400">
                  +5.1% Artış
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#0e1320] p-6 shadow-md">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Aktif Ürünler</span>
                  <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
                    <Package className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black text-white">
                  {metrics.totalProductsCount} Ürün
                </p>
                <span className="mt-2 inline-flex items-center text-xs text-slate-400">
                  4 Ana Kategoride
                </span>
              </div>
            </div>

            {/* Kritik Stok Uyarısı Kutusu */}
            <div className="rounded-2xl border border-amber-500/30 bg-[#0e1320] p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Kritik Stok Uyarıları (Stok ≤ 5)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tükenmek üzere olan ürünleri tedarik etmek için dikkat edin.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {metrics.lowStockItems?.length === 0 ? (
                  <p className="text-slate-500 italic p-2">
                    Şu an kritik seviyede ürün bulunmuyor. Tüm stoklar güvende.
                  </p>
                ) : (
                  metrics.lowStockItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-white">{item.productName}</p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          SKU: {item.sku}
                        </p>
                      </div>
                      <span className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1 font-bold text-amber-400">
                        {item.stock} Adet Kaldı
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SEKME 4: KUPON & KAMPANYA YÖNETİMİ */}
        {/* ========================================================================= */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">İndirim Kuponları & Kampanyalar</h2>
                <p className="text-xs text-slate-400">
                  Müşterilerinizin ödeme adımında kullanabileceği indirim kodlarını yönetin.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0e1320] overflow-hidden shadow-md">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase text-slate-400">
                  <tr>
                    <th className="p-4">Kupon Kodu</th>
                    <th className="p-4">Tür</th>
                    <th className="p-4">İndirim Değeri</th>
                    <th className="p-4">Asgari Sepet Tutarı</th>
                    <th className="p-4">Kullanım Sayısı</th>
                    <th className="p-4">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {coupons.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="p-4 font-mono font-bold text-amber-400">
                        {c.code}
                      </td>
                      <td className="p-4 text-slate-300">{c.type}</td>
                      <td className="p-4 font-bold text-white">{c.value}</td>
                      <td className="p-4 text-slate-300">{formatPrice(c.minOrder)}</td>
                      <td className="p-4 text-slate-400 font-mono">{c.usageCount} kez</td>
                      <td className="p-4">
                        <span
                          className={`rounded-md px-2.5 py-0.5 text-[11px] font-semibold border ${
                            c.isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-slate-800 text-slate-500 border-slate-700"
                          }`}
                        >
                          {c.isActive ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
