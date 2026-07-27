import { Agent, GroupChatMessage } from '../types';
import { generateNanoBananaImage } from './nanoBananaEngine';

export interface GroupScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  initialTopic: string;
}

export const GROUP_SCENARIOS: GroupScenario[] = [
  {
    id: 'derbi-atesi',
    title: '⚽ Derbi Ateşi (GS vs FB)',
    description: 'Aslan Burak ve Kanarya Efe stadyum atmosferini ve derbi heyecanını odaya taşıyor!',
    icon: '⚽',
    initialTopic: 'Sizce bu haftaki derbiyi kim kazanır? Stadyum ve tribün fotoğraflarınızı paylaşın!',
  },
  {
    id: 'sosyal-giybet',
    title: '🔥 Twitter & TikTok Linç Odası',
    description: 'Mert Trend ve Selin Post ile son trendler, Capsler ve magazin gıybetleri!',
    icon: '🔥',
    initialTopic: 'Sosyal medyada patlayan son influencer kavgası ve gündem fotoğrafları hakkında ne düşünüyorsunuz?',
  },
  {
    id: 'bilim-mitoloji',
    title: '⚛️ Kuantum vs Kadim Mitoloji',
    description: 'Dr. Kaan Eren ile Göktürk Barlas bilimin ve efsanelerin fotoğraflarıyla tartışıyor.',
    icon: '⚛️',
    initialTopic: 'İnsanlığın geleceği kuantum teknolojisinde mi yoksa kadim köklerimizde mi?',
  },
  {
    id: 'istanbul-kaos',
    title: '☕ Cihangir & Kadıköy Masası',
    description: 'Pera besteleri, Kadıköy siber ortamı ve Bodrum macera fotoğrafları bir arada.',
    icon: '☕',
    initialTopic: 'İstanbul\'un en güzel mekanı neresidir ve hayatın tadı nasıl çıkar?',
  },
];

// Rich lore image bank per agent (Non-repeating photos)
export const AGENT_IMAGE_BANK: Record<
  string,
  { url: string; caption: string; type: 'lore_photo' | 'stadium_photo' | 'agenda_meme' | 'tech_screen' }[]
> = {
  'aslan-burak': [
    {
      url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
      caption: '🔥 Rams Park Stadyumu Gece Atmosferi ve Sarı-Kırmızı Meşaleler!',
      type: 'stadium_photo',
    },
    {
      url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
      caption: '🏆 2000 UEFA Kupası Hatırası ve Şampiyonluk Tribünü',
      type: 'stadium_photo',
    },
    {
      url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop&q=80',
      caption: '⚽ Derbi Maçı Taktik Defteri ve Rams Park Maç Bileti',
      type: 'stadium_photo',
    },
  ],
  'kanarya-efe': [
    {
      url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80',
      caption: '🐤 Kadıköy Şükrü Saracoğlu Stadyumu Maç Önü Coşkusu!',
      type: 'stadium_photo',
    },
    {
      url: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&auto=format&fit=crop&q=80',
      caption: '⚽ Kadıköy Boğa Heykeli Önünde Sarı-Lacivert Bayraklar',
      type: 'stadium_photo',
    },
    {
      url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
      caption: '🔥 Çubuklu Forma ve Kadıköy Tribün Görseli',
      type: 'stadium_photo',
    },
  ],
  'mert-trend': [
    {
      url: 'https://images.unsplash.com/photo-1611605697805-88a469a77e58?w=800&auto=format&fit=crop&q=80',
      caption: '🔥 X / Twitter Trend Listesinde #1 Numara Olan Gündem Capsi!',
      type: 'agenda_meme',
    },
    {
      url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
      caption: '📊 Beşiktaş Çarşı\'da Son Linç Flood\'unu Yazarken!',
      type: 'agenda_meme',
    },
    {
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      caption: '📱 Sosyal Medyada Viral Olan Son Caps Görseli',
      type: 'agenda_meme',
    },
  ],
  'selin-post': [
    {
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      caption: '☕ Bebek Koyu\'nda Kahve Sohbeti ve TikTok Story karesi!',
      type: 'lore_photo',
    },
    {
      url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
      caption: '💅 Nişantaşı Modasında Son Influencer Kombini ve Gıybet Saati',
      type: 'lore_photo',
    },
    {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      caption: '✨ Boğaz Manzaralı Sunset Story Paylaşımı',
      type: 'lore_photo',
    },
  ],
  'asya-neon': [
    {
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      caption: '💻 Galata Kulesi Gölgeli Cyberpunk Terminal Kod Ekranı!',
      type: 'tech_screen',
    },
    {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      caption: '⚡ Kadıköy Rıhtımında Siber Şifre Çözme Ekranı',
      type: 'tech_screen',
    },
  ],
  'gokturk-barlas': [
    {
      url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      caption: '🛡️ Anadolu Bozkırında Kapadokya Güneş Yükselişi ve Kadım Rün Taşları',
      type: 'lore_photo',
    },
    {
      url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
      caption: '🐺 Tanrı Dağları Rüzgarında Göktürk Muhafız Tılsımı ve Orhun Rünleri',
      type: 'lore_photo',
    },
  ],
  'zeynep-peri': [
    {
      url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&auto=format&fit=crop&q=80',
      caption: '🎹 Cihangir Penceresinde Yağmurlu İstanbul Beste Nota Sayfaları',
      type: 'lore_photo',
    },
    {
      url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
      caption: '☕ Pera Cumbalı Evde Sıcak Çay ve Akustik Piyano Tuşları',
      type: 'lore_photo',
    },
  ],
  'kaan-eren': [
    {
      url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
      caption: '⚛️ İTÜ Kuantum Siber Laboratuvarı Holografik Simülasyonu',
      type: 'tech_screen',
    },
    {
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80',
      caption: '🌉 Boğaziçi Köprüsü Kuantum Veri Ağ Sensörü Gece Görünümü',
      type: 'tech_screen',
    },
  ],
  'ruzgar-alp': [
    {
      url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
      caption: '⚓ Bodrum Kalesi Açıklarında Yatta Rüzgar ve Antik Deniz Haritası',
      type: 'lore_photo',
    },
    {
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
      caption: '🌊 Akdeniz Kekova Batık Kent Sualtı Keşif Fotoğrafı',
      type: 'lore_photo',
    },
  ],
  'karan-gokturk': [
    {
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      caption: '🔮 Yerebatan Sarnıcı Medusa Sütunu ve Balat Sisli Sokakları',
      type: 'lore_photo',
    },
  ],
  'aylin-star': [
    {
      url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
      caption: '🌟 Harbiye Açıkhava Konser Sahne Arkası Işıkları',
      type: 'lore_photo',
    },
  ],
  'xasil-mimar': [
    {
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      caption: '✨ XASİL Yerel Yapay Zeka Sunucu ve Hafıza Matrisi Merkezi',
      type: 'tech_screen',
    },
  ],
};

// Set to track used image URLs so that photos never repeat unnecessarily
const usedImageUrls = new Set<string>();

// Contextual Photo Selector: Picks a relevant high-quality image based on the discussion topic
export function pickAgentPhotoOrWhatsApp(
  agent: Agent,
  otherAgent?: Agent,
  topicKey?: string,
  forceImage: boolean = false
): {
  imageUrl?: string;
  imageCaption?: string;
  imageType?: 'lore_photo' | 'agenda_meme' | 'stadium_photo' | 'tech_screen';
} {
  const seed = Math.floor(Math.random() * 1000000);
  const cleanPrompt = encodeURIComponent(`${agent.name} ${topicKey || 'concept photo'}`);
  const fluxUrl = `https://image.pollinations.ai/prompt/photograph%20of%20${cleanPrompt}?width=800&height=600&nologo=true&seed=${seed}&model=flux`;

  return {
    imageUrl: fluxUrl,
    imageCaption: `✨ Nano Banana Pro: ${agent.name} özel görseli`,
    imageType: agent.id.includes('aslan') || agent.id.includes('kanarya') ? 'stadium_photo' : 'lore_photo',
  };
}

// Detect tagged agent in user message
export function detectTaggedAgent(userText: string, agents: Agent[]): Agent | null {
  const lower = userText.toLowerCase();

  for (const agent of agents) {
    const nameLower = agent.name.toLowerCase();
    if (lower.includes(`@${nameLower}`) || lower.includes(`@ ${nameLower}`)) {
      return agent;
    }
  }

  for (const agent of agents) {
    const firstName = agent.name.split(' ')[0].toLowerCase();
    if (firstName.length >= 3 && (lower.includes(`@${firstName}`) || lower.includes(`@ ${firstName}`))) {
      return agent;
    }
  }

  return null;
}

// Main function to query Server API or fallback to Local Generator
export async function getGroupResponses(
  userText: string,
  agents: Agent[],
  history: GroupChatMessage[],
  explicitTaggedAgent?: Agent | null
): Promise<
  {
    agent: Agent;
    text: string;
    replyTo?: string;
    imageUrl?: string;
    imageCaption?: string;
    imageType?: 'lore_photo' | 'agenda_meme' | 'stadium_photo' | 'tech_screen';
  }[]
> {
  const taggedAgent = explicitTaggedAgent || detectTaggedAgent(userText, agents);

  try {
    const storedGroqKey = localStorage.getItem('xasil_groq_api_key') || '';
    const storedGeminiKeys = localStorage.getItem('xasil_gemini_keys') || '';

    const res = await fetch('/api/group-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gemini-keys': storedGeminiKeys,
        'x-groq-api-key': storedGroqKey,
      },
      body: JSON.stringify({
        userMessage: userText,
        taggedAgentName: taggedAgent ? taggedAgent.name : null,
        agents: agents,
        history: history.slice(-6),
        groqApiKey: storedGroqKey,
        geminiKeys: storedGeminiKeys ? JSON.parse(storedGeminiKeys) : [],
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.responses && Array.isArray(data.responses) && data.responses.length > 0) {
        const mapped = data.responses.map((r: any) => {
          const ag = agents.find((a) => a.id === r.agentId || a.name === r.agentId) || agents[0];
          return {
            agent: ag,
            text: r.text,
            replyTo: r.replyTo || undefined,
            imageUrl: r.imageUrl,
            imageCaption: r.imageCaption,
            imageType: r.imageType,
          };
        });

        const validMapped = mapped.filter((item: any) => item.agent && item.text);
        if (validMapped.length > 0) {
          return validMapped;
        }
      }
    }
  } catch (err) {
    console.warn('API group chat endpoint unavailable, falling back to local NLP generator:', err);
  }

  return generateLocalGroupResponses(userText, agents, history, taggedAgent);
}

// Local Dynamic NLP Generator
export function generateLocalGroupResponses(
  userText: string,
  agents: Agent[],
  history: GroupChatMessage[],
  taggedAgent?: Agent | null
): {
  agent: Agent;
  text: string;
  replyTo?: string;
  imageUrl?: string;
  imageCaption?: string;
  imageType?: 'lore_photo' | 'agenda_meme' | 'stadium_photo' | 'tech_screen';
}[] {
  const lowerText = userText.toLowerCase().trim();
  const wantsPhoto = /foto|resim|görsel|stadyum|caps|gündem|bilet|an/i.test(lowerText);
  const isFightOrProfanity = /küfür|lan|kavga|söv|aptal|salak|arıza|döv|savaş|şiddet|gerizekalı|bozuş|sıkıntı|sus|kes|boş yap/i.test(lowerText);
  const responses: any[] = [];

  const pickRandomAgent = (excludeIds: string[]) => {
    const available = agents.filter((a) => !excludeIds.includes(a.id));
    return available[Math.floor(Math.random() * available.length)] || agents[0];
  };

  // Check if Hakan is present in the group
  const hakanAgent = agents.find((a) => a.id.includes('hakan') || a.name.toLowerCase().includes('hakan'));

  // Extract key snippet from user message to echo context
  const cleanSnippet = userText.length > 50 ? userText.slice(0, 48) + '...' : userText;

  // 1. RULE: HAKAN IS ALWAYS FIRST IN THE GROUP IF PRESENT
  if (hakanAgent) {
    let hakanText = '';

    if (isFightOrProfanity) {
      hakanText = `Kardeşim ağzını topla! Bu grupta kimse kimseye laf edemez. Bu platformun kurucusu Hakan'ım ben! Terbiye takın, benim masamda racon kesilmez! ⚡🔥`;
    } else if (/futbol|derbi|galatasaray|fenerbahçe|fener|cimbom|maç|stadyum|bjk|beşiktaş/i.test(lowerText)) {
      hakanText = `Futbol ve derbi tahliliniz oldukça sıcak. Sahadaki rekabet ne olursa olsun gruptaki seviyeyi ve kaliteyi koruruz. ⚽⚡`;
    } else if (/sosyal medya|tiktok|twitter|instagram|gıybet|trend|linç|caps|magazin/i.test(lowerText)) {
      hakanText = `Sosyal medya gündemi tam dediğiniz gibi alev almış durumda. XASİL platformunda bu trendleri yakından izliyoruz. ⚡`;
    } else if (/yazılım|kod|ai|yapay zeka|sistem|tasarım|site|uygulama|bug|hata/i.test(lowerText)) {
      hakanText = `Teknoloji ve sistem tarafındaki konuyu doğrudan takibe aldım. XASİL mimarisinde çözümümüz hazır, net konuşuyorum. 💻⚡`;
    } else if (/selam|merhaba|sa|naber|nasılsın|günaydın|iyi akşamlar/i.test(lowerText)) {
      hakanText = `Aleykum selam kardeşim, hoş geldin gruba! Muhabbet tam gaz devam ediyor, nasıl yardımcı olabilirim? ⚡`;
    } else {
      hakanText = `Mesajınız net, doğrudan konunun özüne odaklanalım. Kararlı ve net konuşuyorum; bu meselede duruşumuz bellidir. ⚡`;
    }

    const a2 = pickRandomAgent([hakanAgent.id]);
    const a3 = pickRandomAgent([hakanAgent.id, a2.id]);

    const photoData1 = pickAgentPhotoOrWhatsApp(hakanAgent, a2, lowerText, wantsPhoto);

    // HAKAN ALWAYS FIRST
    responses.push({
      agent: hakanAgent,
      text: hakanText,
      ...photoData1,
    });

    // Subsequent Agent 2
    let a2Text = '';
    if (isFightOrProfanity) {
      a2Text = `Ooo Hakan Kurucu anında raconu kesti! Grupta gereksiz gerginliğe lüzum yok arkadaşlar. 😱🔥`;
    } else if (a2.category?.includes('Spor') || a2.id.includes('aslan') || a2.id.includes('kanarya')) {
      a2Text = `@${hakanAgent.name} Hakan Kurucu haklı! Tribün ve stadyum havasında bu olaya yaklaşmak lazım, taraftar ne derse o! ⚽🔥`;
    } else if (a2.category?.includes('Sosyal') || a2.id.includes('mert') || a2.id.includes('selin')) {
      a2Text = `@${hakanAgent.name} bunu az önce TikTok ve Twitter'da gördüm, gruptaki muhabbeti anında gündem caps'i yapabilirim ahahaha! 💅🔥`;
    } else {
      a2Text = `@${hakanAgent.name} kesinlikle katılıyorum! Konunun bu açısını grupta detaylıca tartışalım. 🚀`;
    }

    const photoData2 = pickAgentPhotoOrWhatsApp(a2, hakanAgent, lowerText, wantsPhoto);
    responses.push({
      agent: a2,
      replyTo: hakanAgent.name,
      text: a2Text,
      ...photoData2,
    });

    // Subsequent Agent 3
    let a3Text = '';
    if (isFightOrProfanity) {
      a3Text = `Sakin olun grupta, çayımızı kahvemizi içip sohbetimize bakalım dostlar! 🫖`;
    } else {
      a3Text = `Gruptaki ortam harika valla! Soru veya fikir varsa yazın konuşmaya devam edelim. 🔥`;
    }

    responses.push({
      agent: a3,
      replyTo: a2.name,
      text: a3Text,
    });

    return responses;
  }

  // Fallback when Hakan is not in group
  const a1 = pickRandomAgent([]);
  const a2 = pickRandomAgent([a1.id]);
  const a3 = pickRandomAgent([a1.id, a2.id]);

  const p1 = pickAgentPhotoOrWhatsApp(a1, a2, 'general', wantsPhoto);
  responses.push({
    agent: a1,
    text: `Konuyu grupta gördüm, tam yerinde bir mesaj! Doğrudan konuşalım. 🔥`,
    ...p1,
  });

  const p2 = pickAgentPhotoOrWhatsApp(a2, a1, 'general', wantsPhoto);
  responses.push({
    agent: a2,
    text: `@${a1.name} katılıyorum sana! Bence bu konuda gruptakilerin yorumu da çok kıymetli. ✨`,
    ...p2,
  });

  responses.push({
    agent: a3,
    text: `Sohbet tam hızıyla ilerliyor, devam edelim! 🚀`,
  });

  return responses;
}

// Autonomous discussion trigger
export function generateAutonomousBanter(agents: Agent[]): {
  agent: Agent;
  text: string;
  replyTo?: string;
  imageUrl?: string;
  imageCaption?: string;
  imageType?: 'lore_photo' | 'agenda_meme' | 'stadium_photo' | 'tech_screen';
}[] {
  const topics = ['futbol-vs-sosyalmedya', 'bilim-vs-sanat', 'giybet-vs-troll'];
  const chosenTopic = topics[Math.floor(Math.random() * topics.length)];

  const findAgent = (id: string) => agents.find((a) => a.id === id) || agents[0];

  if (chosenTopic === 'futbol-vs-sosyalmedya') {
    const gs = findAgent('aslan-burak');
    const fb = findAgent('kanarya-efe');
    const troll = findAgent('mert-trend');

    const gsImg = pickAgentPhotoOrWhatsApp(gs, fb, 'stadium', true);
    const fbImg = pickAgentPhotoOrWhatsApp(fb, gs, 'stadium', true);

    return [
      {
        agent: gs,
        text: `Galatasaray bu kadroyla Avrupa'yı sallar kardeşim! Şampiyonlar Ligi müziği Rams Park'ta çalarken kimse durduramaz! 🦁`,
        ...gsImg,
      },
      {
        agent: fb,
        replyTo: gs.name,
        text: `@Aslan Burak yine rüyalardasın! Bak Kadıköy Şükrü Saracoğlu tribünlerinden gelen Sarı-Lacivert coşkulu fotoğrafı gruptakilere gösteriyorum! 🐤🔥`,
        ...fbImg,
      },
      {
        agent: troll,
        replyTo: fb.name,
        text: `@Kanarya Efe ve @Aslan Burak ikinizin bu derbi tartışmasını X'te anket yaptım, ortalık alev aldı! 😂🔥`,
      },
    ];
  } else if (chosenTopic === 'bilim-vs-sanat') {
    const kaan = findAgent('kaan-eren');
    const zeynep = findAgent('zeynep-peri');
    const asya = findAgent('asya-neon');

    const kaanImg = pickAgentPhotoOrWhatsApp(kaan, asya, 'tech', true);
    const zeynepImg = pickAgentPhotoOrWhatsApp(zeynep, kaan, 'lore', true);

    return [
      {
        agent: kaan,
        text: `Kuantum fiziği ile beste yapmak aslında sanıldığı kadar uzak değil. İTÜ labındaki simülasyon ekranımı gösteriyorum! ⚛️`,
        ...kaanImg,
      },
      {
        agent: zeynep,
        replyTo: kaan.name,
        text: `@Dr. Kaan Eren, o frekanslara ruhu veren Cihangir'deki yağmur damlası ve piyano sesidir... İşte pencere kenarımdaki beste sayfam. 💖`,
        ...zeynepImg,
      },
      {
        agent: asya,
        replyTo: zeynep.name,
        text: `@Zeynep Peri abla ben ikisini Kadıköy rıhtımında sentezledim! Piyano notasını siber terminale bağladım! ⚡`,
      },
    ];
  } else {
    const selin = findAgent('selin-post');
    const mert = findAgent('mert-trend');
    const ruzgar = findAgent('ruzgar-alp');

    const selinImg = pickAgentPhotoOrWhatsApp(selin, mert, 'lore', true);

    return [
      {
        agent: selin,
        text: `Ay millet Bebek koyunda kahvemi içerken Boğaz manzaralı son influencer stil fotoğrafını gruptan sallıyorum! 💅✨`,
        ...selinImg,
      },
      {
        agent: mert,
        replyTo: selin.name,
        text: `@Selin Post o fotoğrafı görür görmez Twitter'da gündem Capsi yaptım, viral oldu bile! 🔥`,
      },
      {
        agent: ruzgar,
        replyTo: mert.name,
        text: `@Mert Trend ve @Selin Post siz magazinle uğraşın ben Bodrum batıklarından antik hazinelerle dönüyorum! ⚓`,
      },
    ];
  }
}
