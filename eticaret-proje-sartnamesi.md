# E-Ticaret Platformu (B2C) — Proje Şartnamesi

> Bu doküman, Antigravity agent'ının projeyi baştan sona geliştirirken referans alacağı ana kaynaktır.
> Her görev öncesinde bu dosyayı oku. Belirsiz bir durumda varsayım yapmadan önce ilgili bölümü kontrol et;
> bölümde cevap yoksa, en basit ve geri alınabilir seçeneği uygula ve `docs/DECISIONS.md` dosyasına not düş.

---

## 1. Proje Özeti

| Alan | Değer |
|---|---|
| Proje adı | `[MARKA_ADI]` (placeholder — config'den okunmalı) |
| Model | B2C (bireysel müşteriye doğrudan satış) |
| Hedef pazar | Türkiye (birincil), ileride çoklu dil/para birimi |
| Ürün kategorisi | `[KATEGORİ — örn. giyim, kozmetik, elektronik aksesuar]` |
| Ana dil | Türkçe (i18n altyapısı ile İngilizce'ye hazır) |
| Para birimi | TRY (₺), altyapı çoklu para birimine hazır |
| Hedef kitle | 18–45 yaş, ağırlıklı mobil kullanıcı |

### 1.1 İş Hedefleri
- Ziyaretçiyi hızlı, güvenli ve sürtünmesiz bir akışla müşteriye dönüştürmek.
- Mobil öncelikli (mobile-first) deneyim; mobil dönüşüm oranı masaüstüne yakın olmalı.
- Arama motorlarında görünürlük (SEO) ve yüksek sayfa hızı.
- Yönetim panelinden teknik bilgi gerektirmeden ürün, sipariş ve kampanya yönetimi.

### 1.2 Kapsam Dışı (İlk Sürüm)
- Pazaryeri (çoklu satıcı) yapısı
- B2B / toptan satış fiyatlandırması
- Mobil uygulama (native)
- Abonelik / tekrarlayan ödeme

---

## 2. Teknoloji Yığını

Aksi belirtilmedikçe aşağıdaki yığını kullan. Farklı bir kütüphane eklemeden önce gerekçeyi `docs/DECISIONS.md`'ye yaz.

| Katman | Teknoloji |
|---|---|
| Framework | Next.js (App Router) + TypeScript (strict mode) |
| Stil | Tailwind CSS + shadcn/ui |
| Durum yönetimi | Sunucu durumu: TanStack Query · İstemci durumu: Zustand (sepet vb.) |
| Veritabanı | PostgreSQL |
| ORM | Prisma |
| Kimlik doğrulama | Auth.js (NextAuth) — e-posta/şifre + Google girişi |
| Ödeme | iyzico (birincil), PayTR (alternatif) — soyut `PaymentProvider` arayüzü arkasında |
| Dosya/Görsel | Cloudinary veya S3 uyumlu depolama + `next/image` |
| Arama | Başlangıçta PostgreSQL full-text; ölçeklenince Meilisearch |
| E-posta | Resend veya SMTP (React Email şablonları) |
| SMS | Netgsm / İletimerkezi (sipariş bildirimi, OTP) |
| Önbellek | Redis (oturum, rate limit, stok kilitleme) |
| Test | Vitest (birim), Playwright (E2E) |
| CI/CD | GitHub Actions |
| Barındırma | Vercel (frontend) + yönetilen PostgreSQL (Neon/Supabase/RDS) |

---

## 3. Klasör Yapısı

```
/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (shop)/                # Müşteri tarafı
│   │   │   ├── page.tsx           # Ana sayfa
│   │   │   ├── kategori/[slug]/
│   │   │   ├── urun/[slug]/
│   │   │   ├── arama/
│   │   │   ├── sepet/
│   │   │   ├── odeme/
│   │   │   └── hesabim/
│   │   ├── (auth)/giris, kayit, sifre-sifirla
│   │   ├── admin/                 # Yönetim paneli (rol korumalı)
│   │   ├── api/                   # Route handler'lar, webhook'lar
│   │   └── (legal)/               # Sözleşmeler, KVKK, iade politikası
│   ├── components/
│   │   ├── ui/                    # shadcn bileşenleri
│   │   ├── shop/                  # ProductCard, CartDrawer, vb.
│   │   └── admin/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   ├── payment/               # PaymentProvider, iyzico.ts, paytr.ts
│   │   ├── shipping/              # ShippingProvider ve kargo entegrasyonları
│   │   ├── invoice/               # e-Arşiv entegrasyonu
│   │   └── validators/            # Zod şemaları
│   ├── server/
│   │   ├── services/              # İş mantığı (order, cart, stock, coupon)
│   │   └── actions/               # Server Actions
│   ├── hooks/
│   ├── stores/
│   └── types/
├── tests/
│   ├── unit/
│   └── e2e/
├── docs/
│   ├── DECISIONS.md
│   └── API.md
└── .env.example
```

**Kural:** İş mantığı `server/services` altında olmalı; route handler ve server action'lar yalnızca doğrulama + servis çağrısı yapan ince katmanlardır.

---

## 4. Veri Modeli (Özet)

Aşağıdaki varlıkları Prisma şemasında modelle. Tüm tablolarda `id` (cuid), `createdAt`, `updatedAt` bulunmalı. Silme işlemleri ürün/sipariş gibi kritik tablolarda **soft delete** (`deletedAt`) olmalı.

### Çekirdek Varlıklar
- **User** — ad, soyad, e-posta, telefon, parola hash, rol (`CUSTOMER` | `ADMIN` | `STAFF`), e-posta/telefon doğrulama durumu, pazarlama izni
- **Address** — kullanıcıya bağlı; ad-soyad, telefon, il, ilçe, mahalle, açık adres, posta kodu, tür (teslimat/fatura), varsayılan işareti, kurumsal fatura için vergi no/dairesi
- **Category** — hiyerarşik (parentId), slug, SEO alanları, sıralama
- **Product** — ad, slug, açıklama (rich text), marka, kategori(ler), durum (`DRAFT` | `ACTIVE` | `ARCHIVED`), SEO alanları, KDV oranı
- **ProductVariant** — SKU, barkod, beden/renk gibi özellikler (JSON veya attribute tabloları), fiyat, indirimli fiyat, stok, ağırlık/desi
- **ProductImage** — URL, alt metin, sıra
- **Cart / CartItem** — misafir (cookie/session) ve giriş yapmış kullanıcı sepeti; girişte birleştirme
- **Order** — sipariş no (okunabilir, benzersiz), kullanıcı/misafir bilgisi, durum, adres anlık görüntüleri (snapshot), tutarlar (ara toplam, kargo, indirim, KDV, genel toplam)
- **OrderItem** — ürün/varyant snapshot'ı (ad, SKU, birim fiyat, KDV, adet) — fiyat değişse de geçmiş siparişler değişmemeli
- **Payment** — sağlayıcı, işlem id, durum, tutar, 3D Secure bilgisi, ham yanıt (maskelenmiş)
- **Shipment** — kargo firması, takip no, durum, gönderim/teslim tarihleri
- **Coupon** — kod, tür (yüzde/sabit/ücretsiz kargo), alt sınır, kullanım limiti (toplam/kullanıcı başı), geçerlilik aralığı, kategori/ürün kısıtı
- **Review** — kullanıcı, ürün, puan (1–5), yorum, moderasyon durumu, "doğrulanmış alıcı" işareti
- **Wishlist / WishlistItem**
- **ReturnRequest / ReturnItem** — iade/değişim talebi, neden, durum, geri ödeme bilgisi
- **StockMovement** — her stok değişiminin denetim kaydı (satış, iade, manuel düzeltme)
- **AuditLog** — admin işlemleri (kim, ne, ne zaman)
- **Setting** — site ayarları (kargo ücreti, ücretsiz kargo limiti, bakım modu vb.)

### Sipariş Durumları
```
PENDING_PAYMENT → PAID → PROCESSING → SHIPPED → DELIVERED
                    ↘ CANCELLED
DELIVERED → RETURN_REQUESTED → RETURNED / REFUNDED
PENDING_PAYMENT → EXPIRED (ödeme zaman aşımı)
```
Durum geçişleri yalnızca `OrderService` üzerinden, geçerli geçiş matrisi kontrol edilerek yapılmalı.

---

## 5. Müşteri Tarafı Özellikleri

### 5.1 Ana Sayfa
- Hero/kampanya banner'ı (admin'den yönetilebilir, çoklu slayt)
- Öne çıkan kategoriler, çok satanlar, yeni gelenler, indirimli ürünler bölümleri
- Güven unsurları: güvenli ödeme, hızlı kargo, kolay iade rozetleri
- Bülten kaydı (çift onaylı — double opt-in)

### 5.2 Kategori / Listeleme Sayfası
- Sayfalama veya "daha fazla yükle" (SEO için URL tabanlı sayfalama tercih edilir)
- **Filtreler:** fiyat aralığı, marka, beden, renk, stok durumu, indirimli ürünler, puan
- **Sıralama:** önerilen, en düşük/yüksek fiyat, en yeni, en çok satan, en yüksek puan
- Filtre ve sıralama durumu URL query parametrelerinde tutulmalı (paylaşılabilir/geri tuşu uyumlu)
- Skeleton yükleme durumları, boş sonuç ekranı

### 5.3 Ürün Detay Sayfası
- Görsel galerisi (yakınlaştırma, mobilde kaydırma), video desteği
- Varyant seçimi (beden/renk) — seçime göre fiyat, stok ve görsel güncellenmeli
- Stok göstergesi ("Son 3 ürün"), stokta yoksa "Gelince haber ver" kaydı
- Beden tablosu / ürün özellikleri sekmeleri
- Kargo ve iade bilgisi özeti
- Yorumlar ve puan dağılımı (yalnızca doğrulanmış alıcılar yorum yazabilir; moderasyon sonrası yayın)
- Benzer / birlikte alınanlar ürün önerileri
- Yapılandırılmış veri (JSON-LD: Product, Offer, AggregateRating, BreadcrumbList)
- Paylaşım, favorilere ekleme

### 5.4 Arama
- Otomatik tamamlama (debounce'lu), son aramalar
- Türkçe karakter toleransı (ı/i, ş/s, ğ/g, ü/u, ö/o, ç/c eşleşmesi), yazım hatası toleransı
- Sonuç bulunamazsa alternatif öneriler

### 5.5 Sepet
- Mini sepet (drawer) + tam sepet sayfası
- Adet güncelleme, silme, "sonra al"/favorilere taşıma
- Gerçek zamanlı stok ve fiyat doğrulama (sepet açıldığında sunucu tarafında yeniden hesaplanır)
- Kupon kodu girişi, ücretsiz kargo için kalan tutar göstergesi
- Misafir sepeti 30 gün saklanır; girişte hesap sepetiyle birleştirilir
- Terk edilmiş sepet e-postası (24 saat sonra, yalnızca izin verenlere)

### 5.6 Ödeme (Checkout)
- **Misafir ödeme** desteklenmeli (zorunlu üyelik yok), ödeme sonrası hesap oluşturma önerisi
- Adımlar: İletişim → Teslimat adresi → Kargo yöntemi → Ödeme → Onay (tek sayfa akordeon veya adım adım)
- Kayıtlı adres seçimi, il/ilçe/mahalle bağımlı seçim listeleri
- Fatura adresi (bireysel / kurumsal — TC kimlik no veya vergi no/dairesi)
- Ödeme yöntemleri: kredi/banka kartı (3D Secure zorunlu), taksit seçenekleri, havale/EFT, kapıda ödeme (opsiyonel, ayarlanabilir)
- Kart bilgisi **asla** kendi sunucumuzda saklanmaz/loglanmaz; sağlayıcının hosted form / iframe / tokenization çözümü kullanılır
- Mesafeli satış sözleşmesi ve ön bilgilendirme formu onayı (checkbox, sipariş verilmeden önce zorunlu; sözleşme metni sipariş anındaki halde saklanır)
- Çift tıklama / çift sipariş koruması (idempotency key)
- Başarılı/başarısız ödeme sayfaları, hata mesajları anlaşılır ve eyleme yönlendirici olmalı

### 5.7 Hesabım
- Profil bilgileri, parola değiştirme, e-posta/telefon doğrulama
- Adres defteri
- Siparişlerim: liste, detay, kargo takibi, fatura indirme, yeniden sipariş ver
- İade/değişim talebi oluşturma ve takibi
- Favoriler, yorumlarım
- İletişim/pazarlama izin tercihleri
- **KVKK:** hesabı silme ve verilerini indirme talebi

### 5.8 Statik / Bilgilendirme Sayfaları
Hakkımızda, İletişim, SSS, Kargo ve Teslimat, İade ve Değişim Koşulları, Gizlilik Politikası, KVKK Aydınlatma Metni, Çerez Politikası, Mesafeli Satış Sözleşmesi, Kullanım Koşulları. Bu içerikler admin panelinden düzenlenebilir olmalı.

---

## 6. Yönetim Paneli (`/admin`)

Rol tabanlı erişim: `ADMIN` her şeyi yönetir; `STAFF` yalnızca sipariş ve ürün işlemlerini görür (yetki matrisi `lib/permissions.ts` içinde).

### 6.1 Dashboard
Günlük/haftalık/aylık ciro, sipariş sayısı, ortalama sepet tutarı, dönüşüm oranı, en çok satanlar, düşük stok uyarıları, bekleyen siparişler ve iade talepleri.

### 6.2 Ürün Yönetimi
- Ekle/düzenle/arşivle, varyant ve stok yönetimi, çoklu görsel yükleme (sürükle-bırak, sıralama)
- Toplu işlemler: CSV/Excel ile içe/dışa aktarma, toplu fiyat/stok güncelleme
- SEO alanları (başlık, açıklama, slug), taslak/yayın durumu

### 6.3 Sipariş Yönetimi
- Filtrelenebilir sipariş listesi (durum, tarih, ödeme, kargo)
- Sipariş detayı, durum güncelleme, dahili not, kargo etiketi oluşturma / takip no ekleme
- Müşteriye otomatik bildirim (e-posta/SMS) durum değişikliklerinde
- İade ve iptal yönetimi, kısmi/tam geri ödeme (ödeme sağlayıcısı API'si üzerinden)
- Fatura oluşturma/gönderme

### 6.4 Diğer Modüller
- Kategoriler, markalar, kuponlar ve kampanyalar (zamanlanmış), banner/slider yönetimi
- Müşteri listesi ve detay (sipariş geçmişi)
- Yorum moderasyonu
- Stok hareketleri ve düşük stok raporu
- Site ayarları (kargo, ödeme yöntemleri, bakım modu, iletişim bilgileri)
- Raporlar: satış, ürün performansı, kupon kullanımı (CSV dışa aktarma)
- Denetim kayıtları (audit log) görüntüleme

---

## 7. İş Kuralları

1. **Stok rezervasyonu:** Ödeme başlatıldığında stok 15 dakika rezerve edilir; ödeme tamamlanmazsa otomatik serbest bırakılır (zamanlanmış görev). Eşzamanlı satışlarda aşırı satışı önlemek için veritabanı seviyesinde atomik güncelleme/kilit kullan.
2. **Fiyat doğruluğu:** Fiyatlar ve toplamlar **her zaman sunucuda** hesaplanır; istemciden gelen tutarlara güvenilmez.
3. **KDV:** Ürün fiyatları KDV dahil gösterilir; KDV oranı ürün bazında tutulur (%1, %10, %20 vb.) ve faturada ayrıştırılır.
4. **Kargo:** Ücretsiz kargo limiti ve sabit/desi bazlı ücret ayarlardan okunur. Varsayılan örnek: 500 ₺ üzeri ücretsiz.
5. **Kupon:** Tek siparişte bir kupon; kupon kuralları (alt sınır, kategori, süre, kullanım limiti) sipariş onayında yeniden doğrulanır.
6. **Cayma hakkı:** Tüketici, teslimden itibaren 14 gün içinde gerekçe göstermeden cayabilir (istisnalar: hijyen ürünleri, kişiye özel ürünler vb. — ürün bazında "iade edilemez" işareti).
7. **Geri ödeme:** İade onaylandığında ödeme, orijinal ödeme yöntemine geri yapılır; durum müşteriye bildirilir.
8. **Sipariş iptali:** Kargoya verilmeden önce müşteri iptal edebilir; sonrasında iade akışı işler.
9. **Fiyat snapshot'ı:** Sipariş anındaki ürün adı, fiyat ve KDV `OrderItem`'a kopyalanır.
10. **Misafir siparişi:** E-posta + sipariş no ile sipariş sorgulama sayfası sunulur.

---

## 8. Entegrasyonlar

Tüm dış servisler `lib/` altında **arayüz (interface) arkasında** soyutlanmalı; böylece sağlayıcı değişimi iş mantığını etkilemez.

| Alan | Aday sağlayıcılar | Notlar |
|---|---|---|
| Ödeme | iyzico, PayTR | 3D Secure, taksit, iade/iptal API'si, webhook ile durum doğrulama |
| Kargo | Yurtiçi, Aras, MNG, Sürat, PTT; ya da agregatör (Geliver, Kargonomi vb.) | Etiket, takip, ücret hesaplama |
| e-Fatura/e-Arşiv | Paraşüt, Logo, Uyumsoft, Foriba vb. | Bireysel satışta e-Arşiv fatura otomatik kesimi |
| SMS | Netgsm, İletimerkezi | Sipariş bildirimi, OTP |
| E-posta | Resend / SMTP | Sipariş onayı, kargo, şifre sıfırlama, terk edilmiş sepet |
| Analitik | Google Analytics 4, Meta Pixel | Çerez onayına bağlı; e-ticaret olayları (view_item, add_to_cart, purchase) |
| Adres verisi | İl/ilçe/mahalle veri seti | Statik veri veya servis |

**Webhook kuralı:** Ödeme sağlayıcısının webhook/callback'leri imza ile doğrulanmalı ve idempotent işlenmelidir; sipariş durumu yalnızca sunucu doğrulamasıyla "PAID" olur, istemci yönlendirmesine güvenilmez.

---

## 9. Güvenlik Gereksinimleri

- Parolalar `argon2` veya `bcrypt` ile hash'lenir; minimum karmaşıklık kuralı
- Oturumlar HttpOnly, Secure, SameSite cookie'lerle; CSRF koruması
- Tüm girdiler **Zod** ile sunucu tarafında doğrulanır; Prisma parametreli sorguları dışında ham SQL yazılmaz
- Rate limiting: giriş, kayıt, şifre sıfırlama, kupon deneme, arama ve ödeme uçlarında (Redis)
- Brute-force koruması: art arda başarısız girişte gecikme/kilit; admin için opsiyonel 2FA
- XSS: kullanıcı içeriği (yorum, açıklama) sanitize edilir; CSP başlıkları tanımlanır
- Yetkilendirme: her server action/route'ta rol ve **kaynak sahipliği** kontrolü (başkasının siparişine erişim engeli — IDOR)
- Güvenlik başlıkları: HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Gizli bilgiler yalnızca ortam değişkenlerinde; repoya **asla** commit edilmez; `.env.example` güncel tutulur
- Loglarda kart verisi, parola, token, tam kişisel veri bulunmaz
- Bağımlılık taraması (Dependabot / `npm audit`) CI'da çalışır
- Dosya yüklemelerinde tür/boyut doğrulama, rastgele dosya adı
- PCI-DSS: Kart verisi sistemimize girmez (sağlayıcı tokenization); SAQ-A kapsamında kal

---

## 10. Yasal Uyumluluk (Türkiye)

- **6502 sayılı Tüketicinin Korunması Hakkında Kanun** ve **Mesafeli Sözleşmeler Yönetmeliği:** ön bilgilendirme formu, mesafeli satış sözleşmesi, 14 günlük cayma hakkı, sipariş öncesi "ödeme yükümlülüğü içeren sipariş" butonu ifadesi
- **6698 sayılı KVKK:** aydınlatma metni, açık rıza (pazarlama için ayrı), çerez onay banner'ı (zorunlu olmayan çerezler onaydan önce yüklenmez), veri silme/erişim talebi akışı, VERBİS yükümlülüğü kontrolü
- **6563 sayılı Elektronik Ticaret Kanunu:** satıcı kimlik bilgilerinin (unvan, adres, MERSİS, vergi no, iletişim) sitede görünür olması; ticari elektronik ileti için **İYS** (İleti Yönetim Sistemi) entegrasyonu/kaydı
- **ETBİS** kaydı (gerekli ise) bilgisinin sitede gösterimi
- **e-Arşiv fatura / e-İrsaliye** yükümlülükleri (mali müşavir ile doğrulanmalı)
- Fiyat gösterimi: KDV dahil, kargo ücreti ödeme öncesi açıkça belirtilir
- Yorum ve puanlama: sahte yorum önleme, moderasyon politikası

> Not: Bu bölüm geliştirme rehberidir, hukuki danışmanlık değildir. Yayına almadan önce sözleşme ve politika metinleri bir hukukçu/mali müşavir tarafından onaylanmalıdır.

---

## 11. Performans ve SEO

### Performans Hedefleri
- Lighthouse (mobil): Performans ≥ 90, Erişilebilirlik ≥ 95, SEO ≥ 95
- Core Web Vitals: LCP < 2.5 sn, INP < 200 ms, CLS < 0.1
- Görseller `next/image` ile WebP/AVIF, uygun `sizes`, lazy loading (ilk ekran hariç — `priority`)
- Kategori/ürün sayfaları ISR veya önbellekli SSR; stok/fiyat gibi dinamik veriler için kısa revalidate veya istemci tarafı tazeleme
- Veritabanı: sık sorgulanan alanlara indeks (slug, kategori, durum, SKU); N+1 sorgulardan kaçın
- Font optimizasyonu (`next/font`), kullanılmayan JS'in azaltılması, üçüncü parti betiklerin gecikmeli yüklenmesi

### SEO
- Her sayfada benzersiz `title` ve `meta description`, canonical URL
- Temiz, Türkçe karaktersiz slug'lar (`/urun/kablosuz-kulaklik`)
- `sitemap.xml` ve `robots.txt` otomatik üretilir
- Open Graph / Twitter Card etiketleri
- JSON-LD yapılandırılmış veri (Product, BreadcrumbList, Organization, FAQ)
- Filtreli listelemelerde duplicate content için canonical/noindex stratejisi
- 301 yönlendirme yönetimi (slug değişiminde otomatik)

---

## 12. UI/UX ve Erişilebilirlik

- **Mobile-first**, kırılma noktaları: 360 / 768 / 1024 / 1280
- Tutarlı tasarım sistemi: renk, tipografi, boşluk, gölge token'ları `tailwind.config` içinde; açık tema (koyu tema opsiyonel)
- Marka renkleri ve logo yer tutucu olarak config'den okunur
- WCAG 2.1 AA: yeterli renk kontrastı, klavye ile gezinme, odak göstergeleri, anlamlı `alt` metinleri, form etiketleri ve hata mesajları (`aria-*`)
- Dokunmatik hedefler en az 44×44 px
- Tüm asenkron işlemlerde yükleme, hata ve boş durum ekranları
- Formlarda satır içi doğrulama, anlaşılır Türkçe hata mesajları
- Mikro etkileşimler abartısız; `prefers-reduced-motion` desteklenir
- Para birimi ve tarih biçimi: `Intl` ile `tr-TR` (örn. `1.299,90 ₺`)

---

## 13. Kod Standartları

- TypeScript `strict: true`; `any` kullanımından kaçın
- ESLint + Prettier + `lint-staged` + Husky (commit öncesi)
- Dosya adları: bileşenler `PascalCase.tsx`, diğerleri `kebab-case.ts`
- Server Component varsayılan; yalnızca gerektiğinde `"use client"`
- Veri doğrulama için paylaşılan Zod şemaları (`lib/validators`) hem form hem sunucuda kullanılır
- Hata yönetimi: servis katmanında tipli hatalar, kullanıcıya anlaşılır mesaj, sunucuda yapılandırılmış log
- Para tutarları veritabanında **kuruş cinsinden tam sayı** (`Int`) olarak saklanır; kayan nokta kullanılmaz
- Commit mesajları: Conventional Commits (`feat:`, `fix:`, `chore:` …)
- Dal stratejisi: `main` (korumalı) ← `feature/*`; PR olmadan merge yok
- Yorumlar "ne" değil "neden" açıklar; karmaşık iş kuralları `docs/DECISIONS.md`'de belgelenir

---

## 14. Test Stratejisi

| Tür | Kapsam | Araç |
|---|---|---|
| Birim | Fiyat/KDV/kupon hesaplama, stok mantığı, durum geçişleri, validator'lar | Vitest |
| Entegrasyon | Servis katmanı + test veritabanı, webhook işleme | Vitest + test DB |
| E2E | Kritik akışlar | Playwright |

**Zorunlu E2E senaryoları:**
1. Ürün arama → ürün detay → sepete ekleme → misafir ödeme → sipariş onayı
2. Kayıt → giriş → sipariş → siparişi hesabımda görme
3. Kupon uygulama (geçerli/geçersiz/süresi dolmuş)
4. Stoksuz ürünün sepete eklenememesi / ödeme sırasında stok tükenmesi
5. Başarısız ödeme sonrası yeniden deneme
6. İade talebi oluşturma
7. Admin: ürün ekleme → siparişi kargoya verme

Birim test kapsamı: iş mantığı katmanında hedef ≥ %80.

---

## 15. Ortam ve Dağıtım

- Ortamlar: `development`, `staging`, `production` — her biri ayrı veritabanı ve ödeme sağlayıcı **test/canlı** anahtarlarıyla
- Gerekli ortam değişkenleri `.env.example`'da belgelenir (DB URL, AUTH_SECRET, ödeme/kargo/e-posta/SMS anahtarları, site URL'i)
- CI pipeline: lint → tip kontrolü → birim testler → build → (staging'de) E2E
- Veritabanı migrasyonları otomatik ve geri alınabilir; production'a doğrudan elle şema değişikliği yapılmaz
- Günlük otomatik veritabanı yedeği, geri yükleme prosedürü test edilmiş olmalı
- Hata izleme (Sentry), uptime izleme, yapılandırılmış loglama
- Zamanlanmış görevler: stok rezervasyonu temizliği, terk edilmiş sepet e-postası, süresi dolan kuponlar

---

## 16. Geliştirme Yol Haritası (Aşamalar)

Agent, aşağıdaki sırayla ilerlemeli ve her aşama sonunda çalışan, test edilmiş bir durum bırakmalıdır.

**Aşama 0 — Temel kurulum**
- Proje iskeleti, TypeScript/ESLint/Prettier, Tailwind + shadcn, Prisma + PostgreSQL, `.env.example`, CI iskeleti
- Seed verisi (örnek kategori, ürün, kullanıcı, admin)

**Aşama 1 — Katalog**
- Kategori, ürün, varyant, görsel modelleri; listeleme, filtre, sıralama, ürün detay, arama
- SEO temelleri (metadata, sitemap, JSON-LD)

**Aşama 2 — Kimlik doğrulama ve hesap**
- Kayıt/giriş/şifre sıfırlama, e-posta doğrulama, profil, adres defteri, favoriler

**Aşama 3 — Sepet ve ödeme**
- Misafir/üye sepeti, kupon, kargo hesaplama, checkout akışı, iyzico entegrasyonu (sandbox), webhook, stok rezervasyonu, sipariş oluşturma, onay e-postası

**Aşama 4 — Sipariş yönetimi ve admin paneli**
- Admin dashboard, ürün/sipariş/kupon/kategori yönetimi, kargo ve bildirim akışı, e-Arşiv fatura entegrasyonu

**Aşama 5 — Satış sonrası**
- İade/değişim, yorum ve puanlama, terk edilmiş sepet, stok bildirimi, raporlar

**Aşama 6 — Yasal ve cilalama**
- Sözleşme/KVKK/çerez sayfaları ve banner, İYS, erişilebilirlik denetimi, performans optimizasyonu, güvenlik gözden geçirmesi

**Aşama 7 — Yayına hazırlık**
- E2E testleri, yük testi, staging doğrulaması, izleme/yedekleme, canlıya geçiş kontrol listesi

---

## 17. Tamamlanma Kriterleri (Definition of Done)

Bir görev yalnızca şunlar sağlandığında tamamlanmış sayılır:
- [ ] Özellik bu şartnamedeki ilgili bölümle uyumlu
- [ ] TypeScript hatası ve lint uyarısı yok
- [ ] İlgili birim/E2E testleri yazıldı ve geçiyor
- [ ] Mobil ve masaüstünde manuel olarak doğrulandı
- [ ] Yükleme / hata / boş durumlar ele alındı
- [ ] Yetkilendirme ve girdi doğrulama kontrol edildi
- [ ] Gerekli ise migrasyon ve seed güncellendi
- [ ] Belgeler (`docs/`, `.env.example`) güncellendi

---

## 18. Antigravity Agent Çalışma Kuralları

1. **Önce planla:** Büyük bir özelliğe başlamadan önce kısa bir uygulama planı çıkar (etkilenen dosyalar, veri modeli değişikliği, riskler), ardından uygula.
2. **Küçük, doğrulanabilir adımlar:** Her adımda derle/test et; kırık bir durumu bir sonraki adıma taşıma.
3. **Belirsizlikte en güvenli varsayım:** Geri alınabilir seçeneği seç, varsayımı `docs/DECISIONS.md`'ye yaz.
4. **Güvenlik önceliklidir:** Hız için güvenlik kontrolünü (doğrulama, yetkilendirme, webhook imzası) atlama.
5. **Gizli bilgi sızdırma:** Gerçek API anahtarı, parola veya kişisel veri üretme/commit etme; yalnızca placeholder kullan.
6. **Mevcut yapıyı koru:** Yeni bağımlılık eklemeden önce mevcut araçlarla çözülüp çözülemeyeceğini değerlendir.
7. **Tarayıcı doğrulaması:** UI değişikliklerinden sonra uygulamayı çalıştırıp kritik akışı (sepet → ödeme) tarayıcıda doğrula; ekran görüntüsü/kayıt ile kanıtla.
8. **Her aşama sonunda özet:** Yapılanlar, kalan işler, bilinen sorunlar ve sonraki adım önerisini kısa bir raporla.
9. **Sınırı aş­ma:** Bu belgede olmayan büyük kapsam eklemeleri (örn. pazaryeri, abonelik) için önce onay iste.

---

## 19. Açık Sorular (Proje Sahibi Tarafından Doldurulacak)

Aşağıdaki bilgiler netleştikçe ilgili bölümler güncellenmelidir:

- [ ] Marka adı, logo, renk paleti, ton (resmi / samimi)
- [ ] Satılacak ürün kategorileri ve yaklaşık ürün sayısı
- [ ] Varyant ihtiyacı (beden/renk/hacim vb.)
- [ ] Tercih edilen ödeme sağlayıcısı ve kapıda ödeme isteği
- [ ] Anlaşmalı kargo firması(ları) ve kargo ücret modeli
- [ ] e-Arşiv fatura sağlayıcısı / mali müşavir
- [ ] Şirket türü, MERSİS/vergi bilgileri, ETBİS/İYS durumu
- [ ] Hedef lansman tarihi ve bütçe/barındırma tercihi
- [ ] Çoklu dil / çoklu para birimi ihtiyacı (ilk sürümde var mı?)
- [ ] Mevcut ürün verisi (Excel/CSV) var mı, aktarım gerekli mi?
