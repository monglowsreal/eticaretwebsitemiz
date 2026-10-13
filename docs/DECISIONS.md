# Mimari ve Tasarım Kararları (Architecture Decision Records)

Bu doküman, projede alınan temel mimari, teknoloji ve iş kuralı kararlarını kaydeder.

---

## ADR 001: Marka Kimliği ve Kategori Kapsamı
- **Tarih:** 2026-10-08
- **Durum:** Kabul edildi
- **Bağlam:** Proje sahibi "Sarıyıldız" logosunu paylaştı ve ürün yelpazesinin profesyonel şef bıçakları ve satırların yanı sıra şarj aletleri, kamp lambaları, wireless hoparlörler gibi genel/çoklu kategorileri de kapsadığını belirtti.
- **Karar:** 
  - Marka adı: **Sarıyıldız** (Sarıyıldız Teknoloji & Yaşam / E-Ticaret)
  - Tasarım dili: Premium siyah/koyu antrasit zemin, altın sarısı (`#F59E0B`, `#EAB308`) marka vurguları ve temiz beyaz tipografi.
  - Kategori hiyerarşisi esnek ve dinamik kurgulandı: Elektronik & Şarj Çözümleri, Ses & Hoparlörler, Outdoor & Kamp, Mutfak & Şef Bıçakları, Ev & Yaşam.

---

## ADR 002: Veri Modeli ve Fiyat Temsili
- **Tarih:** 2026-10-08
- **Durum:** Kabul edildi
- **Karar:**
  - Şartname Madde 13 gereğince tüm para tutarları (`price`, `compareAtPrice`, `subtotal`, `shippingCost`, `totalAmount`) veritabanında **kuruş cinsinden tam sayı (`Int`)** olarak saklanır (örn. 299.90 ₺ -> 29990).
  - Kritik varlıklarda soft delete (`deletedAt`) deseni uygulanır.
  - Sipariş anındaki ürün adı, fiyat ve KDV `OrderItem` içine snapshot olarak kopyalanır.

---

## ADR 003: Katmanlı Mimari ve İş Mantığı Ayrımı
- **Tarih:** 2026-10-08
- **Durum:** Kabul edildi
- **Karar:**
  - Şartname Madde 3 gereğince iş mantığı `src/server/services` altında toplanacaktır.
  - Route handler'lar (`src/app/api`) ve Server Action'lar (`src/server/actions`) yalnızca girdi doğrulama (Zod) ve yetki kontrolü yapıp servisleri çağıran ince katmanlar olarak kalacaktır.

---

## ADR 004: Payload CMS 3.0 — Tek Gerçek Veri Kaynağı & Native Admin Paneli
- **Tarih:** 2026-10-13
- **Durum:** Kabul edildi
- **Karar:**
  - Prisma çift veritabanı/çift model karmaşası kaldırıldı. Veri katmanı ve yönetim ekranı tamamen **Payload CMS 3.0** (`@payloadcms/next` + `@payloadcms/db-postgres`) üzerine kuruldu.
  - Tüm server-side veri okuma ve yazma işlemleri Payload Local API (`getPayload({ config: configPromise })`) ile yürütülür.
  - Ayrı bir `/admin-paneli` rotası yerine native Payload Admin (`/admin`) kullanıldı.
  - Google Gemini 2.5 Flash asistanı doğrudan Payload ürün formuna (`AiProductGenerator`) ve ana gösterge paneline (`BeforeDashboard`) entegre edildi.

---

## ADR 005: Profesyonel Sipariş Yönetimi (OMS), Stok Rezervasyonu ve Webhook Akışı
- **Tarih:** 2026-10-13
- **Durum:** Kabul edildi
- **Karar:**
  - Sipariş durumları (`pending_payment`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`, `refunded`) olarak standartlaştırıldı.
  - `Orders` collection'ına `afterChange` hook'u eklenerek:
    - Durum `paid` olduğunda ilgili ürünlerin stokları otomatik olarak düşürülür.
    - Durum `cancelled` veya `refunded` olduğunda stoklar otomatik olarak iade edilir.
  - Türkiye kargo entegrasyonları (Yurtiçi, Aras, MNG, Sürat, PTT, Kolay Gelsin, HepsiJet) ve takip kodları doğrudan Payload Admin'den yönetilir.
  - iyzico veya harici ödeme webhook'ları `/api/checkout/webhook` üzerinden sipariş durumunu `paid` yaparak bu döngüyü otomatik tetikler.
