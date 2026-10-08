export default function DistanceSellingContractPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 text-slate-300">
      <h1 className="text-3xl font-extrabold text-white mb-6">
        Mesafeli Satış Sözleşmesi
      </h1>
      <p className="text-xs text-slate-400 mb-8">
        Son Güncelleme: 08 Ekim 2026 · 6502 Sayılı Tüketicinin Korunması Hakkında Kanun Uyarınca
      </p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">1. TARAFLAR</h2>
          <p>
            İşbu Sözleşme, aşağıda bilgileri bulunan <strong>SATICI</strong> ile www.sariyildiz.com internet sitesinden sipariş veren <strong>ALICI</strong> arasında akdedilmiştir.
          </p>
          <div className="mt-3 rounded-xl border border-slate-800 bg-[#0e1320] p-4 text-xs space-y-1">
            <p><strong>SATICI:</strong> Sarıyıldız E-Ticaret ve Mutfak Ekipmanları San. Tic. Ltd. Şti.</p>
            <p><strong>E-posta:</strong> destek@sariyildiz.com</p>
            <p><strong>Telefon:</strong> 0850 123 45 67</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">2. KONU</h2>
          <p>
            İşbu sözleşmenin konusu, ALICI’nın SATICI’ya ait internet sitesinden elektronik ortamda siparişini yaptığı ürünlerin satışı, teslimi ve 6502 sayılı Kanun kapsamındaki hak ve yükümlülüklerinin belirlenmesidir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">3. CAYMA HAKKI (14 GÜN)</h2>
          <p>
            ALICI, sözleşme konusu malın kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren <strong>14 (on dört) gün</strong> içinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkına sahiptir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">4. CAYMA HAKKININ İSTİSNALARI</h2>
          <p>
            Alıcının istekleri veya açıkça kişisel ihtiyaçları doğrultusunda hazırlanan (özel lazer isim baskılı bıçaklar, hijyen ambalajı açılmış ürünler vb.) mallarda cayma hakkı kullanılamaz.
          </p>
        </section>
      </div>
    </div>
  );
}
