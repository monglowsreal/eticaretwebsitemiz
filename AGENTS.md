<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:payload-agent-rules -->
## Sarıyıldız E-Ticaret — Mimari & Payload CMS Kuralları

Bu proje Next.js 16 + Payload CMS 3.0 (`@payloadcms/next`) üzerine inşa edilmiştir. Tüm yapay zeka ajanları (Antigravity) aşağıdaki kurallara kesinlikle uymalıdır:

### 1. Veri Katmanı ve Tek Gerçek Kaynak (Single Source of Truth)
- **Prisma Kullanmayın:** Veritabanı modeli ve veri erişimi tamamen Payload CMS 3.0 Collection'ları üzerinden yürütülür.
- **Payload Local API:** Sunucu tarafındaki (Server Components, Route Handlers, Server Actions) veri sorguları ve güncellemeleri için `getPayload({ config: configPromise })` kullanılmalıdır.
- **Kuruş Cinsi Fiyatlandırma:** Tüm parasal değerler kuruş tamsayı (integer) cinsindendir (örn. 29990 = 299.90 TL). Asla float/kuruş küsuratlı TL tutulmaz.

### 2. Yönetim Paneli (Admin)
- Tüm yönetimsel ekranlar, sipariş takibi ve yapay zeka ürün üretimi doğrudan native Payload Admin'e (`/admin`) entegre edilmiştir.
- Ayrı/özel admin sayfası açmayın (örn: `/admin-paneli` gibi sayfalar oluşturulmamalıdır).
- Yeni özel admin bileşenleri eklendiğinde `npm run generate:importmap` çalıştırılarak `src/app/(payload)/admin/importMap.js` güncellenmelidir.

### 3. Collection Yapısı (`src/payload/collections/`)
- `Products`: Ürünler, stoklar, kuruş fiyatları, Gemini AI asistanı (`aiAssistant` UI field), ilişkili kategoriler ve medya.
- `Orders`: Profesyonel Sipariş Yönetim Sistemi (OMS). Türk kargo firmaları (Yurtiçi, Aras, MNG, Sürat, PTT, HepsiJet, Kolay Gelsin), takip no, takip linki, açık teslimat adresi, sipariş durumu.
- `Categories`: Kategori hiyerarşisi, ikonlar ve sluglar.
- `Users`: Yönetici ve müşteri hesapları.
- `Media`: Görsel ve medya dosyaları (Sharp destekli).

### 4. İş Mantığı & Hook Akışı (Business Logic)
- **Stok Yönetimi & Rezervasyon:** Sipariş durumu değiştiğinde (örn: `paid` olduğunda stok düşürülmeli, `cancelled` / `refunded` durumunda stok geri iade edilmeli) bu işlem `Orders` collection'ının `afterChange` hook'ları veya Payload Local API üzerinden yönetilir.
- **Ödeme Entegrasyonu:** iyzico veya ödeme webhook'ları `/api/checkout/webhook` üzerinden Payload Local API ile sipariş durumunu `paid` olarak günceller.
<!-- END:payload-agent-rules -->
