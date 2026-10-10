import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "order"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Kategori Adı",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Kategori Slug (URL)",
      required: true,
      unique: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Açıklama",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Kategori Görseli",
    },
    {
      name: "order",
      type: "number",
      label: "Sıralama Önceliği",
      defaultValue: 0,
    },
  ],
};
