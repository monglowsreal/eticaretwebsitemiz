import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
    defaultColumns: ["orderNumber", "customerName", "totalAmount", "status", "createdAt"],
  },
  fields: [
    {
      name: "orderNumber",
      type: "text",
      label: "Sipariş Numarası",
      required: true,
      unique: true,
    },
    {
      name: "status",
      type: "select",
      label: "Sipariş Durumu",
      defaultValue: "pending_payment",
      options: [
        { label: "Ödeme Bekleniyor", value: "pending_payment" },
        { label: "Ödendi", value: "paid" },
        { label: "Hazırlanıyor", value: "processing" },
        { label: "Kargoya Verildi", value: "shipped" },
        { label: "Teslim Edildi", value: "delivered" },
        { label: "İptal Edildi", value: "cancelled" },
        { label: "İade Edildi", value: "refunded" },
      ],
      required: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "customerName",
          type: "text",
          label: "Müşteri Ad Soyad",
          required: true,
        },
        {
          name: "customerEmail",
          type: "email",
          label: "Müşteri E-Posta",
          required: true,
        },
        {
          name: "customerPhone",
          type: "text",
          label: "Müşteri Telefon",
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "subtotal",
          type: "number",
          label: "Ara Toplam (Kuruş)",
          required: true,
        },
        {
          name: "shippingCost",
          type: "number",
          label: "Kargo Ücreti (Kuruş)",
          defaultValue: 0,
        },
        {
          name: "totalAmount",
          type: "number",
          label: "Genel Toplam (Kuruş)",
          required: true,
        },
      ],
    },
    {
      name: "items",
      type: "array",
      label: "Sipariş Kalemleri",
      fields: [
        {
          name: "productName",
          type: "text",
          label: "Ürün Adı",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          label: "Adet",
          defaultValue: 1,
          required: true,
        },
        {
          name: "price",
          type: "number",
          label: "Birim Fiyat (Kuruş)",
          required: true,
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "carrier",
          type: "text",
          label: "Kargo Firması (Yurtiçi, Aras vb.)",
        },
        {
          name: "trackingNumber",
          type: "text",
          label: "Kargo Takip No",
        },
      ],
    },
    {
      name: "notes",
      type: "textarea",
      label: "Sipariş / Yönetici Notu",
    },
  ],
};
