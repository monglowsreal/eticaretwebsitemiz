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
