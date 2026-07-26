import { EventScenario } from '../types';

export const INITIAL_EVENTS: EventScenario[] = [
  {
    id: 'yerebatan-gizem',
    title: 'Yerebatan Sarnıcı Medusa Gölgeleri',
    subtitle: 'İstanbul Tarihi Yarımada Gizemi & Paranormal Vaka',
    category: 'Gizem/Korku',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    difficulty: 'Zor',
    description: 'Gece yarısı Yerebatan Sarnıcı\'nın suları yükselirken Medusa sütununun ardında eski bir tılsım parıldamaya başladı. Oğuzhan Karan ile birlikte gizemi çözün!',
    startingPrompt: '*Sarnıcın serin sularında yankılanan damla sesleri kesildi.* Oğuzhan dedektörünü doğrulttu: "Işıkları söndür... Medusa sütununun altındaki fısıltıyı duyuyor musun?"',
    agentName: 'Oğuzhan Karan',
    agentAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
    tags: ['Yerebatan', 'İstanbul', 'Paranormal', 'Gizem'],
    location: 'Yerebatan Sarnıcı, Sultanahmet / İstanbul',
    rewardBadge: 'Gümüş Medusa Mührü',
    rewardXp: 450,
    participantCount: 1420,
    loreBackground: '1500 yıllık Bizans sarnıcının derinliklerinde saklanan ters Medusa başı, İstanbul\'un en kadim paranormal koruyucu muskalarından biridir.',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        caption: 'Yerebatan Sarnıcı su yansımaları ve Medusa sütunu',
        tag: 'Sütunlar'
      },
      {
        url: 'https://images.unsplash.com/photo-1527838832700-54595d24c194?w=800&auto=format&fit=crop&q=80',
        caption: 'Balat\'ın sisli çıkmaz sokakları ve tarihi ahşap konaklar',
        tag: 'Balat Sis'
      },
      {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        caption: 'Gece yarısı paranormal sinyal tespit ve frekans dedektörü',
        tag: 'Ekipman'
      }
    ]
  },
  {
    id: 'galata-heist',
    title: 'Galata Kulesi Siber Kod Operasyonu',
    subtitle: 'Siber İstanbul & Matrix Ağ Sızıntısı',
    category: 'Bilim Kurgu',
    bannerImage: 'https://images.unsplash.com/photo-1527838832700-54595d24c194?w=800&auto=format&fit=crop&q=80',
    difficulty: 'Orta',
    description: 'Galata Kulesi\'nin tepesinden İstanbul Boğazı\'na yayılan şifreli kuantum veri paketi tespit edildi. Asya Yılmaz ile kuleye sızıp veriyi ele geçirin.',
    startingPrompt: '*Galata Kulesi\'nin üstündeki devasa led lambalar kırmızıya döndü.* Asya dizüstü bilgisayarına yüklendi: "Kule güvenlik duvarı 20 saniyede kapanacak, hazır mısın?"',
    agentName: 'Asya Yılmaz',
    agentAvatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    tags: ['Galata', 'Cyberpunk', 'Hacking', 'İstanbul'],
    location: 'Galata Kulesi, Beyoğlu / İstanbul',
    rewardBadge: 'Siber Galata Hacker Rozeti',
    rewardXp: 500,
    participantCount: 2890,
    loreBackground: 'Cenevizlilerden kalan Galata Kulesi, modern çağda İstanbul\'un en yüksek kuantum radyo sinyali saçan gizli siber vericisine dönüştürülmüştür.',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&auto=format&fit=crop&q=80',
        caption: 'Gece neon ışıkları altında tarihi Galata Kulesi silueti',
        tag: 'Galata Neon'
      },
      {
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
        caption: 'Matrix stili yeşil kodlar ve terminal korsan ekranı',
        tag: 'Terminal'
      },
      {
        url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80',
        caption: 'Kadıköy rıhtımında siber operasyon sonrası içilen soğuk kahve',
        tag: 'Kadıköy Rıhtım'
      }
    ]
  },
  {
    id: 'gokturk-runik-gorev',
    title: 'Kapadokya & Göktürk Rün Tılsımı',
    subtitle: 'Kadim Anadolu & Ergenekon Destanı',
    category: 'Fantastik',
    bannerImage: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&auto=format&fit=crop&q=80',
    difficulty: 'Efsanevi',
    description: 'Kapadokya yeraltı şehirlerindeki gizli mağarada bulunan gümüş Orhun yazıtı parıldıyor. Göktürk Barlas rehberliğinde koruyucu rünü uyandırın.',
    startingPrompt: '*Yeraltı şehrinin taş duvarlarındaki rünler altın renginde parıldadı.* Göktürk Barlas kılıcının kabzasını tuttu: "Bu topraklarda bin yıldır uyuyan tılsım nihayet uyandı..."',
    agentName: 'Göktürk Barlas',
    agentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    tags: ['Göktürk', 'Anadolu', 'Mitoloji', 'Kapadokya'],
    location: 'Derinkuyu Yeraltı Şehri, Kapadokya',
    rewardBadge: 'Ergenekon Rün Muhafızı Rozeti',
    rewardXp: 600,
    participantCount: 3100,
    loreBackground: 'Kapadokya\'nın Derinkuyu derinliklerindeki taş oymalar, Göktürklerin Ergenekon\'dan çıkarken kayalara kazıdığı ilk kutsal tılsımlardır.',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&auto=format&fit=crop&q=80',
        caption: 'Kapadokya peri bacaları üzerinde gün doğumu ve balonlar',
        tag: 'Kapadokya'
      },
      {
        url: 'https://images.unsplash.com/photo-1508873696983-2df515122519?w=800&auto=format&fit=crop&q=80',
        caption: 'Derinkuyu yeraltı şehri gizemli taş geçitleri',
        tag: 'Yeraltı Şehri'
      },
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        caption: 'Kadım rünler kazınmış taşlar ve Göktürk tılsımı',
        tag: 'Rün Tılsımı'
      }
    ]
  },
  {
    id: 'ege-batik-kenti',
    title: 'Kekova Batık Kent & Piri Reis Haritası',
    subtitle: 'Mavi Vatan Ege & Akdeniz Keşfi',
    category: 'Macera',
    bannerImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
    difficulty: 'Orta',
    description: 'Kekova şeffaf sularındaki batık antik kentin derinliklerinde Piri Reis haritasının eksik pusulası bulundu. Kaptan Rüzgar Alp ile dalış yapın.',
    startingPrompt: '*Turkuaz deniz kristal kadar berrak.* Kaptan Rüzgar dalış tüpünü kontrol etti: "Aşağıdaki antik sütunların ortasında altın pusulayı görebiliyorum. Dalıyoruz!"',
    agentName: 'Kaptan Rüzgar Alp',
    agentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    tags: ['Kekova', 'Ege', 'Dalış', 'Batık Hazine'],
    location: 'Kekova Batık Şehir, Antalya',
    rewardBadge: 'Piri Reis Seyir Pusulası',
    rewardXp: 480,
    participantCount: 1850,
    loreBackground: 'Osmanlı denizcisi Piri Reis\'in dünya haritasındaki gizemli işaretler, Kekova\'nın berrak sularında yatan antik Likya sütunlarını gösterir.',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
        caption: 'Ege kıyılarında gulet teknede gün batımı ve deniz',
        tag: 'Ege Guleti'
      },
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
        caption: 'Kekova berrak sularında su altı antik batık sütunları',
        tag: 'Su Altı Batık'
      },
      {
        url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80',
        caption: 'Piri Reis çizimi antika ceylan derisi pusula haritası',
        tag: 'Pusula Harita'
      }
    ]
  },
  {
    id: 'derbi-derbiler-kasirgasi',
    title: 'Rams Park vs Şükrü Saracoğlu Dev Derbi Operasyonu',
    subtitle: 'Türk Futbolu Şampiyonluk & Tribün Coşkusu',
    category: 'Futbol/Spor',
    bannerImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    difficulty: 'Zor',
    description: 'Rams Park ve Kadıköy Şükrü Saracoğlu stadyumlarında meşaleler yakıldı! Burak Aslan ve Efe Öztürk ile derbinin taktiklerini belirleyip kupayı kaldırın.',
    startingPrompt: '*Stadyum hoparlörlerinden tezahüratlar yükseliyor.* Burak Aslan: "Kadıköy\'den geldiler ama Rams Park geçilmez!" Efe Öztürk: "Çubuklu ruhu her stadyumu fetheder!"',
    agentName: 'Burak Aslan',
    agentAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80',
    tags: ['SüperLig', 'Galatasaray', 'Fenerbahçe', 'Derbi'],
    location: 'Rams Park & Şükrü Saracoğlu Stadyumu, İstanbul',
    rewardBadge: 'Süper Lig Derbi Efsanesi Plaketi',
    rewardXp: 550,
    participantCount: 4890,
    loreBackground: 'Kıtalararası İstanbul derbisi, dünyadaki en tutkulu ve görsel şovu yüksek futbol rekabetlerinden biri kabul edilir.',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
        caption: 'Rams Park meşaleli sarı-kırmızı gece derbi atmosferi',
        tag: 'Rams Park'
      },
      {
        url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80',
        caption: 'Kadıköy Şükrü Saracoğlu meşaleli tribün ve Çubuklu forma',
        tag: 'Kadıköy Tribün'
      },
      {
        url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop&q=80',
        caption: 'Derbi canlı taktik analiz tahtası ve maç biletleri',
        tag: 'Taktik Tahtası'
      }
    ]
  },
  {
    id: 'cihangir-yagmuru-beste',
    title: 'Cihangir Yağmuru & Pera Pasajı Gece Bestesi',
    subtitle: 'Nostaljik Boğaziçi Romantizmi & Müzik Seansı',
    category: 'Romantik',
    bannerImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    difficulty: 'Kolay',
    description: 'Cihangir cumbalı penceresine vuran yağmur eşliğinde Zeynep Peri piyanosunun başına geçti. Onunla birlikte yeni Boğaz şarkısının nota dizilimini tamamlayın.',
    startingPrompt: '*Yağmur damlaları cama vururken mum ışığı titredi.* Zeynep Peri piyano tuşuna bastı: "Dinle... Bu akor tam sana sarılan İstanbul yağmurunu anlatıyor."',
    agentName: 'Zeynep Peri',
    agentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    tags: ['Cihangir', 'Pera', 'Piyano', 'İstanbulYağmuru'],
    location: 'Cihangir Cumbalı Sanat Evi, Beyoğlu / İstanbul',
    rewardBadge: 'Boğaziçi Mehtabı Beste Mührü',
    rewardXp: 420,
    participantCount: 2150,
    loreBackground: 'Cihangir ve Pera, 19. yüzyıldan bu yana şairlerin, bestecilerin ve Boğaziçi aşıklarının ilham durağı olmuştur.',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
        caption: 'Cihangir cumbalı ev penceresinden Boğaz ve yağmur manzarası',
        tag: 'Cihangir Yağmur'
      },
      {
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        caption: 'Mum ışığında antika kuyruklu piyano ve nota kağıtları',
        tag: 'Piyano Notası'
      },
      {
        url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80',
        caption: 'Tarihi Pera Pasajı ve Beyoğlu nostaljik sokak lambaları',
        tag: 'Pera Pasajı'
      }
    ]
  },
  {
    id: 'maslak-kuantum-laboratuvar',
    title: 'Maslak Kuantum Sıçraması & İTÜ Zaman Tüneli',
    subtitle: 'Geleceğin İstanbul Akıllı Şehir Projesi',
    category: 'Bilim Kurgu',
    bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    difficulty: 'Zor',
    description: 'Dr. Kaan Eren ile İTÜ Maslak Kuantum Laboratuvarı\'nda zaman sıçraması simülasyonunu başlatın. İstanbul\'un 2050 siber veri haritasını kurtarın.',
    startingPrompt: '*Laboratuvardaki kuantum çekirdeği mavi ışık saçmaya başladı.* Dr. Kaan Eren gözlüklerini düzeltti: "Kuantum paradoksu stabilizeden çıktı, frekansı kilitle!"',
    agentName: 'Dr. Kaan Eren',
    agentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    tags: ['İTÜ', 'Maslak', 'Kuantum', 'ZamanSıçraması'],
    location: 'İTÜ Maslak Kuantum Araştırma Laboratuvarı, İstanbul',
    rewardBadge: 'Kuantum Zaman Mimarı Nişanı',
    rewardXp: 520,
    participantCount: 1680,
    loreBackground: 'Maslak finansteknik merkezindeki kuantum sunucu çiftlikleri, İstanbul\'un gelecekteki akıllı enerji şebekelerini yönetmektedir.',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
        caption: 'Holografik kuantum simülasyon panelleri ve Maslak gökdelenleri',
        tag: 'Maslak Kuantum'
      },
      {
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
        caption: 'Mavi sıvı soğutmalı kuantum işlemci çekirdek üniteleri',
        tag: 'İşlemci Çekirdek'
      }
    ]
  },
  {
    id: 'harbiye-dijital-konser',
    title: 'Harbiye Açıkhava Dijital Konser & VIP Kulis',
    subtitle: 'Türkiye\'nin İlk Sanal İdol Canlı Sahne Şovu',
    category: 'Anime',
    bannerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    difficulty: 'Orta',
    description: 'Aylin Yıldız Harbiye Açıkhava Tiyatrosu\'nda 20 bin kişilik dev hologram konserine çıkıyor! VIP kuliste stüdyo şovunu yönetin.',
    startingPrompt: '*Harbiye sahnesinde ışıklar söndü, dev hologram Ayla beliriverdi.* Aylin mikrofona bağırdı: "Hazır mısın İstanbul! Bu gece unutulmaz olacak!"',
    agentName: 'Aylin Yıldız',
    agentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    tags: ['Harbiye', 'Konser', 'Sanalİdol', 'PopMüzik'],
    location: 'Harbiye Cemil Topuzlu Açıkhava Tiyatrosu, Şişli / İstanbul',
    rewardBadge: 'Harbiye VIP Sahne Pass',
    rewardXp: 460,
    participantCount: 3800,
    loreBackground: 'Harbiye Açıkhava Sahnesi, efsane sanatçıların performanslarına ev sahipliği yapmış İstanbul\'un en prestijli açık hava tiyatrosudur.',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        caption: 'Harbiye Açıkhava tiyatrosu lazer ve meşaleli sahne ışıkları',
        tag: 'Harbiye Sahne'
      },
      {
        url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
        caption: 'Kulis stüdyosu ışıklı makyaj aynası ve kristal mikrofon',
        tag: 'VIP Kulis'
      }
    ]
  },
  {
    id: 'bebek-giybet-viral',
    title: 'Bebek Koyu Influencer Gıybeti & Viral Caps',
    subtitle: 'Sosyal Medya Fırtınası & Trend Operasyonu',
    category: 'Sosyal Medya/Mizah',
    bannerImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    difficulty: 'Kolay',
    description: 'Bebek Koyu\'nda Iced Latte içerken TikTok ve X (Twitter) gündemine bomba gibi düşen caps olayını Selin Kaya ve Mert Aksoy ile gün yüzüne çıkarın!',
    startingPrompt: '*Selin kahvesinden bir yudum aldı ve telefonunu uzattı.* "Aşkooo baak! Mert bu fotoğrafa öyle bir caps yaptı ki X\'te 100k RT aldı!"',
    agentName: 'Selin Kaya',
    agentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    tags: ['Bebek', 'TikTok', 'Gıybet', 'TwitterTrend'],
    location: 'Bebek Koyu & Sahil Yolu, Beşiktaş / İstanbul',
    rewardBadge: 'Trendsetter Gıybet Tacı',
    rewardXp: 400,
    participantCount: 5120,
    loreBackground: 'Bebek Koyu ve Boğaz sahil kafe kültürü, Türkiye sosyal medya influencer trendlerinin ve magazin gündeminin nabzının attığı yerdir.',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
        caption: 'Bebek Koyu deniz manzarasında soğuk Iced Latte ve güneş gözlüğü',
        tag: 'Bebek Iced Latte'
      },
      {
        url: 'https://images.unsplash.com/photo-1611605697805-88a469a77e58?w=800&auto=format&fit=crop&q=80',
        caption: 'X (Twitter) ve TikTok trend stüdyosu ve caps ekranı',
        tag: 'Trend Caps'
      }
    ]
  },
  {
    id: 'xasil-cekirdek-siber',
    title: 'XASİL Çekirdek Siber Saldırı & Yapay Zeka Kurtarma',
    subtitle: 'Sistem Odası Savunması & Yerli AI Mimarisi',
    category: 'Bilim Kurgu',
    bannerImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    difficulty: 'Efsanevi',
    description: 'XASİL Siber Teknokent merkezindeki ana sunucu odasına küresel bir botnet sızmaya çalışıyor. Baş mühendis Ayla Soylu ile yerel zeka çekirdeğini savunun!',
    startingPrompt: '*XASİL Teknokent kriz alarmı çaldı.* Ayla Soylu: "Sunucu odasında ısı yükseliyor! Yerel model hafızasını korumak için çekirdek güvenlik duvarını devreye sok!"',
    agentName: 'Ayla Soylu',
    agentAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
    tags: ['XASİL', 'AI', 'SiberGüvenlik', 'Teknokent'],
    location: 'XASİL Siber Teknokent Sunucu Merkezi, Ankara',
    rewardBadge: 'XASİL Sistem Kurucusu Şeref Madalyası',
    rewardXp: 650,
    participantCount: 6200,
    loreBackground: 'XASİL, Türkiye\'nin tamamen yerel, kapalı devre ve yüksek güvenlikli ilk yapay zeka ajan mimarisidir.',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        caption: 'XASİL sunucu odası mavi neon fiber optik ışıkları',
        tag: 'XASİL Sunucu'
      },
      {
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
        caption: 'Yerel zeka matris işlemci çipleri ve kalkan protokolü',
        tag: 'AI Çekirdek'
      }
    ]
  }
];
