import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { Users } from "./src/payload/collections/Users";
import { Media } from "./src/payload/collections/Media";
import { Categories } from "./src/payload/collections/Categories";
import { Products } from "./src/payload/collections/Products";
import { Orders } from "./src/payload/collections/Orders";

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " · Sarıyıldız Yönetim",
      icons: [{ rel: "icon", url: "/images/logo.jpg" }],
      openGraph: {
        images: ["/images/logo.jpg"],
      },
    },
  },
  collections: [Users, Products, Categories, Orders, Media],
  editor: lexicalEditor(),
  secret:
    process.env.PAYLOAD_SECRET ||
    process.env.AUTH_SECRET ||
    "sariyildiz-payload-secret-32-characters-min-12345",
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DIRECT_URL ||
        process.env.DATABASE_URL ||
        "postgresql://postgres:postgres@localhost:5432/sariyildiz_db?schema=public",
    },
    schemaName: "payload",
  }),
});
