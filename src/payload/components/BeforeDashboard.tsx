"use client";

import React, { useState, useEffect } from "react";

export const BeforeDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [quickPrompt, setQuickPrompt] = useState("");
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/admin/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setMetrics(d.metrics);
      })
      .catch(() => {});
  }, []);

  const handleQuickCreate = async () => {
    if (!quickPrompt.trim()) return;
    setCreating(true);
    setCreateMsg(null);

    try {
      // 1. Gemini ile ürün içeriğini üret
      const aiRes = await fetch("/api/admin/ai/generate-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: quickPrompt.trim() }),
      });
      const aiData = await aiRes.json();
      if (!aiRes.ok || !aiData.success) {
        throw new Error(aiData.error || "Yapay zeka yanıt üretemedi.");
      }

      const prod = aiData.product;

      // 2. Ürünü doğrudan veritabanına kaydet
      const saveRes = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prod.name,
          slug: prod.slug,
          categorySlug: prod.categorySlug,
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
        throw new Error(saveData.error || "Ürün kaydedilemedi.");
      }

      setCreateMsg({
        text: `🎉 "${prod.name}" başarıyla oluşturuldu, veritabanına kaydedildi ve mağazada canlıya alındı!`,
        isError: false,
      });
      setQuickPrompt("");
    } catch (err: any) {
      setCreateMsg({ text: err.message || "Bir hata oluştu.", isError: true });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      style={{
        marginBottom: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        fontFamily: "inherit",
      }}
    >
      {/* 1. Yapay Zeka Hızlı Ürün Oluşturucu Bannerı */}
      <div
        style={{
          background: "linear-gradient(135deg, #0b111c 0%, #151e2e 100%)",
          border: "1px solid rgba(234, 179, 8, 0.35)",
          borderRadius: "14px",
          padding: "24px",
          color: "#f8fafc",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span
            style={{
              background: "rgba(234, 179, 8, 0.2)",
              color: "#fbbf24",
              border: "1px solid rgba(234, 179, 8, 0.5)",
              borderRadius: "6px",
              padding: "3px 10px",
              fontSize: "11px",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            SARIYILDIZ AI STUDIO
          </span>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            Google Gemini 2.5 Flash ile Güçlendirildi
          </span>
        </div>

        <h3 style={{ margin: "4px 0 10px 0", fontSize: "18px", fontWeight: "800", color: "#ffffff" }}>
          Tek Cümleyle Yeni Ürün Üret & Mağazaya Canlıya Al
        </h3>
        <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" }}>
          Buraya eklemek istediğiniz ürünü kısaca yazın; yapay zeka SEO uyumlu başlığını, fiyatını, stok kodunu, teknik özelliklerini ve zengin tanıtım açıklamasını hazırlayıp doğrudan veritabanına eklesin.
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
            placeholder="Örnek: 67 katman VG10 şam çeliği şef bıçağı veya 100W GaN 4 portlu hızlı şarj cihazı..."
            style={{
              flex: 1,
              padding: "12px 16px",
              background: "#060910",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              borderRadius: "10px",
              color: "#ffffff",
              fontSize: "13px",
              outline: "none",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleQuickCreate();
              }
            }}
          />

          <button
            type="button"
            disabled={creating}
            onClick={handleQuickCreate}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
              color: "#0b0f17",
              border: "none",
              borderRadius: "10px",
              fontWeight: "800",
              fontSize: "13px",
              cursor: creating ? "not-allowed" : "pointer",
              opacity: creating ? 0.7 : 1,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 14px rgba(234, 179, 8, 0.3)",
            }}
          >
            {creating ? "Gemini Üretiyor..." : "✨ Gemini ile Üret & Yayınla"}
          </button>
        </div>

        {createMsg && (
          <div
            style={{
              marginTop: "14px",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              background: createMsg.isError ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
              border: createMsg.isError ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(16, 185, 129, 0.3)",
              color: createMsg.isError ? "#f87171" : "#34d399",
            }}
          >
            {createMsg.text}
          </div>
        )}
      </div>

      {/* 2. Kritik Stok ve Ciro Özet Bilgilendirmesi */}
      {metrics && metrics.lowStockItems && metrics.lowStockItems.length > 0 && (
        <div
          style={{
            background: "rgba(234, 179, 8, 0.08)",
            border: "1px solid rgba(234, 179, 8, 0.3)",
            borderRadius: "12px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "700", color: "#fbbf24" }}>
              ⚠️ Kritik Stok Uyarısı ({metrics.lowStockItems.length} Ürün Azaldı)
            </h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#cbd5e1" }}>
              {metrics.lowStockItems
                .map((item: any) => `${item.productName} (${item.stock} adet)`)
                .join(", ")}
            </p>
          </div>
          <a
            href="/admin/collections/products"
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#fbbf24",
              textDecoration: "underline",
              whiteSpace: "nowrap",
            }}
          >
            Stokları İncele →
          </a>
        </div>
      )}
    </div>
  );
};

export default BeforeDashboard;
