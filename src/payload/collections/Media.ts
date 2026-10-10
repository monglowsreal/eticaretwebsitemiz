import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: "public/uploads",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 768,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user && (user.role === "admin" || user.role === "staff")),
    update: ({ req: { user } }) => Boolean(user && (user.role === "admin" || user.role === "staff")),
    delete: ({ req: { user } }) => Boolean(user && user.role === "admin"),
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Görsel Alt Metni (SEO)",
    },
  ],
};
