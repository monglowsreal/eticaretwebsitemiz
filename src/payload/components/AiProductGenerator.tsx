"use client";

import React, { useState } from "react";
import { useForm } from "@payloadcms/ui";

export const AiProductGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Payload form context
  const { dispatchFields } = useForm();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Lütfen bir ürün fikri veya kaba özellikleri yazın.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/ai/generate-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gemini yanıt üretemedi.");
      }

      const prod = data.product;

      // Payload form alanlarını otomatik güncelle
      if (prod.name) {
        dispatchFields({ type: "UPDATE", path: "name", value: prod.name });
      }
      if (prod.slug) {
        dispatchFields({ type: "UPDATE", path: "slug", value: prod.slug });
      }
      if (prod.brand) {
        dispatchFields({ type: "UPDATE", path: "brand", value: prod.brand });
      }
      if (prod.price) {
        dispatchFields({ type: "UPDATE", path: "price", value: prod.price });
      }
      if (prod.compareAtPrice) {
        dispatchFields({
          type: "UPDATE",
          path: "compareAtPrice",
          value: prod.compareAtPrice,
        });
      }
      if (prod.sku) {
        dispatchFields({ type: "UPDATE", path: "sku", value: prod.sku });
      }
      if (prod.stock) {
        dispatchFields({ type: "UPDATE", path: "stock", value: prod.stock });
      }
      if (prod.description) {
        dispatchFields({
          type: "UPDATE",
          path: "description",
          value: prod.description,
        });
      }
      if (prod.isFeatured !== undefined) {
        dispatchFields({
          type: "UPDATE",
          path: "isFeatured",
          value: prod.isFeatured,
        });
      }

      setSuccess(
        `✅ Başlık, Açıklama, Fiyat (${(prod.price / 100).toFixed(2)} TL), SKU (${prod.sku}) ve Stok Gemini AI tarafından dolduruldu!`
      );
    } catch (err: any) {
      setError(err.message || "Yapay zeka yanıt veremedi.");
    } finally {
      setLoading(false);
    }
  };

  const templates = [
    {
      label: "🔪 67 Katman Şam Çeliği Şef Bıçağı",
      text: "67 katman orijinal VG-10 Japon Şam çeliği şef bıçağı, 20 cm, doğal ceviz ağacı sap, ultra keskin ve dengeli.",
    },
    {
      label: "⚡ 100W GaN Pro Hızlı Şarj Cihazı",
      text: "100W GaN Pro 3x Type-C + 1x USB-A portlu masaüstü hızlı şarj adaptörü, PD 3.0, laptop ve telefon uyumlu.",
    },
    {
      label: "🏮 Solar Şarjlı 10.000mAh Kamp Feneri",
      text: "Güneş enerjili solar kamp lambası, dahili 10000mAh powerbank özelliği, IPX6 su geçirmez, 4 ışık modu.",
    },
    {
      label: "🔊 360° Su Geçirmez Bluetooth Hoparlör",
      text: "IPX7 su geçirmez kablosuz bluetooth hoparlör, 30W stereo derin bas, 24 saat çalma süresi, TWS eşleştirme.",
    },
  ];

  return (
    <div
      style={{
        marginBottom: "24px",
        padding: "20px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #101622 0%, #172132 100%)",
        border: "1px solid rgba(234, 179, 8, 0.3)",
        color: "#f8fafc",
        fontFamily: "inherit",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              background: "rgba(234, 179, 8, 0.2)",
              color: "#fbbf24",
              border: "1px solid rgba(234, 179, 8, 0.4)",
              borderRadius: "6px",
              padding: "2px 8px",
              fontSize: "11px",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            GOOGLE GEMINI 2.5 FLASH
          </span>
          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700" }}>
            Yapay Zeka ile Otomatik Ürün Doldurucu
          </h4>
        </div>
      </div>

      <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: "#94a3b8" }}>
        Kaba bir ürün notu veya fikri yazın; Gemini ürün adını, satış metnini,
        tavsiye edilen kuruş cinsinden fiyatı, SKU kodunu ve stoku forma
        otomatik yerleştirsin.
      </p>

      {/* Şablon Butonları */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        {templates.map((t, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setPrompt(t.text)}
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              color: "#cbd5e1",
              borderRadius: "8px",
              padding: "4px 10px",
              fontSize: "11px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Input ve Aksiyon */}
      <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Örnek: Şam çeliği 20 cm şef bıçağı, ceviz ağacı sap, 60 HRC sertlik..."
          style={{
            flex: 1,
            padding: "10px 14px",
            background: "#080c14",
            border: "1px solid rgba(148, 163, 184, 0.3)",
            borderRadius: "8px",
            color: "#ffffff",
            fontSize: "13px",
            outline: "none",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleGenerate();
            }
          }}
        />

        <button
          type="button"
          disabled={loading}
          onClick={handleGenerate}
          style={{
            padding: "10px 18px",
            background: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
            color: "#0b0f17",
            border: "none",
            borderRadius: "8px",
            fontWeight: "700",
            fontSize: "12px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(234, 179, 8, 0.3)",
            transition: "all 0.15s ease",
          }}
        >
          {loading ? "Gemini Düşünüyor..." : "✨ Gemini ile Doldur"}
        </button>
      </div>

      {error && (
        <div
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "6px",
            color: "#f87171",
            fontSize: "12px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "6px",
            color: "#34d399",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {success}
        </div>
      )}
    </div>
  );
};

export default AiProductGenerator;
