import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "price", "stock", "status"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Ürün Adı",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Ürün Slug (URL)",
      required: true,
      unique: true,
    },
    {
      name: "brand",
      type: "text",
      label: "Marka",
      defaultValue: "Sarıyıldız",
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      label: "Kategori",
      required: true,
    },
    {
      name: "status",
      type: "select",
      label: "Yayın Durumu",
      defaultValue: "active",
      options: [
        { label: "Aktif (Satışta)", value: "active" },
        { label: "Taslak", value: "draft" },
        { label: "Arşivlendi", value: "archived" },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "price",
          type: "number",
          label: "Satış Fiyatı (Kuruş)",
          required: true,
          admin: {
            description: "Örnek: 29990 kuruş = 299.90 TL",
          },
        },
        {
          name: "compareAtPrice",
          type: "number",
          label: "İndirim Öncesi Liste Fiyatı (Kuruş)",
          admin: {
            description: "Varsa eski fiyat (üzeri çizili gösterilir)",
          },
        },
        {
          name: "stock",
          type: "number",
          label: "Stok Adedi",
          defaultValue: 0,
          required: true,
        },
      ],
    },
    {
      name: "sku",
      type: "text",
      label: "Stok Kodu (SKU)",
    },
    {
      name: "isFeatured",
      type: "checkbox",
      label: "Öne Çıkan Ürün (Ana Sayfada Göster)",
      defaultValue: false,
    },
    {
      name: "description",
      type: "textarea",
      label: "Ürün Açıklaması",
    },
    {
      name: "images",
      type: "array",
      label: "Ürün Görselleri",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Görsel",
          required: true,
        },
      ],
    },
  ],
};
