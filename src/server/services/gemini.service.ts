export interface GeneratedProduct {
  name: string;
  slug: string;
  categorySlug: "sef-bicaklari" | "sarj-cihazlari" | "kamp-fenerleri" | "hoparlorler";
  brand: string;
  price: number; // Kuruş (örn: 249900 = 2499.00 TL)
  compareAtPrice?: number; // Kuruş (örn: 299900 = 2999.00 TL)
  sku: string;
  stock: number;
  isFeatured: boolean;
  badge?: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  specifications: Record<string, string>;
  seo: {
    title: string;
    description: string;
  };
  suggestedImageUrl?: string;
}

export class GeminiService {
  private static apiKey = process.env.GEMINI_API_KEY || "";

  /**
   * Gemini 2.5 Flash ile kullanıcı promptundan profesyonel e-ticaret ürün içeriği üretir.
   */
  static async generateProduct(userPrompt: string, categoryHint?: string): Promise<GeneratedProduct> {
    const apiKey = this.apiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY ortam değişkeni tanımlı değil.");
    }

    const systemPrompt = `Sen "Sarıyıldız" e-ticaret markasının uzman dijital pazarlama ve ürün yöneticisi yapay zekasısın.
Sarıyıldız markası, yüksek kaliteli profesyonel şef bıçakları ve satırları, GaN yeni nesil hızlı şarj cihazları, solar kamp fenerleri ve suya dayanıklı kablosuz bluetooth hoparlörler satmaktadır.
Obsidian siyah ve altın sarısı estetiğe sahip, lüks ve güvenilir bir markadır.

Görevin: Verilen ürün fikrinden, piyasa dinamiklerine uygun, 6502 Tüketici Kanunu ve SEO standartlarına uyumlu eksiksiz bir ürün modeli üretmektir.
Kategori mutlaka şu dördünden biri olmalıdır:
- "sef-bicaklari"
- "sarj-cihazlari"
- "kamp-fenerleri"
- "hoparlorler"

Fiyatlar KURUŞ cinsinden tam sayı olmalıdır (Örnek: 1999 TL için 199900 kuruş).
Fiyat mantığı:
- Şef Bıçakları: 899 TL - 3.499 TL (89900 - 349900 kuruş)
- GaN Şarj Cihazları: 499 TL - 1.899 TL (49900 - 189900 kuruş)
- Kamp Fenerleri: 399 TL - 1.499 TL (39900 - 149900 kuruş)
- Bluetooth Hoparlörler: 699 TL - 2.999 TL (69900 - 299900 kuruş)
CompareAtPrice varsa fiyattan %15-%25 daha yüksek olmalıdır.

Yanıtını SADECE geçerli bir JSON objesi olarak ver. Markdown kod bloğu (\`\`\`json) ekleme veya sadece saf JSON ver.`;

    const userMessage = `Kullanıcı Ürün Fikri: "${userPrompt}"
${categoryHint ? `Kullanıcı Kategori Tercihi: "${categoryHint}"` : ""}

Aşağıdaki JSON şemasına birebir uygun çıktı üret:
{
  "name": "Sarıyıldız ile başlayan veya içeren çekici, SEO dostu Türkçe ürün adı",
  "slug": "url-uyumlu-kucuk-harf-turkce-karaktersiz-slug",
  "categorySlug": "sef-bicaklari" | "sarj-cihazlari" | "kamp-fenerleri" | "hoparlorler",
  "brand": "Sarıyıldız",
  "price": 199900,
  "compareAtPrice": 249900,
  "sku": "SY-...",
  "stock": 30,
  "isFeatured": true,
  "badge": "Yeni" | "Çok Satan" | "Özel Seri" | "Fırsat",
  "shortDescription": "1-2 cümlelik vurucu vitrin özeti",
  "description": "En az 3-4 paragraflık zengin, satış odaklı, malzeme kalitesini ve kullanım kolaylığını anlatan Türkçe tanıtım metni",
  "highlights": [
    "Madde 1: Önemli özellik",
    "Madde 2: Önemli özellik",
    "Madde 3: Önemli özellik",
    "Madde 4: Önemli özellik"
  ],
  "specifications": {
    "Özellik 1": "Değer 1",
    "Özellik 2": "Değer 2",
    "Özellik 3": "Değer 3",
    "Özellik 4": "Değer 4",
    "Özellik 5": "Değer 5"
  },
  "seo": {
    "title": "Google arama başlığı (maksimum 60 karakter)",
    "description": "Google meta açıklaması (120-155 karakter arası)"
  }
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userMessage}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Hatası (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("Gemini geçerli bir yanıt üretmedi.");
    }

    let parsed: GeneratedProduct;
    try {
      // JSON bloğunu temizle ve ayrıştır
      const cleaned = candidateText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error("Gemini yanıtı JSON olarak ayrıştırılamadı: " + candidateText);
    }

    // Kategoriye uygun yüksek kaliteli varsayılan görsel eşleştirmesi
    const defaultImages: Record<string, string> = {
      "sef-bicaklari": "https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=1000&auto=format&fit=crop",
      "sarj-cihazlari": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=1000&auto=format&fit=crop",
      "kamp-fenerleri": "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?q=80&w=1000&auto=format&fit=crop",
      "hoparlorler": "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop",
    };

    if (!parsed.suggestedImageUrl) {
      parsed.suggestedImageUrl = defaultImages[parsed.categorySlug] || defaultImages["sef-bicaklari"];
    }

    return parsed;
  }
}
