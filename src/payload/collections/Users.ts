import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Ad Soyad",
    },
    {
      name: "role",
      type: "select",
      label: "Rol",
      defaultValue: "admin",
      options: [
        { label: "Yönetici (Admin)", value: "admin" },
        { label: "Personel (Staff)", value: "staff" },
        { label: "Müşteri (Customer)", value: "customer" },
      ],
      required: true,
    },
  ],
};
