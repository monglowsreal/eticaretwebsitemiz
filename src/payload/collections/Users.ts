import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role"],
  },
  access: {
    // Sadece admin veya yetkili personel admin paneline (/admin) giriş yapabilir
    admin: ({ req: { user } }) =>
      Boolean(user && (user.role === "admin" || user.role === "staff")),

    // Dışarıdan hiç kimse kayıt olamaz (Sign up kapalı).
    // Sadece mevcut admin paneli içinden yeni kullanıcı/personel eklenebilir.
    create: ({ req: { user } }) => Boolean(user && user.role === "admin"),

    // Kullanıcı listesini sadece admin veya personel görebilir
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin" || user.role === "staff") return true;
      return { id: { equals: user.id } };
    },

    // Sadece admin kullanıcıları düzenleyebilir; kullanıcı yalnızca kendi profilini güncelleyebilir
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin") return true;
      return { id: { equals: user.id } };
    },

    // Yalnızca admin kullanıcı silebilir
    delete: ({ req: { user } }) => Boolean(user && user.role === "admin"),
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
      defaultValue: "staff",
      options: [
        { label: "Yönetici (Admin)", value: "admin" },
        { label: "Personel (Staff)", value: "staff" },
        { label: "Müşteri (Customer)", value: "customer" },
      ],
      required: true,
      // Kullanıcı rolünü yalnızca mevcut bir yönetici (Admin) değiştirebilir
      access: {
        update: ({ req: { user } }) => Boolean(user && user.role === "admin"),
      },
    },
  ],
};
