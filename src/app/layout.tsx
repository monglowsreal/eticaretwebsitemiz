import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";

export const metadata: Metadata = {
  title: "Sarıyıldız | Profesyonel Bıçaklar, Outdoor & Teknoloji",
  description:
    "Sarıyıldız profesyonel şef bıçakları, paslanmaz satırlar, GaN hızlı şarj cihazları, solar kamp lambaları ve kablosuz bluetooth hoparlörler.",
  icons: {
    icon: "/images/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0b0f17] text-slate-100">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
