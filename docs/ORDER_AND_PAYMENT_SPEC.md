# Sarıyıldız E-Ticaret — Sipariş Yönetimi (OMS), Stok & Ödeme Webhook Spesifikasyonu

Bu doküman, Sarıyıldız E-Ticaret platformunun **Sipariş Yönetimi (OMS)**, **Stok Rezervasyon & Düşürme Akışı** ve **iyzico Ödeme Entegrasyonu** mimarisini ve kurallarını açıklar.

---

## 1. Sipariş Durum Geçiş Matrisi (Order State Machine)

Siparişler aşağıdaki durumlar arasında sadece tanımlı yönlerde ilerleyebilir. Yetkisiz veya geçersiz geçişler sistem tarafından engellenir:

```
[ pending_payment ] (Ödeme Bekleniyor)
       │
       ├──► [ paid ] (Ödeme Onaylandı)
       │         │
       │         ├──► [ processing ] (Depoda Hazırlanıyor)
       │         │          │
       │         │          └──► [ shipped ] (Kargoya Verildi)
       │         │                     │
       │         │                     └──► [ delivered ] (Teslim Edildi)
       │         │                               │
       │         ├──► [ refunded ] (İade Edildi) ◄─┘
       │         │
       │         └──► [ cancelled ] (İptal Edildi)
       │
       └──► [ cancelled ] (Ödeme Başarısız / Zaman Aşımı)
```

### Durum Tablosu & İzin Verilen Sonraki Durumlar

| Mevcut Durum | İzin Verilen Sonraki Durumlar | Açıklama |
|---|---|---|
| `pending_payment` | `paid`, `cancelled` | Müşteri ödeme ekranında bekliyor veya sepeti tamamladı. |
| `paid` | `processing`, `cancelled`, `refunded` | Ödeme alındı, sipariş depoya iletildi. **Stok otomatik düşürülür.** |
| `processing` | `shipped`, `cancelled` | Depo personeli ürünleri paketliyor ve irsaliye hazırlıyor. |
| `shipped` | `delivered`, `refunded` | Kargo takip no ve takip linki girilerek müşteriye bildirim gitti. |
| `delivered` | `refunded` | Müşteriye teslim edildi. Müşteri cayma/iade hakkı talep edebilir. |
| `cancelled` | *(Son Durum)* | Sipariş iptal edildi. Varsa **stok otomatik geri iade edilir.** |
| `refunded` | *(Son Durum)* | Ücret müşteriye iade edildi. **Stok otomatik geri iade edilir.** |

---

## 2. Otomatik Stok Yönetimi & Rezervasyon Akışı (Payload Hooks)

Stok yönetimi, insan hatasını önlemek ve yarış durumlarını (race conditions) engellemek amacıyla doğrudan Payload CMS `Orders` collection'ının `afterChange` hook'u içinde yürütülür:

### 2.1 Ödeme Onayı (`paid`)
1. Sipariş durumu `paid` değerine ulaştığında hook devreye girer.
2. `order.items` dizisindeki her bir kalem için:
   - Eğer `item.product` ilişkisi tanımlıysa doğrudan ilgili `Products` dokümanı bulunur.
   - Değilse `item.sku` üzerinden ilgili ürün bulunur.
3. Ürünün mevcut stoku sipariş adedi kadar azaltılır (`Math.max(0, stock - quantity)`).
4. Eğer ürün stoku kritik seviyenin (≤ 5) altına inerse, Payload Dashboard'daki `BeforeDashboard` ekranında kırmızı uyarı kutucuğu tetiklenir.

### 2.2 İptal ve İade (`cancelled` / `refunded`)
1. Ödenmiş bir sipariş iptal veya iade edildiğinde hook devreye girer.
2. Her bir kalemdeki adet, ilgili ürünün stok sayısına geri eklenir (`stock + quantity`).
3. Mağaza vitrininde ürün tekrar anında satışa açılır.

---

## 3. iyzico Ödeme Entegrasyonu ve Webhook Akışı

### 3.1 Ödeme Başlatma (`/api/checkout/initialize`)
1. Müşteri `/odeme` sayfasında kart veya 3D Secure ile ödeme başlatır.
2. Sunucu tarafında `OrderService.calculateTotals()` çalıştırılır; fiyatlar ve kargo ücreti kesin olarak doğrulanır (müşteriden gelen fiyata asla güvenilmez).
3. Payload CMS Local API ile `status: "pending_payment"` olarak sipariş kaydı açılır ve sipariş numarası üretilir (`SY-YYYYMM-XXXX`).
4. iyzico Checkout Form veya 3D Secure API'sine `callbackUrl: "/api/checkout/callback"` ve sipariş numarası iletilir.

### 3.2 Callback & Webhook Doğrulama (`/api/checkout/webhook` & `/api/checkout/callback`)
1. iyzico'dan dönen imza (hash / token) `PaymentProvider.verifyCallback()` ile doğrulanır.
2. Ödeme başarılı ise:
   ```ts
   await payload.update({
     collection: "orders",
     id: order.id,
     data: {
       status: "paid",
     },
   });
   ```
3. Bu güncelleme `Orders` collection'ının `afterChange` hook'unu tetikler:
   - Stoklar otomatik olarak düşürülür.
   - Müşteriye ve yöneticiye sipariş onay e-postası tetiklenir.
4. Müşteri başarılı teşekkür sayfasına (`/odeme/basarili?order=...`) yönlendirilir.

---

## 4. Admin Paneli (OMS) Entegrasyonu

Tüm bu süreç yöneticiler tarafından ek bir sayfa olmadan doğrudan Payload Admin (`/admin`) panelinden yönetilir:
- **Kargo Yönetimi:** 7 Türk kargo şirketi (Yurtiçi, Aras, MNG, Sürat, PTT, Kolay Gelsin, HepsiJet) arasından seçim yapma, takip no ve otomatik takip linki oluşturma.
- **Adres Kartı:** İl, ilçe, posta kodu ve açık adres blokları.
- **Yapay Zeka:** Ürün ekleme ekranında Gemini 2.5 Flash ile tek tıkla ürün bilgilerini otomatik üretme.
