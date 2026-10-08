import { CategoryItem, ProductItem } from "@/types";

export const CATEGORIES: CategoryItem[] = [
  {
    id: "cat-bicak",
    name: "Şef Bıçakları & Satırlar",
    slug: "sef-bicaklari-ve-satirlar",
    description: "Yüksek karbonlu paslanmaz çelikten üretilmiş profesyonel mutfak bıçakları ve satırlar.",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=800&auto=format&fit=crop",
    order: 1,
  },
  {
    id: "cat-elektronik",
    name: "Şarj & Güç Çözümleri",
    slug: "sarj-ve-guc-cozumleri",
    description: "Yeni nesil GaN adaptörler, hızlı şarj aletleri, powerbankler ve dayanıklı kablolar.",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop",
    order: 2,
  },
  {
    id: "cat-outdoor",
    name: "Kamp & Outdoor Aydınlatma",
    slug: "kamp-ve-outdoor-aydinlatma",
    description: "Şarj edilebilir kamp lambaları, solar fenerler ve açık hava ekipmanları.",
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=800&auto=format&fit=crop",
    order: 3,
  },
  {
    id: "cat-ses",
    name: "Wireless Hoparlör & Ses",
    slug: "wireless-hoparlor-ve-ses",
    description: "Taşınabilir bluetooth hoparlörler, yüksek bass gücü ve suya dayanıklı gövde.",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop",
    order: 4,
  },
];

export const PRODUCTS: ProductItem[] = [
  // 1. ŞEF BIÇAKLARI & SATIRLAR
  {
    id: "prod-1",
    name: "Sarıyıldız Pro Dövme Şef Bıçağı 20 cm",
    slug: "sariyildiz-pro-dovme-sef-bicagi-20-cm",
    description: "Yüksek karbonlu Alman X50CrMoV15 çeliğinden dövülerek üretilmiş, profesyonel şefler ve mutfak tutkunları için mükemmel dengeye sahip şef bıçağı. Ergonomik ceviz ağacı sapı el yorgunluğunu önler.",
    brand: "Sarıyıldız",
    category: CATEGORIES[0],
    isFeatured: true,
    rating: 4.9,
    reviewCount: 38,
    images: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=1000&auto=format&fit=crop",
        altText: "Sarıyıldız Pro Şef Bıçağı",
      },
      {
        id: "img-1-2",
        url: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?q=80&w=1000&auto=format&fit=crop",
        altText: "Bıçak Detay",
      },
    ],
    variants: [
      {
        id: "var-1-1",
        sku: "SY-BIC-01-20CM",
        name: "20 cm - Ceviz Sap",
        attributes: { "Namlu Boyu": "20 cm", Sap: "Doğal Ceviz" },
        price: 84900, // 849.00 TL
        compareAtPrice: 119900,
        stock: 24,
      },
      {
        id: "var-1-2",
        sku: "SY-BIC-01-24CM",
        name: "24 cm - Ceviz Sap",
        attributes: { "Namlu Boyu": "24 cm", Sap: "Doğal Ceviz" },
        price: 98900, // 989.00 TL
        compareAtPrice: 135000,
        stock: 12,
      },
    ],
  },
  {
    id: "prod-2",
    name: "Sarıyıldız Ağır Hizmet Paslanmaz Çelik Kasap Satırı",
    slug: "sariyildiz-agir-hizmet-paslanmaz-celik-kasap-satiri",
    description: "Kemikli etleri, sert kıkırdak ve eklemleri zahmetsizce parçalamak için tasarlanmış sağlam gövdeli et satırı. 4 mm et kalınlığı ve kaydırmaz perçinli sap.",
    brand: "Sarıyıldız",
    category: CATEGORIES[0],
    isFeatured: true,
    rating: 4.8,
    reviewCount: 19,
    images: [
      {
        id: "img-2",
        url: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?q=80&w=1000&auto=format&fit=crop",
        altText: "Sarıyıldız Kasap Satırı",
      },
    ],
    variants: [
      {
        id: "var-2-1",
        sku: "SY-STR-01",
        name: "Ağır Model 850 gr",
        attributes: { Ağırlık: "850 gr", Kalınlık: "4 mm" },
        price: 72900, // 729.00 TL
        compareAtPrice: 89000,
        stock: 15,
      },
    ],
  },
  {
    id: "prod-3",
    name: "Sarıyıldız Profesyonel Oval Elmas Bileme Masadı 30 cm",
    slug: "sariyildiz-profesyonel-oval-elmas-bileme-masadi-30-cm",
    description: "Bıçaklarınızın keskinliğini ilk günkü fabrikasyon düzeyine getiren mikro elmas kaplamalı profesyonel masat. Koruyucu parmak korumalığı ve asma halkası mevcuttur.",
    brand: "Sarıyıldız",
    category: CATEGORIES[0],
    isFeatured: false,
    rating: 5.0,
    reviewCount: 14,
    images: [
      {
        id: "img-3",
        url: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=1000&auto=format&fit=crop",
        altText: "Bileme Masadı",
      },
    ],
    variants: [
      {
        id: "var-3-1",
        sku: "SY-MSD-01",
        name: "30 cm Standart",
        attributes: { Uzunluk: "30 cm" },
        price: 34900, // 349.00 TL
        compareAtPrice: 45000,
        stock: 40,
      },
    ],
  },

  // 2. ŞARJ & ELEKTRONİK
  {
    id: "prod-4",
    name: "Sarıyıldız GaN Pro 65W Çoklu Hızlı Şarj Cihazı",
    slug: "sariyildiz-gan-pro-65w-coklu-hizli-sarj-cihazi",
    description: "Galyum Nitrür (GaN) teknolojisi ile ısınmayan ultra kompakt gövde. 2 Adet Type-C PD 3.0 ve 1 Adet USB-A QC 4.0 çıkışı ile dizüstü bilgisayar, tablet ve akıllı telefonu aynı anda şarj edin.",
    brand: "Sarıyıldız",
    category: CATEGORIES[1],
    isFeatured: true,
    rating: 4.9,
    reviewCount: 82,
    images: [
      {
        id: "img-4",
        url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=1000&auto=format&fit=crop",
        altText: "GaN Hızlı Şarj Cihazı",
      },
    ],
    variants: [
      {
        id: "var-4-1",
        sku: "SY-CHG-65W-BLK",
        name: "Mat Siyah",
        attributes: { Renk: "Siyah", Güç: "65W" },
        price: 59900, // 599.00 TL
        compareAtPrice: 79900,
        stock: 65,
      },
      {
        id: "var-4-2",
        sku: "SY-CHG-65W-WHT",
        name: "Parlak Beyaz",
        attributes: { Renk: "Beyaz", Güç: "65W" },
        price: 59900,
        compareAtPrice: 79900,
        stock: 35,
      },
    ],
  },
  {
    id: "prod-5",
    name: "Sarıyıldız 20.000 mAh Dijital Göstergeli 22.5W Powerbank",
    slug: "sariyildiz-20000-mah-dijital-gostergeli-powerbank",
    description: "Kalan pil durumunu yüzde olarak gösteren LED ekran, Type-C çift yönlü hızlı şarj, uçak seyahatine uygun güvenlik sertifikalı yüksek kapasiteli taşınabilir batarya.",
    brand: "Sarıyıldız",
    category: CATEGORIES[1],
    isFeatured: true,
    rating: 4.8,
    reviewCount: 46,
    images: [
      {
        id: "img-5",
        url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=1000&auto=format&fit=crop",
        altText: "20000 mAh Powerbank",
      },
    ],
    variants: [
      {
        id: "var-5-1",
        sku: "SY-PWR-20K-GRY",
        name: "Uzay Grisi",
        attributes: { Kapasite: "20.000 mAh", Renk: "Uzay Grisi" },
        price: 74900, // 749.00 TL
        compareAtPrice: 95000,
        stock: 45,
      },
    ],
  },

  // 3. OUTDOOR & KAMP AYDINLATMA
  {
    id: "prod-6",
    name: "Sarıyıldız Solar Şarjlı Çok Fonksiyonlu Kamp Lambası & Fener",
    slug: "sariyildiz-solar-sarjli-cok-fonksiyonlu-kamp-lambasi",
    description: "Hem güneş enerjisiyle hem Type-C kabloyla şarj olabilen 1200 lümen ultra parlak kamp aydınlatması. Telefon şarj edebilme özelliği (Powerbank işlevi), 4 farklı ışık modu (Sıcak sarı, Gün ışığı, Çakar SOS).",
    brand: "Sarıyıldız",
    category: CATEGORIES[2],
    isFeatured: true,
    rating: 4.9,
    reviewCount: 53,
    images: [
      {
        id: "img-6",
        url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1000&auto=format&fit=crop",
        altText: "Sarıyıldız Kamp Lambası",
      },
    ],
    variants: [
      {
        id: "var-6-1",
        sku: "SY-KMP-01-SOLAR",
        name: "Haki Yeşil",
        attributes: { Renk: "Haki Yeşil", Batarya: "5200 mAh" },
        price: 68900, // 689.00 TL
        compareAtPrice: 89000,
        stock: 28,
      },
      {
        id: "var-6-2",
        sku: "SY-KMP-01-BLK",
        name: "Taktik Siyah",
        attributes: { Renk: "Siyah", Batarya: "5200 mAh" },
        price: 68900,
        compareAtPrice: 89000,
        stock: 18,
      },
    ],
  },
  {
    id: "prod-7",
    name: "Sarıyıldız Vintage Retro Karartmalı Şarjlı Çadır Feneri",
    slug: "sariyildiz-vintage-retro-karartmali-sarjli-cadir-feneri",
    description: "Nostaljik gaz lambası formunda, kademesiz çevirmeli parlaklık ayarına sahip amber LED sıcak aydınlatma. 36 saate varan kesintisiz kullanım süresi.",
    brand: "Sarıyıldız",
    category: CATEGORIES[2],
    isFeatured: false,
    rating: 4.7,
    reviewCount: 22,
    images: [
      {
        id: "img-7",
        url: "https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=1000&auto=format&fit=crop",
        altText: "Retro Kamp Feneri",
      },
    ],
    variants: [
      {
        id: "var-7-1",
        sku: "SY-KMP-RETRO",
        name: "Bakır Bronz",
        attributes: { Renk: "Bronz", Işık: "Amber Sıcak Işık" },
        price: 49900, // 499.00 TL
        compareAtPrice: 65000,
        stock: 30,
      },
    ],
  },

  // 4. WIRELESS HOPARLÖR & SES
  {
    id: "prod-8",
    name: "Sarıyıldız Titan Sound 30W IPX7 Su Geçirmez Bluetooth Hoparlör",
    slug: "sariyildiz-titan-sound-30w-bluetooth-hoparlor",
    description: "Çift pasif radyatör ve 30W çıkış gücü ile patlayıcı bas performansı. IPX7 tam su geçirmezlik derecesi ile havuz başında, kampta ve yağmurda güvenle kullanın. TWS eşleşme ile çift hoparlör stereo ses.",
    brand: "Sarıyıldız",
    category: CATEGORIES[3],
    isFeatured: true,
    rating: 4.9,
    reviewCount: 64,
    images: [
      {
        id: "img-8",
        url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop",
        altText: "Titan Sound Hoparlör",
      },
    ],
    variants: [
      {
        id: "var-8-1",
        sku: "SY-SPK-30W-BLK",
        name: "Siyah - Altın Vurgulu",
        attributes: { Renk: "Siyah/Altın", Güç: "30W" },
        price: 119900, // 1199.00 TL
        compareAtPrice: 149900,
        stock: 32,
      },
      {
        id: "var-8-2",
        sku: "SY-SPK-30W-CAMO",
        name: "Kamuflaj Askeri",
        attributes: { Renk: "Kamuflaj", Güç: "30W" },
        price: 119900,
        compareAtPrice: 149900,
        stock: 14,
      },
    ],
  },
  {
    id: "prod-9",
    name: "Sarıyıldız Mini Pulse RGB Işıklı Taşınabilir Kablosuz Hoparlör",
    slug: "sariyildiz-mini-pulse-rgb-tasinabilir-hoparlor",
    description: "Müziğin ritmine göre değişen dinamik 360 derece RGB ışıklandırma. Avuç içi boyutu, askı kordonu ve 10 saat kesintisiz müzik deneyimi.",
    brand: "Sarıyıldız",
    category: CATEGORIES[3],
    isFeatured: false,
    rating: 4.6,
    reviewCount: 31,
    images: [
      {
        id: "img-9",
        url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000&auto=format&fit=crop",
        altText: "Mini Pulse Hoparlör",
      },
    ],
    variants: [
      {
        id: "var-9-1",
        sku: "SY-SPK-RGB-BLK",
        name: "Kömür Siyahı",
        attributes: { Renk: "Siyah", Aydınlatma: "RGB" },
        price: 44900, // 449.00 TL
        compareAtPrice: 59900,
        stock: 50,
      },
    ],
  },
];
