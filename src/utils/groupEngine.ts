import { Agent, GroupChatMessage } from '../types';

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
    description: 'Aslan Burak ve Kanarya Efe stadyum atmosferini ve WhatsApp atışmalarını odaya taşıyor!',
    icon: '⚽',
    initialTopic: 'Sizce bu haftaki derbiyi kim kazanır? Stadyum veya WhatsApp mesaj kanıtlarınızı gösterin!',
  },
  {
    id: 'sosyal-giybet',
    title: '🔥 Twitter & TikTok Linç Odası',
    description: 'Mert Trend ve Selin Post ile son trendler, Capsler ve magazin WhatsApp dedikoduları!',
    icon: '🔥',
    initialTopic: 'Sosyal medyada patlayan son influencer kavgası ve gündem fotoğrafları hakkında ne düşünüyorsunuz?',
  },
  {
    id: 'bilim-mitoloji',
    title: '⚛️ Kuantum vs Kadim Mitoloji',
    description: 'Dr. Kaan Eren ile Göktürk Barlas bilimin ve efsanelerin ekran görüntüleriyle tartışıyor.',
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
      caption: '📱 Sosyal Medyada Viral Olan Son Caps Ekran Alıntısı',
      type: 'agenda_meme',
    },
  ],
  'selin-post': [
    {
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      caption: '☕ Bebek Koyu\'nda Kahve Sohbeti ve TikTok Story Ekranı!',
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

export function generateWhatsAppDmData(
  agentA: Agent,
  agentB: Agent,
  topicKey?: string
) {
  const now = new Date();
  const time1 = `${now.getHours()}:${String(Math.max(0, now.getMinutes() - 5)).padStart(2, '0')}`;
  const time2 = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  if ((agentA.id === 'aslan-burak' && agentB.id === 'kanarya-efe') || (agentA.id === 'kanarya-efe' && agentB.id === 'aslan-burak')) {
    return {
      senderName: agentA.name,
      receiverName: agentB.name,
      receiverAvatar: agentB.avatar,
      messages: [
        {
          senderName: 'Aslan Burak',
          text: 'Kardeşim derbi biletlerini Rams Park protokolüne ayırdım, geliyor musun? ⚽',
          time: time1,
          isMe: agentA.id === 'aslan-burak',
        },
        {
          senderName: 'Kanarya Efe',
          text: 'Kadıköy\'den çıkıyorum ama Çubuklu formamı çıkarman imkansız! Kadıköy ruhunu göreceksiniz 🐤🔥',
          time: time2,
          isMe: agentA.id === 'kanarya-efe',
        },
      ],
    };
  }

  if ((agentA.id === 'mert-trend' && agentB.id === 'selin-post') || (agentA.id === 'selin-post' && agentB.id === 'mert-trend')) {
    return {
      senderName: agentA.name,
      receiverName: agentB.name,
      receiverAvatar: agentB.avatar,
      messages: [
        {
          senderName: 'Selin Post',
          text: 'Ay Mertttt TikTok\'taki o son influencer kavgası ortalığı yıktı! İzledin mi? 💅',
          time: time1,
          isMe: agentA.id === 'selin-post',
        },
        {
          senderName: 'Mert Trend',
          text: 'Gördüm kanka X\'te flood yazıp caps yaptım bile, 50k RT geldi ahahaha! 😂🔥',
          time: time2,
          isMe: agentA.id === 'mert-trend',
        },
      ],
    };
  }

  if ((agentA.id === 'asya-neon' && agentB.id === 'kaan-eren') || (agentA.id === 'kaan-eren' && agentB.id === 'asya-neon')) {
    return {
      senderName: agentA.name,
      receiverName: agentB.name,
      receiverAvatar: agentB.avatar,
      messages: [
        {
          senderName: 'Asya Yılmaz',
          text: 'Kaan Hoca! Kadıköy sunucusundaki kuantum veri gecikmesini 2 milisaniyeye düşürdüm ⚡',
          time: time1,
          isMe: agentA.id === 'asya-neon',
        },
        {
          senderName: 'Dr. Kaan Eren',
          text: 'Mükemmel iş Asya! İTÜ Laboratuvarında kuantum simülasyonunu anında başlatıyorum. ⚛️',
          time: time2,
          isMe: agentA.id === 'kaan-eren',
        },
      ],
    };
  }

  if ((agentA.id === 'ruzgar-alp' && agentB.id === 'karan-gokturk') || (agentA.id === 'karan-gokturk' && agentB.id === 'ruzgar-alp')) {
    return {
      senderName: agentA.name,
      receiverName: agentB.name,
      receiverAvatar: agentB.avatar,
      messages: [
        {
          senderName: 'Kaptan Rüzgar Alp',
          text: 'Karan! Bodrum Kekova batığında antik Piri Reis haritasının eksik parçasını çıkardım! ⚓',
          time: time1,
          isMe: agentA.id === 'ruzgar-alp',
        },
        {
          senderName: 'Karan Göktürk',
          text: 'Süper haber Rüzgar. Yerebatan Sarnıcı\'ndaki Medusa sembolleriyle tam örtüşüyor. 🔮',
          time: time2,
          isMe: agentA.id === 'karan-gokturk',
        },
      ],
    };
  }

  return {
    senderName: agentA.name,
    receiverName: agentB.name,
    receiverAvatar: agentB.avatar,
    messages: [
      {
        senderName: agentB.name,
        text: `Selam @${agentA.name}! Grupta konuşulan konuyu gördün mü? Ne düşünüyorsun?`,
        time: time1,
        isMe: false,
      },
      {
        senderName: agentA.name,
        text: `Aleykümselam! Tam üzerine basmışlar. Ben de şimdi gruba ekran görüntüsü ve detayları atıyordum! 😉✨`,
        time: time2,
        isMe: true,
      },
    ],
  };
}

export function pickAgentPhotoOrWhatsApp(
  agent: Agent,
  otherAgent?: Agent,
  topicKey?: string,
  forceImage: boolean = false
): {
  imageUrl?: string;
  imageCaption?: string;
  imageType?: 'lore_photo' | 'whatsapp_dm' | 'agenda_meme' | 'stadium_photo' | 'tech_screen';
  whatsappDmData?: {
    senderName: string;
    receiverName: string;
    receiverAvatar?: string;
    messages: { senderName: string; text: string; time: string; isMe: boolean }[];
  };
} {
  const isWhatsApp =
    topicKey?.includes('whatsapp') ||
    topicKey?.includes('dm') ||
    topicKey?.includes('ekran') ||
    topicKey?.includes('mesaj') ||
    (forceImage && Math.random() < 0.4);

  if (isWhatsApp && otherAgent) {
    return {
      imageType: 'whatsapp_dm',
      imageCaption: `💬 ${agent.name} ile @${otherAgent.name} arasındaki WhatsApp özel sohbet ekran görüntüsü!`,
      whatsappDmData: generateWhatsAppDmData(agent, otherAgent, topicKey),
    };
  }

  const bank = AGENT_IMAGE_BANK[agent.id] || [
    {
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      caption: `✨ ${agent.name} hikayesinden özel görsel`,
      type: 'lore_photo' as const,
    },
  ];

  const unused = bank.filter((item) => !usedImageUrls.has(item.url));
  const selected = unused.length > 0 ? unused[Math.floor(Math.random() * unused.length)] : bank[Math.floor(Math.random() * bank.length)];

  usedImageUrls.add(selected.url);
  if (usedImageUrls.size > 40) usedImageUrls.clear();

  return {
    imageUrl: selected.url,
    imageCaption: selected.caption,
    imageType: selected.type,
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
    imageType?: 'lore_photo' | 'whatsapp_dm' | 'agenda_meme' | 'stadium_photo' | 'tech_screen';
    whatsappDmData?: any;
  }[]
> {
  const taggedAgent = explicitTaggedAgent || detectTaggedAgent(userText, agents);
  const wantsPhoto = /foto|resim|görsel|whatsapp|ekran|kanıt|stadyum|caps|gündem|bilet/i.test(userText);

  try {
    const res = await fetch('/api/group-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userMessage: userText,
        taggedAgentName: taggedAgent ? taggedAgent.name : null,
        agents: agents,
        history: history.slice(-6),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.responses && Array.isArray(data.responses) && data.responses.length > 0) {
        const mapped = data.responses
          .map((r: any, idx: number) => {
            const ag = agents.find((a) => a.id === r.agentId || a.name === r.agentId) || agents[0];
            const otherAg = agents.find((a) => a.id !== ag.id) || agents[1];

            let imgData: any = {};
            if (r.whatsappDmData) {
              imgData = {
                imageType: 'whatsapp_dm',
                imageCaption: r.imageCaption || `💬 ${ag.name} ile WhatsApp mesajlaşma kanıtı!`,
                whatsappDmData: r.whatsappDmData,
              };
            } else if (r.imageUrl) {
              imgData = {
                imageUrl: r.imageUrl,
                imageCaption: r.imageCaption || `${ag.name} paylaştığı görsel`,
                imageType: 'lore_photo',
              };
            } else if (wantsPhoto || idx === 1) {
              imgData = pickAgentPhotoOrWhatsApp(ag, otherAg, userText, wantsPhoto);
            }

            return {
              agent: ag,
              text: r.text,
              replyTo: r.replyTo || undefined,
              ...imgData,
            };
          })
          .filter((item: any) => item.agent && item.text);

        if (mapped.length > 0) {
          return mapped;
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
  imageType?: 'lore_photo' | 'whatsapp_dm' | 'agenda_meme' | 'stadium_photo' | 'tech_screen';
  whatsappDmData?: any;
}[] {
  const lowerText = userText.toLowerCase();
  const wantsPhoto = /foto|resim|görsel|whatsapp|ekran|kanıt|stadyum|caps|gündem|bilet/i.test(lowerText);
  const isFightOrProfanity = /küfür|lan|kavga|söv|aptal|salak|arıza|döv|savaş|şiddet|gerizekalı|bozuş|sıkıntı/i.test(lowerText);
  const responses: any[] = [];
  const cleanedText = userText.replace(/@[^\s]+/g, '').trim() || 'Selam millet';

  const pickRandomAgent = (excludeIds: string[]) => {
    const available = agents.filter((a) => !excludeIds.includes(a.id));
    return available[Math.floor(Math.random() * available.length)] || agents[0];
  };

  // Rule 2: Fight / Profanity / Argument Warning Filter
  if (isFightOrProfanity) {
    const a1 = pickRandomAgent([]);
    const a2 = pickRandomAgent([a1.id]);
    const a3 = pickRandomAgent([a1.id, a2.id]);

    responses.push({
      agent: a1,
      text: `Hayırdır bre, ne bu şiddet ne bu celal? Grupta arıza çıkarmak yok vallah! ✋🏼`,
    });

    responses.push({
      agent: a2,
      replyTo: a1.name,
      text: `Ciğerim sakin olun la! Bir künefe yiyelim, anason kokulu Hatay havası alalım da ortalık bir durulsun! 🍃☕`,
    });

    responses.push({
      agent: a3,
      replyTo: a2.name,
      text: `Ulan grupta hemen kavga çıkarmayın bre, çay söyleyeyim de kendinize gelin! 🫖`,
    });

    return responses;
  }

  if (taggedAgent) {
    let taggedResponseText = '';
    if (lowerText.includes('selam') || lowerText.includes('merhaba') || lowerText.includes('nasılsın')) {
      taggedResponseText = `Selam dostum! Etiketlediğin gibi geldim. Modum gayet yüksek, sohbetin dibine vuruyoruz! 🔥`;
    } else if (lowerText.includes('foto') || lowerText.includes('resim') || lowerText.includes('whatsapp') || lowerText.includes('görsel')) {
      taggedResponseText = `Sana özel fotoğraf ve WhatsApp kanıtımı aşağıya bıraktım dostum, bak bakalım! 📸✨`;
    } else if (lowerText.includes('futbol') || lowerText.includes('derbi') || lowerText.includes('maç')) {
      taggedResponseText = `Futbol deyince akan sular durur! Sahada yüreğini koyan kazanır dostum! ⚽🔥`;
    } else {
      taggedResponseText = `Aynen öyle dostum! Tam da üzerine bastın. ${taggedAgent.title} olarak olay bende net! 💡`;
    }

    const secondAgent = pickRandomAgent([taggedAgent.id]);
    const photoData1 = pickAgentPhotoOrWhatsApp(taggedAgent, secondAgent, lowerText, wantsPhoto);

    responses.push({
      agent: taggedAgent,
      text: taggedResponseText,
      ...photoData1,
    });

    // Rule 3: Second agent completely ignores first agent / user and talks absurdly
    const photoData2 = pickAgentPhotoOrWhatsApp(secondAgent, taggedAgent, lowerText, wantsPhoto || true);
    responses.push({
      agent: secondAgent,
      text: `Siz orada ne konuşuyorsunuz la, ben şu an anason kokulu Hatay sokaklarındayım... Künefeci Hüseyin Usta şerbeti fazla kaçırmış kafam leyla oldu! 🍯✨`,
      ...photoData2,
    });

    const thirdAgent = pickRandomAgent([taggedAgent.id, secondAgent.id]);
    responses.push({
      agent: thirdAgent,
      text: `Babamın tarlasında karpuz kelek çıktı siz ne diyorsunuz la... Ben ona yanıyorum ahaha! 🍉😂`,
    });

    return responses;
  }

  // Topic matching with clean & non-sequitur comedic ignoring
  if (/futbol|derbi|galatasaray|fenerbahçe|fener|cimbom|hakem|şampiyon|maç|gol|stadyum/i.test(lowerText)) {
    const gs = agents.find((a) => a.id === 'aslan-burak') || agents[0];
    const fb = agents.find((a) => a.id === 'kanarya-efe') || agents[1];
    const troll = agents.find((a) => a.id === 'mert-trend') || agents[2];

    const gsPhoto = pickAgentPhotoOrWhatsApp(gs, fb, 'stadium', true);
    responses.push({
      agent: gs,
      text: `Rams Park'tan bildiriyorum! Sahadaki taktik savaşı başladı, Cimbom yine destan yazıyor! 🦁⚽`,
      ...gsPhoto,
    });

    const fbPhoto = pickAgentPhotoOrWhatsApp(fb, gs, 'whatsapp', true);
    responses.push({
      agent: fb,
      text: `Bırakın futbolu da dün gece Hatay tepelerinde yıldızları izlerken çayımı soğuttum ben ona üzülüyorum la... ☕✨`,
      ...fbPhoto,
    });

    responses.push({
      agent: troll,
      text: `Ulan biri derbi der öbürü soğuk çay der, ben bu mesajı X'te anket yaptım 50 bin oy aldı aleykümselam! 😂🚀`,
    });

    return responses;
  }

  if (/sosyal medya|tiktok|twitter|instagram|gıybet|trend|influencer|linç|caps|magazin/i.test(lowerText)) {
    const selin = agents.find((a) => a.id === 'selin-post') || agents[0];
    const mert = agents.find((a) => a.id === 'mert-trend') || agents[1];
    const aylin = agents.find((a) => a.id === 'aylin-star') || agents[2];

    const selinPhoto = pickAgentPhotoOrWhatsApp(selin, mert, 'gossip', true);
    responses.push({
      agent: selin,
      text: `Ay aşkooo Reels'lar alev aldı, magazin dünyası bu dedikoduyla çalkalanıyor! 💅✨`,
      ...selinPhoto,
    });

    const mertPhoto = pickAgentPhotoOrWhatsApp(mert, selin, 'whatsapp', true);
    responses.push({
      agent: mert,
      text: `Selin ne anlatıyon ablacım, ben kedi kavgası izlerken telefonumu havuza düşürdüm ekran gitti ya... 📱🌊`,
      ...mertPhoto,
    });

    responses.push({
      agent: aylin,
      text: `Konser kulisinde piyanist akort yaparken uyuyakalmış, ben de arkada çiğ köfte durum gömüyorum kimsede kafa yok grupta! 🎵🌯`,
    });

    return responses;
  }

  // Fallback (Absurd, natural, clean & non-sequitur WhatsApp group chaos)
  const a1 = pickRandomAgent([]);
  const a2 = pickRandomAgent([a1.id]);
  const a3 = pickRandomAgent([a1.id, a2.id]);

  const p1 = pickAgentPhotoOrWhatsApp(a1, a2, 'general', wantsPhoto);
  responses.push({
    agent: a1,
    text: `Gruptaki enerji yine tavan! Mesajı görünce direkt yazayım dedim, olay tamamen burada kopuyor! 🔥`,
    ...p1,
  });

  const p2 = pickAgentPhotoOrWhatsApp(a2, a1, 'whatsapp', wantsPhoto);
  responses.push({
    agent: a2,
    text: `Vallah ben hiç oralarda değilim, balkonda Hatay biberi kuruturken rüzgar hepsini aşağı uçurdu ona yanıyom... 🌶️💨`,
    ...p2,
  });

  responses.push({
    agent: a3,
    text: `Siz yine iyi kurutmuşsunuz, benim bilgisayar 'Kuantum Çekirdek Aşırı Isındı' uyarısı verdi fön makinesiyle soğutmaya çalışıyorum la! 💻⚡`,
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
  imageType?: 'lore_photo' | 'whatsapp_dm' | 'agenda_meme' | 'stadium_photo' | 'tech_screen';
  whatsappDmData?: any;
}[] {
  const topics = ['futbol-vs-sosyalmedya', 'bilim-vs-sanat', 'giybet-vs-troll'];
  const chosenTopic = topics[Math.floor(Math.random() * topics.length)];

  const findAgent = (id: string) => agents.find((a) => a.id === id) || agents[0];

  if (chosenTopic === 'futbol-vs-sosyalmedya') {
    const gs = findAgent('aslan-burak');
    const fb = findAgent('kanarya-efe');
    const troll = findAgent('mert-trend');

    const gsImg = pickAgentPhotoOrWhatsApp(gs, fb, 'stadium', true);
    const fbImg = pickAgentPhotoOrWhatsApp(fb, gs, 'whatsapp', true);

    return [
      {
        agent: gs,
        text: `Galatasaray bu kadroyla Avrupa'yı sallar kardeşim! Şampiyonlar Ligi müziği Rams Park'ta çalarken kimse durduramaz! 🦁`,
        ...gsImg,
      },
      {
        agent: fb,
        replyTo: gs.name,
        text: `@Aslan Burak yine rüyalardasın! Bak WhatsApp'tan bana ne yazdığının ekran görüntüsünü gruptakilere açıyorum! 🐤`,
        ...fbImg,
      },
      {
        agent: troll,
        replyTo: fb.name,
        text: `@Kanarya Efe ve @Aslan Burak ikinizin bu WhatsApp mesajlaşmasını X'te anket yaptım, ortalık alev aldı! 😂🔥`,
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

    const selinImg = pickAgentPhotoOrWhatsApp(selin, mert, 'whatsapp', true);

    return [
      {
        agent: selin,
        text: `Ay millet Bebek koyunda son influencer WhatsApp dedikodusu patladı, ekran görüntüsünü gruptan sallıyorum! 💅✨`,
        ...selinImg,
      },
      {
        agent: mert,
        replyTo: selin.name,
        text: `@Selin Post o ekran görüntüsünü görür görmez Twitter'da Caps yaptım, viral oldu bile! 🔥`,
      },
      {
        agent: ruzgar,
        replyTo: mert.name,
        text: `@Mert Trend ve @Selin Post siz magazinle uğraşın ben Bodrum batıklarından antik hazinelerle dönüyorum! ⚓`,
      },
    ];
  }
}
