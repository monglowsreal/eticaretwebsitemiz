export default function ReturnPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 text-slate-300">
      <h1 className="text-3xl font-extrabold text-white mb-6">
        İade ve Değişim Koşulları
      </h1>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="rounded-2xl border border-slate-800 bg-[#0e1320] p-6">
          <h2 className="text-lg font-bold text-amber-400 mb-2">14 Gün Koşulsuz Cayma Hakkı</h2>
          <p>
            Sarıyıldız üzerinden sipariş verdiğiniz tüm standart ürünleri, teslimat tarihinden itibaren 14 gün içerisinde herhangi bir gerekçe göstermeksizin ve kargo ücreti ödemeksizin iade edebilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">İade Süreci Nasıl İşler?</h2>
          <ol className="list-decimal pl-5 space-y-2 text-xs">
            <li>destek@sariyildiz.com veya 0850 123 45 67 numaralı hattımızdan iade talebinizi bildirin.</li>
            <li>Size iletilecek anlaşmalı kargo iade koduyla ürünü orijinal kutusu ve faturasıyla birlikte ücretsiz teslim edin.</li>
            <li>Ürün depomuza ulaşıp kalite kontrolünden geçtikten sonra en geç 3 iş günü içinde ödemeniz kartınıza iade edilir.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
