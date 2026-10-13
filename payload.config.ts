import "dotenv/config";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import { Users } from "./src/payload/collections/Users";
import { Media } from "./src/payload/collections/Media";
import { Categories } from "./src/payload/collections/Categories";
import { Products } from "./src/payload/collections/Products";
import { Orders } from "./src/payload/collections/Orders";

export default buildConfig({
  sharp,
  admin: {
    user: Users.slug,
    components: {
      beforeDashboard: ["@/payload/components/BeforeDashboard"],
    },
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
      max: 4,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
      ssl:
        process.env.NODE_ENV === "production" ||
        process.env.DIRECT_URL?.includes("supabase") ||
        process.env.DATABASE_URL?.includes("supabase")
          ? { rejectUnauthorized: false }
          : false,
    },
    schemaName: "payload",
  }),
});
