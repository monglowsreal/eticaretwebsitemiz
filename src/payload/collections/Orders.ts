import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
    defaultColumns: [
      "orderNumber",
      "customerName",
      "totalAmount",
      "status",
      "carrier",
      "trackingNumber",
      "createdAt",
    ],
  },
  access: {
    read: ({ req: { user } }) =>
      Boolean(user && (user.role === "admin" || user.role === "staff")),
    create: () => true,
    update: ({ req: { user } }) =>
      Boolean(user && (user.role === "admin" || user.role === "staff")),
    delete: ({ req: { user } }) => Boolean(user && user.role === "admin"),
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // Otomatik Stok Yönetimi
        // 1. Ödeme tamamlandı -> Stok düş
        if (doc.status === "paid" && previousDoc?.status !== "paid") {
          for (const item of doc.items || []) {
            try {
              if (item.product) {
                const prodId = typeof item.product === "object" ? item.product.id : item.product;
                const prod = await req.payload.findByID({ collection: "products", id: prodId });
                if (prod && typeof prod.stock === "number") {
                  const newStock = Math.max(0, prod.stock - (item.quantity || 1));
                  await req.payload.update({
                    collection: "products",
                    id: prodId,
                    data: { stock: newStock },
                  });
                }
              } else if (item.sku) {
                const res = await req.payload.find({
                  collection: "products",
                  where: { sku: { equals: item.sku } },
                  limit: 1,
                });
                if (res.docs.length > 0) {
                  const prod = res.docs[0];
                  const newStock = Math.max(0, (prod.stock || 0) - (item.quantity || 1));
                  await req.payload.update({
                    collection: "products",
                    id: prod.id,
                    data: { stock: newStock },
                  });
                }
              }
            } catch (err) {
              req.payload.logger.error(`Sipariş onayında stok düşürme hatası: ${err}`);
            }
          }
        }

        // 2. İptal / İade edildi -> Stoğu geri yükle
        if (
          (doc.status === "cancelled" || doc.status === "refunded") &&
          previousDoc?.status === "paid"
        ) {
          for (const item of doc.items || []) {
            try {
              if (item.product) {
                const prodId = typeof item.product === "object" ? item.product.id : item.product;
                const prod = await req.payload.findByID({ collection: "products", id: prodId });
                if (prod && typeof prod.stock === "number") {
                  const newStock = prod.stock + (item.quantity || 1);
                  await req.payload.update({
                    collection: "products",
                    id: prodId,
                    data: { stock: newStock },
                  });
                }
              } else if (item.sku) {
                const res = await req.payload.find({
                  collection: "products",
                  where: { sku: { equals: item.sku } },
                  limit: 1,
                });
                if (res.docs.length > 0) {
                  const prod = res.docs[0];
                  const newStock = (prod.stock || 0) + (item.quantity || 1);
                  await req.payload.update({
                    collection: "products",
                    id: prod.id,
                    data: { stock: newStock },
                  });
                }
              }
            } catch (err) {
              req.payload.logger.error(`Sipariş iptalinde stok iade hatası: ${err}`);
            }
          }
        }
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "orderNumber",
          type: "text",
          label: "Sipariş Numarası",
          required: true,
          unique: true,
          admin: {
            readOnly: true,
            description: "Benzersiz sipariş kodu (örn: SY-202610-8421)",
          },
        },
        {
          name: "status",
          type: "select",
          label: "Sipariş Durumu",
          defaultValue: "pending_payment",
          options: [
            { label: "💳 Ödeme Bekleniyor", value: "pending_payment" },
            { label: "✅ Ödendi (Onaylandı)", value: "paid" },
            { label: "📦 Hazırlanıyor (Depoda)", value: "processing" },
            { label: "🚚 Kargoya Verildi", value: "shipped" },
            { label: "🎉 Teslim Edildi", value: "delivered" },
            { label: "❌ İptal Edildi", value: "cancelled" },
            { label: "🔄 İade Edildi", value: "refunded" },
          ],
          required: true,
        },
      ],
    },
    {
      type: "collapsible",
      label: "Müşteri & İletişim Bilgileri",
      fields: [
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
      ],
    },
    {
      type: "collapsible",
      label: "Kargo & Sevkiyat Bilgileri",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "carrier",
              type: "select",
              label: "Kargo Şirketi",
              options: [
                { label: "Yurtiçi Kargo", value: "Yurtiçi Kargo" },
                { label: "Aras Kargo", value: "Aras Kargo" },
                { label: "MNG Kargo", value: "MNG Kargo" },
                { label: "Sürat Kargo", value: "Sürat Kargo" },
                { label: "PTT Kargo", value: "PTT Kargo" },
                { label: "Kolay Gelsin", value: "Kolay Gelsin" },
                { label: "HepsiJet", value: "HepsiJet" },
              ],
            },
            {
              name: "trackingNumber",
              type: "text",
              label: "Kargo Takip Numarası",
              admin: {
                description: "Örnek: YK-89218392",
              },
            },
            {
              name: "trackingUrl",
              type: "text",
              label: "Kargo Takip Linki",
            },
          ],
        },
        {
          name: "shippingAddress",
          type: "group",
          label: "Teslimat Adresi",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "city",
                  type: "text",
                  label: "İl",
                },
                {
                  name: "district",
                  type: "text",
                  label: "İlçe",
                },
                {
                  name: "postalCode",
                  type: "text",
                  label: "Posta Kodu",
                },
              ],
            },
            {
              name: "addressLine",
              type: "textarea",
              label: "Açık Adres",
            },
          ],
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
          name: "discountAmount",
          type: "number",
          label: "İndirim Tutarı (Kuruş)",
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
          type: "row",
          fields: [
            {
              name: "product",
              type: "relationship",
              relationTo: "products",
              label: "İlişkili Ürün",
            },
            {
              name: "productName",
              type: "text",
              label: "Ürün Adı",
              required: true,
            },
            {
              name: "sku",
              type: "text",
              label: "Stok Kodu (SKU)",
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
      ],
    },
    {
      name: "notes",
      type: "textarea",
      label: "Yönetici / Sevkiyat Notu",
    },
  ],
};
