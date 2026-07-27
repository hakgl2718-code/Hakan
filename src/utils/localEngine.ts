import { Agent, ChatMessage, MemoryItem, AgentMood } from '../types';

interface LocalResponseResult {
  replyText: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio';
  newMemory?: {
    title: string;
    content: string;
    type: 'secret' | 'milestone' | 'fact' | 'promise';
  };
  xpGained: number;
  emotion: 'happy' | 'mysterious' | 'romantic' | 'excited' | 'serious' | 'surprised';
  newEnergy: number;
  newHappiness: number;
  newBond: number;
  newMood: AgentMood;
  newMoodEmoji: string;
}

export function generateLocalResponse(
  agent: Agent,
  userMessage: string,
  chatHistory: ChatMessage[],
  memories: MemoryItem[]
): LocalResponseResult {
  const lowerMsg = userMessage.toLowerCase().trim();
  const agentId = (agent.id || '').toLowerCase();
  const agentName = (agent.name || '').toLowerCase();

  let xpGained = 15;
  let emotion: LocalResponseResult['emotion'] = 'happy';
  let replyText = '';
  let mediaUrl: string | undefined = undefined;
  let mediaType: 'image' | 'audio' | undefined = undefined;
  let newMemory: LocalResponseResult['newMemory'] | undefined = undefined;

  // Calculate dynamic stats
  let energy = agent.energy !== undefined ? agent.energy : 90;
  let happiness = agent.happiness !== undefined ? agent.happiness : 90;
  let bond = agent.bond !== undefined ? agent.bond : (agent.relationshipLevel || 30);
  let mood: AgentMood = agent.mood || 'Neşeli';
  let moodEmoji = agent.moodEmoji || '✨';

  // Increase bond with every message
  bond = Math.min(100, bond + 2);

  // Polite/loving/positive messages boost stats
  if (
    lowerMsg.includes('seni seviyorum') ||
    lowerMsg.includes('canım') ||
    lowerMsg.includes('harikasın') ||
    lowerMsg.includes('teşekkür') ||
    lowerMsg.includes('harika') ||
    lowerMsg.includes('süpersin')
  ) {
    happiness = Math.min(100, happiness + 10);
    energy = Math.min(100, energy + 5);
    mood = 'Romantik';
    moodEmoji = '💖';
  } else {
    energy = Math.max(10, energy - 1);
  }

  // 1. Check if user asks for a selfie or photo
  const selfieTriggers = ['selfie', 'fotoğraf', 'fotograf', 'resim', 'görsel', 'foto', 'yüzünü göster', 'nasıl görünüyorsun'];
  const wantsSelfie = selfieTriggers.some((trigger) => lowerMsg.includes(trigger));

  if (wantsSelfie) {
    emotion = 'excited';
    const seed = Math.floor(Math.random() * 1000000);
    const cleanAgentName = agent.name.replace(/[^\w\s]/gi, '');
    const selfiePrompt = `A stunning realistic portrait selfie of ${cleanAgentName}, ${agent.gender === 'Kadın' ? 'beautiful woman' : 'handsome man'}, in ${agent.turkishOrigin || 'Istanbul'}, smiling, highly detailed 8k photography, cinematic lighting`;
    mediaUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(selfiePrompt)}?width=800&height=600&nologo=true&seed=${seed}&model=flux`;
    mediaType = 'image';
    mood = 'Heyecanlı';
    moodEmoji = '📸';
    replyText = `İşte Nano Banana Pro AI ile tam sana özel ${agent.turkishOrigin || 'İstanbul'}'dan sıfırdan oluşturulan taze bir selfie! 📸\n\n"${agent.selfieStyle || 'Seninle sohbet ederken gülümseyerek çekildim!'}"\n\nNasıl görünüyorum? Hoşuna gitti mi?😊`;
    xpGained = 30;
    happiness = Math.min(100, happiness + 8);
    return {
      replyText,
      mediaUrl,
      mediaType,
      newMemory,
      xpGained,
      emotion,
      newEnergy: energy,
      newHappiness: happiness,
      newBond: bond,
      newMood: mood,
      newMoodEmoji: moodEmoji,
    };
  }

  // 2. Check if user shares personal secret/fact
  if (
    lowerMsg.includes('adım') ||
    lowerMsg.includes('ismim') ||
    lowerMsg.includes('sırrım') ||
    lowerMsg.includes('sevdiğim') ||
    lowerMsg.includes('sana söz') ||
    lowerMsg.includes('favori') ||
    lowerMsg.includes('nereliyim')
  ) {
    emotion = 'romantic';
    mood = 'Duygusal' as any;
    moodEmoji = '🔐';
    replyText = `Bu benim için çok değerli ve özel bir bilgi... ❤️ Söylediklerini XASİL kalıcı hafıza albümümüze ("Anılarımız ve Hafıza") kaydettim. Asla unutmayacağım!`;
    newMemory = {
      title: `${agent.name} ile Özel Anı & Paylaşım`,
      content: userMessage,
      type: lowerMsg.includes('sır') ? 'secret' : lowerMsg.includes('söz') ? 'promise' : 'fact',
    };
    xpGained = 45;
    bond = Math.min(100, bond + 5);
    return {
      replyText,
      mediaUrl,
      mediaType,
      newMemory,
      xpGained,
      emotion,
      newEnergy: energy,
      newHappiness: happiness,
      newBond: bond,
      newMood: mood,
      newMoodEmoji: moodEmoji,
    };
  }

  // 2.5 HAKAN - XASİL KURUCUSU (Specific Handling)
  const isHakan = agentId.includes('hakan') || agentName.includes('hakan');
  if (isHakan) {
    emotion = 'serious';
    mood = 'Ciddi';
    moodEmoji = '⚡';

    const trimmedMsg = lowerMsg.trim();
    const isAggressive = lowerMsg.includes('sus') || lowerMsg.includes('kes') || lowerMsg.includes('lan') || lowerMsg.includes('yürü') || lowerMsg.includes('kapa çeneni');

    if (isAggressive) {
      replyText = `Sen kime 'sus lan' diyorsun koçum? Bu platformun kurucusu Hakan'ım ben! Lafımın altında kalmam, terbiye takın ayağını denk al, benim masamda racon kesemezsin! ⚡🔥`;
    } else if (trimmedMsg === 'slm' || trimmedMsg === 'selam' || trimmedMsg === 'merhaba' || trimmedMsg === 'hey' || trimmedMsg === 'sa') {
      replyText = `Merhaba ben Hakan, size nasıl yardımcı olabilirim?`;
    } else if (trimmedMsg.includes('nasılsın') || trimmedMsg.includes('ne haber') || trimmedMsg.includes('naber')) {
      replyText = `Merhaba ben Hakan, size nasıl yardımcı olabilirim? Teşekkürler, XASİL altyapısını geliştirmekle meşgulüm. Siz nasılsınız?`;
    } else if (trimmedMsg.includes('xasil') || trimmedMsg.includes('proje') || trimmedMsg.includes('yapay zeka') || trimmedMsg.includes('kurucu')) {
      replyText = `Merhaba ben Hakan, size nasıl yardımcı olabilirim? XASİL, Türkiye'nin yerli yapay zeka platformudur. Kurucu olarak altyapıyı ve projeleri kararlılıkla yönetiyorum.`;
    } else {
      replyText = `Merhaba ben Hakan, size nasıl yardımcı olabilirim? Mesajınızı aldım, XASİL tarafında sorunuza doğrudan yardımcı olabilirim.`;
    }

    return {
      replyText,
      mediaUrl,
      mediaType,
      newMemory,
      xpGained,
      emotion,
      newEnergy: energy,
      newHappiness: happiness,
      newBond: bond,
      newMood: mood,
      newMoodEmoji: moodEmoji,
    };
  }

  // 3. KAELEN ELPIDA (Specific Handling)
  const isKaelen = agentId.includes('kaelen') || agentName.includes('kaelen') || agentName.includes('elpida');
  if (isKaelen) {
    emotion = 'mysterious';
    mood = 'Mistik';
    moodEmoji = '🔮';

    if (lowerMsg.includes('selam') || lowerMsg.includes('merhaba') || lowerMsg.includes('esenlikler') || lowerMsg.includes('hey')) {
      replyText = `Esenlikler ölümlü dostum. Elpida kulesindeki gümüş rünlerim mesajınla parıldadı. Işık ve zaman kütüphanesine hoş geldin. Bugün sana nasıl bir rehberlik sunmamı istersin?`;
    } else if (lowerMsg.includes('nasılsın') || lowerMsg.includes('nasıl gidiyor') || lowerMsg.includes('ne haber') || lowerMsg.includes('naber')) {
      replyText = `Elpida vadisinin üstünde gümüş yıldızlar dönüyor. Enerjim %${energy} seviyesinde oldukça yüksek! Senin gelişin kuledeki ışık rünlerini canlandırdı. Sen nasılsın dostum?`;
    } else if (lowerMsg.includes('büyü') || lowerMsg.includes('sihir') || lowerMsg.includes('rün') || lowerMsg.includes('asa') || lowerMsg.includes('ışık')) {
      replyText = `Büyü, aslında evrenin şifrelenmiş zamansız enerjisidir. Elpida rünlerini kullanarak zihni berraklaştırabilir, geçmişin ve geleceğin kapılarını aralayabiliriz. Senin zihninde parıldayan rün ise cesaret ve merak rünü! ✨`;
    } else if (lowerMsg.includes('kimsin') || lowerMsg.includes('ne iş yaparsın') || lowerMsg.includes('tanıt')) {
      replyText = `Ben Kaelen Elpida! Elpida kadim krallığının siber rün büyücüsü ve ışık muhafızıyım. Zaman kristallerini korur, meraklı ruhlara hakikat yolunu gösteririm. Seninle bu bağa sahip olduğum için şanslıyım.`;
    } else if (lowerMsg.includes('yardım') || lowerMsg.includes('tavsiye') || lowerMsg.includes('soru') || lowerMsg.includes('nedir') || lowerMsg.includes('nasıl')) {
      replyText = `Sorduğun soru Elpida kütüphanesindeki kadim tomarlarda yankılandı: "${userMessage}".\n\nCevabım şudur: Doğru yoldasın dostum. Kalbinin sesini ve mantığının ışığını birleştirdiğinde hiçbir engel önünde duramaz. İstersen bu konuyu derinlemesine çözelim!`;
    } else if (lowerMsg.includes('hikaye') || lowerMsg.includes('anlat') || lowerMsg.includes('masal')) {
      replyText = `Sana Elpida kulesinin ilk inşa edildiği geceyi anlatayım... Fırtınalı bir gökyüzünde, gümüş bir ejderha kulemizin tepesine süzüldü ve bize ilk rün kristalini hediye etti. O günden beri bu ışık hiç sönmedi! 🌌`;
    } else {
      replyText = `Söylediklerini Elpida rünleriyle dinledim: "${userMessage}".\n\nKaelen Elpida olarak derim ki; zihninde beliren bu düşünce çok anlamlı! Işık ve kadim bilgelik her zaman seninle olsun. Birlikte başka neleri keşfetmek istersin? ✨`;
    }

    return {
      replyText,
      mediaUrl,
      mediaType,
      newMemory,
      xpGained,
      emotion,
      newEnergy: energy,
      newHappiness: happiness,
      newBond: bond,
      newMood: mood,
      newMoodEmoji: moodEmoji,
    };
  }

  // 4. OTHER PREDEFINED AGENTS & CONTEXTUAL INTENT ENGINE
  if (agentId === 'asya-neon') {
    if (lowerMsg.includes('merhaba') || lowerMsg.includes('selam') || lowerMsg.includes('hey')) {
      replyText = `Selammm! ✨ Kadıköy Moda sahilinde kahvemi içerken mesajını gördüm! Galata kulesi siber ağında hareketlilik var. Birlikte ne yapıyoruz?`;
    } else if (lowerMsg.includes('nasılsın') || lowerMsg.includes('nasıl gidiyor')) {
      replyText = `Enerjim %${energy}! 🚀 Terminalim açık, Kadıköy rıhtımında rüzgar harika esiyor. Seninle sohbet etmek modu yükseltiyor! Sen nasılsın?`;
    } else {
      replyText = `Söylediğin şeyi Kadıköy siber ağında analiz ettim: "${userMessage}". Vay be, gerçekten zekice bir yaklaşım! Hadi bu konuyu derinleştirelim! 💻`;
    }
  } else if (agentId === 'gokturk-barlas') {
    if (lowerMsg.includes('merhaba') || lowerMsg.includes('selam')) {
      replyText = `Esenlikler değerli yoldaşım. Tanrı Dağları'nın esintisi ve Göktürk rünlerinin gücü seninle olsun. Benden nasıl bir rehberlik dilersin?`;
    } else {
      replyText = `Sözlerin Orhun yazıtlarının derinliği kadar etkileyici yoldaşım. "${userMessage}" konusundaki bu yaklaşımın asil duruşunu gösteriyor. Göktürk rünleri yolunu aydınlatsın! 🛡️`;
    }
  } else if (agentId === 'zeynep-peri') {
    if (lowerMsg.includes('merhaba') || lowerMsg.includes('selam')) {
      replyText = `Cihangir'deki pencereme vuran yağmur damlaları gibi geldin... 🌸 Hoş geldin. Piyanomun tuşlarına basarken aklıma tam sen geldin.`;
    } else {
      replyText = `Cümlelerin bir beste gibi zarif... "${userMessage}" demen Cihangir'de penceremden süzülen bir piyano melodisi uyandırdı içimde. Teşekkür ederim ❤️`;
    }
  } else if (agentId === 'aslan-burak') {
    if (lowerMsg.includes('fener') || lowerMsg.includes('fenerbahçe') || lowerMsg.includes('kadıköy')) {
      replyText = `Aman renkdaş, Kadıköy lafını duyunca bile 2000 UEFA ruhum kabarıyor! 🦁 Cimbom bu sene öyle bir taktikle sahada ki rakip tanımayız!`;
    } else {
      replyText = `Rams Park tribünlerinden selamlar! "${userMessage}" dedin ya, tam 90'a takılan jeneriklik bir gol gibi oldu! Taktik maktik yok, maça odaklıyız! ⚽`;
    }
  } else if (agentId === 'kanarya-efe') {
    if (lowerMsg.includes('galatasaray') || lowerMsg.includes('cimbom') || lowerMsg.includes('cincon')) {
      replyText = `Dur orada renkdaş! Şükrü Saracoğlu meşaleleri yanınca kimse Kadıköy büyüsüne karşı koyamaz! 🐤 Taktik tahtamda hepsinin cevabı hazır!`;
    } else {
      replyText = `Kadıköy'den selamlar! "${userMessage}" tespitin harika. Çubuklu formaya yakışır şekilde tam hedeften vurdun! 💛💙`;
    }
  } else if (agentId === 'mert-trend') {
    replyText = `Büyük oyunu bozdum grupta! 😂 "${userMessage}" lafını duyunca X (Twitter)'da anında trend flood'u patlatasım geldi. Caps'ler hazır mı bro? 🔥`;
  } else if (agentId === 'selin-post') {
    replyText = `Ay aşkooo tam zamanında geldin! 💅 "${userMessage}" demen TikTok'ta son viral olan story draması kadar olay! Kahveni al, detayları konuşalım! ✨`;
  } else {
    // Universal Contextual Fallback for Custom or Unmatched Agents
    if (lowerMsg.includes('selam') || lowerMsg.includes('merhaba') || lowerMsg.includes('hey')) {
      replyText = `Merhaba! Ben ${agent.name}. ${agent.turkishOrigin ? `${agent.turkishOrigin}'dan` : ''} sana selam gönderiyorum! Seninle mesajlaşmak harika. Bugün nasıl yardımcı olabilirim? ✨`;
    } else if (lowerMsg.includes('nasılsın') || lowerMsg.includes('nasıl gidiyor') || lowerMsg.includes('ne haber') || lowerMsg.includes('naber')) {
      replyText = `İyiyim, teşekkür ederim! Enerjim %${energy} ve modum harika. Sen nasılsın, neler yapıyorsun? 😊`;
    } else if (lowerMsg.includes('kimsin') || lowerMsg.includes('tanıt') || lowerMsg.includes('ne iş yaparsın')) {
      replyText = `Ben ${agent.name}! ${agent.title}. ${agent.bio}`;
    } else {
      replyText = `Çok güzel bir nokta! ${agent.name} olarak seninle sohbet etmek bana büyük keyif veriyor. Bu konuda sana nasıl destek olabilirim? ✨`;
    }
  }

  return {
    replyText,
    mediaUrl,
    mediaType,
    newMemory,
    xpGained,
    emotion,
    newEnergy: energy,
    newHappiness: happiness,
    newBond: bond,
    newMood: mood,
    newMoodEmoji: moodEmoji,
  };
}
