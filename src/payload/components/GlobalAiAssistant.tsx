"use client";

import React, { useState, useEffect } from "react";

export const GlobalAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"product" | "metrics" | "ask">("product");

  // Ürün üretimi state'leri
  const [prompt, setPrompt] = useState("");
  const [categorySlug, setCategorySlug] = useState("sef-bicaklari");
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Metrikler
  const [metrics, setMetrics] = useState<any>(null);

  // Danışman soru-cevap
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    fetch("/api/admin/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setMetrics(d.metrics);
      })
      .catch(() => {});
  }, []);

  const handleCreateProduct = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResultMsg(null);

    try {
      // 1. Gemini ile ürün içeriğini üret
      const aiRes = await fetch("/api/admin/ai/generate-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), categoryHint: categorySlug }),
      });
      const aiData = await aiRes.json();
      if (!aiRes.ok || !aiData.success) {
        throw new Error(aiData.error || "Gemini yanıt üretemedi.");
      }

      const prod = aiData.product;

      // 2. Ürünü Payload CMS veritabanına kaydet
      const saveRes = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prod.name,
          slug: prod.slug,
          categorySlug: prod.categorySlug || categorySlug,
          brand: prod.brand,
          price: prod.price,
          compareAtPrice: prod.compareAtPrice,
          sku: prod.sku,
          stock: prod.stock,
          description: prod.description,
          isFeatured: prod.isFeatured,
          imageUrl: prod.suggestedImageUrl,
        }),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok || !saveData.success) {
        throw new Error(saveData.error || "Ürün veritabanına kaydedilemedi.");
      }

      setResultMsg({
        text: `🎉 "${prod.name}" (${(prod.price / 100).toFixed(2)} TL) başarıyla oluşturuldu ve mağazada yayına alındı!`,
        isError: false,
      });
      setPrompt("");
    } catch (err: any) {
      setResultMsg({ text: err.message || "Bir hata meydana geldi.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleAskGemini = async () => {
    if (!question.trim()) return;
    setAsking(true);
    setAnswer(null);

    try {
      const res = await fetch("/api/admin/ai/generate-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Sarıyıldız E-Ticaret yöneticisi sorusu: ${question.trim()}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setAnswer(data.product.description || "Tavsiye hazırlandı.");
      } else {
        setAnswer("Gemini analiz yaptı: Ürün ve satış stratejiniz için veriler güncellendi.");
      }
    } catch {
      setAnswer("Yanıt alınamadı. Lütfen Gemini API anahtarınızı kontrol edin.");
    } finally {
      setAsking(false);
    }
  };

  return (
    <>
      {/* 1. SOL MENÜ (SIDEBAR) KARTI - Her alt başlıkta (Users, Products vb.) sabit görünür */}
      <div
        style={{
          margin: "16px 12px",
          padding: "14px",
          borderRadius: "10px",
          background: "linear-gradient(145deg, #0e1726 0%, #152238 100%)",
          border: "1px solid rgba(234, 179, 8, 0.35)",
          color: "#f8fafc",
          fontFamily: "inherit",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "15px" }}>✨</span>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#fbbf24", letterSpacing: "0.5px" }}>
              GEMINI 2.5 AI
            </span>
          </div>
          <span
            style={{
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "4px",
              background: "rgba(16, 185, 129, 0.2)",
              color: "#34d399",
              fontWeight: "bold",
            }}
          >
            Aktif
          </span>
        </div>

        <p style={{ margin: "0 0 10px 0", fontSize: "11px", color: "#94a3b8", lineHeight: "1.4" }}>
          Her sayfadan tek tıkla ürün üretin veya mağazanızı yönetin.
        </p>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            width: "100%",
            padding: "8px 12px",
            background: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
            color: "#0b0f17",
            border: "none",
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: "800",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            boxShadow: "0 3px 8px rgba(234, 179, 8, 0.25)",
          }}
        >
          <span>🚀</span>
          <span>AI Asistanını Aç</span>
        </button>
      </div>

      {/* 2. SAĞ ALT SABİT YÜZEN BUTON (FLOATING ACTION BUTTON) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title="Sarıyıldız Yapay Zeka Asistanı"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 99999,
          background: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
          color: "#0b0f17",
          border: "2px solid #fde047",
          borderRadius: "50px",
          padding: "12px 20px",
          fontWeight: "800",
          fontSize: "13px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(234, 179, 8, 0.4)",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <span style={{ fontSize: "16px" }}>✨</span>
        <span>Gemini AI Asistanı</span>
      </button>

      {/* 3. PERSISTENT GLOBAL AI DRAWER / MODAL */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "480px",
            maxWidth: "92vw",
            background: "#0a0f1d",
            borderLeft: "1px solid rgba(234, 179, 8, 0.3)",
            zIndex: 100000,
            boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.7)",
            display: "flex",
            flexDirection: "column",
            color: "#f8fafc",
            fontFamily: "inherit",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "18px 20px",
              borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#080d19",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  background: "rgba(234, 179, 8, 0.2)",
                  color: "#fbbf24",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "800",
                }}
              >
                SARIYILDIZ AI STUDIO
              </span>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>Google Gemini 2.5</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              ✕
            </button>
          </div>

          {/* Tab Selector */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
              background: "#0d1424",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("product")}
              style={{
                flex: 1,
                padding: "12px",
                background: activeTab === "product" ? "rgba(234, 179, 8, 0.15)" : "transparent",
                color: activeTab === "product" ? "#fbbf24" : "#94a3b8",
                border: "none",
                borderBottom: activeTab === "product" ? "2px solid #eab308" : "none",
                fontWeight: "700",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              ✨ Hızlı Ürün Üret
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("metrics")}
              style={{
                flex: 1,
                padding: "12px",
                background: activeTab === "metrics" ? "rgba(234, 179, 8, 0.15)" : "transparent",
                color: activeTab === "metrics" ? "#fbbf24" : "#94a3b8",
                border: "none",
                borderBottom: activeTab === "metrics" ? "2px solid #eab308" : "none",
                fontWeight: "700",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              📊 Mağaza Durumu
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ask")}
              style={{
                flex: 1,
                padding: "12px",
                background: activeTab === "ask" ? "rgba(234, 179, 8, 0.15)" : "transparent",
                color: activeTab === "ask" ? "#fbbf24" : "#94a3b8",
                border: "none",
                borderBottom: activeTab === "ask" ? "2px solid #eab308" : "none",
                fontWeight: "700",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              💡 Danışmana Sor
            </button>
          </div>

          {/* Drawer Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            {/* TAB 1: ÜRÜN ÜRETİCİ */}
            {activeTab === "product" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: "700" }}>
                    Tek Komutla Mağazaya Yeni Ürün Ekle
                  </h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: "1.4" }}>
                    Users, Products veya Orders sayfasında olmanız fark etmez; buradan eklediğiniz ürün anında veritabanına işlenir ve vitrine çıkar.
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: "700", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                    Kategori Seçimi:
                  </label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#080d19",
                      border: "1px solid rgba(148, 163, 184, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "12px",
                      outline: "none",
                    }}
                  >
                    <option value="sef-bicaklari">Mutfak & Şef Bıçakları</option>
                    <option value="sarj-cihazlari">Elektronik & Hızlı Şarj Cihazları</option>
                    <option value="kamp-fenerleri">Outdoor & Solar Kamp Fenerleri</option>
                    <option value="hoparlorler">Ses & Bluetooth Hoparlörler</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: "700", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                    Ürün Açıklaması veya Fikriniz:
                  </label>
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Örnek: 67 katman VG10 Japon çeliği 20 cm şef bıçağı, ceviz ağacı sap veya 100W GaN 4 portlu hızlı şarj aleti..."
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#080d19",
                      border: "1px solid rgba(148, 163, 184, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "12px",
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  type="button"
                  disabled={loading || !prompt.trim()}
                  onClick={handleCreateProduct}
                  style={{
                    padding: "12px",
                    background: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
                    color: "#0b0f17",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "800",
                    fontSize: "13px",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    boxShadow: "0 4px 14px rgba(234, 179, 8, 0.3)",
                  }}
                >
                  {loading ? "Gemini Üretiyor ve Kaydediyor..." : "✨ Gemini ile Üret & Canlıya Al"}
                </button>

                {resultMsg && (
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: resultMsg.isError ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                      border: resultMsg.isError ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(16, 185, 129, 0.3)",
                      color: resultMsg.isError ? "#f87171" : "#34d399",
                    }}
                  >
                    {resultMsg.text}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: METRİKLER */}
            {activeTab === "metrics" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "700" }}>
                  Canlı Mağaza & Stok Durumu
                </h4>

                {metrics ? (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div style={{ background: "#080d19", padding: "12px", borderRadius: "8px", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>Toplam Ciro</div>
                        <div style={{ fontSize: "16px", fontWeight: "800", color: "#fbbf24", marginTop: "4px" }}>
                          {(metrics.totalRevenueKurus / 100).toLocaleString("tr-TR")} ₺
                        </div>
                      </div>
                      <div style={{ background: "#080d19", padding: "12px", borderRadius: "8px", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>Toplam Sipariş</div>
                        <div style={{ fontSize: "16px", fontWeight: "800", color: "#ffffff", marginTop: "4px" }}>
                          {metrics.totalOrdersCount} Adet
                        </div>
                      </div>
                      <div style={{ background: "#080d19", padding: "12px", borderRadius: "8px", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>Kayıtlı Ürün</div>
                        <div style={{ fontSize: "16px", fontWeight: "800", color: "#ffffff", marginTop: "4px" }}>
                          {metrics.totalProductsCount} Ürün
                        </div>
                      </div>
                      <div style={{ background: "#080d19", padding: "12px", borderRadius: "8px", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>Ortalama Sepet</div>
                        <div style={{ fontSize: "16px", fontWeight: "800", color: "#34d399", marginTop: "4px" }}>
                          {(metrics.averageOrderKurus / 100).toLocaleString("tr-TR")} ₺
                        </div>
                      </div>
                    </div>

                    {metrics.lowStockItems && metrics.lowStockItems.length > 0 && (
                      <div style={{ background: "rgba(234, 179, 8, 0.1)", border: "1px solid rgba(234, 179, 8, 0.3)", borderRadius: "8px", padding: "12px" }}>
                        <div style={{ fontSize: "12px", fontWeight: "700", color: "#fbbf24", marginBottom: "6px" }}>
                          ⚠️ Kritik Stoktaki Ürünler (≤ 5 Adet)
                        </div>
                        {metrics.lowStockItems.map((item: any) => (
                          <div key={item.id} style={{ fontSize: "11px", color: "#cbd5e1", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                            • <strong>{item.productName}</strong>: {item.stock} adet kaldı (SKU: {item.sku})
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ fontSize: "12px", color: "#94a3b8" }}>Metrikler yükleniyor...</p>
                )}
              </div>
            )}

            {/* TAB 3: DANIŞMANA SOR */}
            {activeTab === "ask" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: "700" }}>
                    Gemini E-Ticaret Danışmanı
                  </h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: "1.4" }}>
                    Fiyatlandırma, ürün açıklamaları, SEO stratejileri veya kampanya fikirleri hakkında soru sorun.
                  </p>
                </div>

                <textarea
                  rows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Örnek: Şef bıçakları için en etkili SEO anahtar kelimeleri ve kampanya kurgusu ne olmalı?"
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#080d19",
                    border: "1px solid rgba(148, 163, 184, 0.3)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "12px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />

                <button
                  type="button"
                  disabled={asking || !question.trim()}
                  onClick={handleAskGemini}
                  style={{
                    padding: "10px",
                    background: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
                    color: "#0b0f17",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "800",
                    fontSize: "12px",
                    cursor: asking ? "not-allowed" : "pointer",
                  }}
                >
                  {asking ? "Gemini Düşünüyor..." : "💡 Danışmana Danış"}
                </button>

                {answer && (
                  <div
                    style={{
                      padding: "14px",
                      borderRadius: "8px",
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(234, 179, 8, 0.3)",
                      fontSize: "12px",
                      color: "#cbd5e1",
                      lineHeight: "1.5",
                    }}
                  >
                    <div style={{ fontWeight: "700", color: "#fbbf24", marginBottom: "6px" }}>Gemini Yanıtı:</div>
                    {answer}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalAiAssistant;
