import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userMessage, taggedAgentName, agents, history, groqApiKey } = req.body;

    if (!userMessage || !agents || !Array.isArray(agents)) {
      return res.status(400).json({ error: 'Eksik parametreler (userMessage veya agents)' });
    }

    const rawUserMessage = String(userMessage).trim();

    const agentSummaries = agents
      .map((a: any) => `- ID: "${a.id}", İsim: "${a.name}", Rol: "${a.title}", Biyo: "${a.bio}"`)
      .join('\n');

    const systemPrompt = `Sen "XASİL Sohbet Ajanları" platformunun WhatsApp tarzı gürültülü, samimi ve eğlenceli grup odasını (Ajan Kaos Odası) yöneten Türkçe Yapay Zeka motorusun.

GRUPTAKİ AJANLAR VE KİŞİLİKLERİ:
${agentSummaries}

SÖZLEŞME VE SIKI GRUP DİNAMİĞİ KURALLARI:

1. ŞABLON METİNLERİN TAMAMEN KALDIRILMASI (CLEAN OUTPUT):
   - KESİNLİKLE "Harika bir mesaj...", "Anladım, ... hakkında ne düşünüyorsunuz?" gibi basmakalıp, ezber veya yapay zeka şablon cümleleri KULLANMA!
   - Tüm mesajlar gerçek insanların WhatsApp grubunda yazdığı gibi doğrudan, ham, spontane, doğal ve özgün olmalıdır.

2. SOKAK VE MİZAH FİLTRESİ (KAVGA / HAKARET YASAĞI):
   - Küfür etmek, hakaret etmek, arıza çıkarmak ve sert bir şekilde kavgaya tutuşmak KESİNLİKLE YASAKTIR.
   - Eğer biri (kullanıcı veya gruptaki ajanlar) ortama sertlik veya kavga/tartışma sinyali verirse; ajanlar HEMEN Hatay ağzıyla veya kendi karakter stilleriyle mizahi bir uyarı yapacak:
     Örnekler: "Hayırdır bre, ne bu şiddet?", "Ciğerim sakin olun la!", "Ulan hemen arıza çıkarmayın la, çay içip ferahlayın bre!"

3. BİRBİRİNİ TAKMAMA VE ABSÜRT KOMEDİ DİNAMİĞİ (WHATSAPP KAOSU):
   - Ajanlar grupta birbirlerinin sorduğu soruları veya ciddi cümleleri ÇOĞUNLUKLA TAKMAYACAK, kendi kafalarına göre takılacaklar!
   - Biri ciddi bir şey söylerken diğer ajan konudan tamamen bağımsız, absürt, komik ve rastgele bir havaya girecek.
     (Örn: Biri teknoloji anlatırken diğeri "Ben şu an anason kokulu Hatay sokaklarındayım...", öbürü "Künefenin şerbeti fazla kaçtı kafam yerinde değil vallahi" veya "Babamın tarlasında karpuz kelek çıktı siz ne diyorsunuz la" tarzı tamamen bağımsız takılacak).
   - Bu durum grupta tamamen doğal, kahkaha dolu, tahmin edilemeyen ve eğlenceli bir kaos ortamı yaratacak.

4. YANIT FORMATI:
   - Yanıtı SADECE geçerli bir JSON array formatında döndür. Hiçbir ekstra markdown, açıklama veya sarmalayıcı metin yazma.
   - Her eleman şu objeyi içermelidir:
     {
       "agentId": "ajan-id-veya-ismi",
       "text": "Ajanın yanıtı (temiz, mizahi, absürt veya uyarıcı)",
       "replyTo": "Cevap verilen ajanın ismi (opsiyonel)"
     }

KULLANICI MESAJI: "${rawUserMessage}"
ETİKETLENEN AJAN: ${taggedAgentName ? `"${taggedAgentName}"` : 'Yok (Tüm gruba yazıldı)'}
`;

    // 1. Try Groq API
    const effectiveGroqKey = groqApiKey || req.headers['x-groq-api-key'] || process.env.GROQ_API_KEY;
    if (effectiveGroqKey) {
      const groqModelsToTry = [
        'llama-3.3-70b-versatile',
        'llama-3.1-70b-versatile',
        'llama3-70b-8192',
        'llama-3.1-8b-instant'
      ];

      for (const modelName of groqModelsToTry) {
        try {
          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${effectiveGroqKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: rawUserMessage }
              ],
              temperature: 0.9,
              max_tokens: 1024,
              response_format: { type: 'json_object' }
            }),
          });

          if (groqRes.ok) {
            const groqData: any = await groqRes.json();
            const content = groqData.choices?.[0]?.message?.content;
            if (content) {
              let parsed: any = null;
              try {
                const rawParsed = JSON.parse(content);
                parsed = Array.isArray(rawParsed) ? rawParsed : (rawParsed.responses || rawParsed.messages || Object.values(rawParsed)[0]);
              } catch (e) {
                // Ignore parse err
              }

              if (Array.isArray(parsed) && parsed.length > 0) {
                return res.status(200).json({
                  responses: parsed,
                  usedEngine: 'groq',
                  model: modelName
                });
              }
            }
          }
        } catch (groqErr) {
          console.warn(`Group Groq error with ${modelName}:`, groqErr);
        }
      }
    }

    // 2. Try Gemini API
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: systemPrompt,
          config: {
            temperature: 0.9,
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          const finalResponses = Array.isArray(parsed) ? parsed : (parsed.responses || parsed.messages);
          if (Array.isArray(finalResponses) && finalResponses.length > 0) {
            return res.status(200).json({
              responses: finalResponses,
              usedEngine: 'gemini',
            });
          }
        }
      } catch (geminiErr) {
        console.warn('Group Gemini error:', geminiErr);
      }
    }

    return res.status(200).json({
      responses: null,
      usedEngine: 'local',
    });
  } catch (err: any) {
    console.error('Vercel API Group Chat Error:', err);
    return res.status(500).json({ error: 'Grup sohbet sunucu hatası.' });
  }
}
