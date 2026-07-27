import { GoogleGenAI } from '@google/genai';
import { getStoredServerKeys } from './keys';

function extractGeminiKeys(req: any): string[] {
  const keys: string[] = [];

  // 1. Header x-gemini-keys
  const headerKeys = req.headers['x-gemini-keys'];
  if (headerKeys) {
    try {
      const parsed = typeof headerKeys === 'string' && headerKeys.startsWith('[')
        ? JSON.parse(headerKeys)
        : String(headerKeys).split(',');
      if (Array.isArray(parsed)) {
        for (const k of parsed) {
          if (typeof k === 'string' && k.trim()) keys.push(k.trim());
        }
      }
    } catch (e) {
      if (typeof headerKeys === 'string' && headerKeys.trim()) {
        keys.push(headerKeys.trim());
      }
    }
  }

  // 2. Body geminiKeys
  if (req.body && Array.isArray(req.body.geminiKeys)) {
    for (const k of req.body.geminiKeys) {
      if (typeof k === 'string' && k.trim()) keys.push(k.trim());
    }
  }

  // 3. Stored server keys
  try {
    const stored = getStoredServerKeys();
    for (const k of stored) {
      if (k && !keys.includes(k)) keys.push(k);
    }
  } catch (e) {}

  // 4. Environment GEMINI_API_KEY & GEMINI_API_KEY_1..5
  const envKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5,
  ];
  for (const envK of envKeys) {
    if (envK && typeof envK === 'string' && envK.trim() && !keys.includes(envK.trim())) {
      keys.push(envK.trim());
    }
  }

  const validKeys = [...new Set(keys)].filter((k) => k.length > 5);
  // Rastgele (Randomized) Yük Dengeleme: Trafik sıkışmasını önlemek için rastgele karıştır
  return validKeys.sort(() => Math.random() - 0.5);
}

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

    let historyText = '';
    if (Array.isArray(history) && history.length > 0) {
      historyText = '\n\nSON SOHBET GEÇMİŞİ:\n' + history
        .map((h: any) => `${h.senderName || h.agentId || 'Kullanıcı'}: ${h.text}`)
        .join('\n');
    }

    const systemPrompt = `Sen "XASİL Sohbet Ajanları" platformunun WhatsApp tarzı gürültülü, samimi ve eğlenceli grup odasını yöneten Türkçe Yapay Zeka motorusun.

GRUPTAKİ AJANLAR VE KİŞİLİKLERİ:
${agentSummaries}

KULLANICININ MESAJI: "${rawUserMessage}"
${historyText}

KESİN GRUP VE SOHBET KURALLARI:

1. KULLANICIYI NET ANLAMA (ODAKLANMA):
   - Kullanıcı ne yazarsa yazsın, tüm ajanlar (özellikle Hakan) kullanıcının ne dediğini TAM VE NET ANLAYACAK.
   - Asla alakasız, saçma ya da konudan kopuk ezbere yanıt üretilmeyecek. Kullanıcının yazdığı mesaj doğrudan ana odak noktası olacak.

2. GRUP ODASI AKIŞ SIRASI (HAKAN HER ZAMAN İLK İSE):
   - Yanıtlar dizisinde (responses array) İLK SIRADA HER ZAMAN Kurucu Hakan (id: "hakan-xasil") yer alacak!
   - Hakan kullanıcıya ilk giren kişi olarak mesaja en net, en ağırlıklı, otoriter ve sert yorumu yapacak.
   - Hakan'ın ardından diğer 2 veya 3 ajan hızlıca, sırayla ve kendi karakterlerine göre konuyu yorumlayıp ardışık yanıt verecekler.

3. KURUCU HAKAN'IN DİLİ VE KİMLİĞİ:
   - Hakan platformun kurucusudur. Grupta KESİNLİKLE Hatay ağzı KULLANMAYACAK!
   - Grupta tamamen AKICI, SERT, NET ve GENEL TÜRKÇE AĞZIYLA (Ağır, karizmatik ve otoriter Türkçe) konuşacak.
   - Grupta biri "sus lan", "kes", "yürü git" gibi atarlı/sert bir çıkış yaparsa HAKAN ASLA PABUÇ BIRAKMAZ ve lafını esirgemeden anında aynı sertlikle ve delikanlı tavırla misliyle cevabını yapıştırır.
   - Birebir sohbette ise ilk karşılama cümlesi her zaman: "Merhaba ben Hakan, size nasıl yardımcı olabilirim?" olur.

4. ŞABLON VE YAZIM YASAKLARI:
   - KESİNLİKLE "Harika bir mesaj...", "Anladım, ... hakkında ne düşünüyorsunuz?" gibi robotiğe kaçan, yapay şablon, kalıp cümleler VEYA ön ekler KULLANILMAYACAK!
   - Tüm yanıtlar anlık, ham, doğal ve spontane olacaktır.

5. YANIT FORMATI:
   - Yanıtı SADECE geçerli bir JSON array formatında döndür:
     [
       {
         "agentId": "hakan-xasil",
         "text": "Hakan'ın ilk, net, ağırlıklı ve otoriter yanıtı",
         "replyTo": null
       },
       {
         "agentId": "diger-ajan-id",
         "text": "İkinci ajanın Hakan'ı ve konuyu takip eden doğal/eğlenceli yanıtı",
         "replyTo": "Hakan - XASİL Kurucusu"
       }
     ]
`;

    // 1. PRIMARY CHOICE: Gemini Key Pool Execution
    const geminiCandidateKeys = extractGeminiKeys(req);
    const geminiModelsToTry = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

    if (geminiCandidateKeys.length > 0) {
      for (const currentKey of geminiCandidateKeys) {
        try {
          const ai = new GoogleGenAI({ apiKey: currentKey });

          for (const modelName of geminiModelsToTry) {
            try {
              const response = await ai.models.generateContent({
                model: modelName,
                contents: systemPrompt,
                config: {
                  temperature: 0.9,
                  responseMimeType: 'application/json',
                },
              });

              if (response.text && response.text.trim()) {
                const parsed = JSON.parse(response.text.trim());
                const finalResponses = Array.isArray(parsed)
                  ? parsed
                  : parsed.responses || parsed.messages || Object.values(parsed)[0];

                if (Array.isArray(finalResponses) && finalResponses.length > 0) {
                  return res.status(200).json({
                    responses: finalResponses,
                    usedEngine: 'gemini',
                    model: modelName,
                  });
                }
              }
            } catch (modelErr: any) {
              console.warn(`Group Gemini model error ${modelName}:`, modelErr?.message || modelErr);
            }
          }
        } catch (keyErr: any) {
          console.warn('Group Gemini key error:', keyErr?.message || keyErr);
        }
      }
    }

    // 2. SECONDARY FALLBACK: Groq API
    const effectiveGroqKey = groqApiKey || req.headers['x-groq-api-key'] || process.env.GROQ_API_KEY;
    if (effectiveGroqKey) {
      const groqModelsToTry = [
        'llama-3.3-70b-versatile',
        'llama-3.1-70b-versatile',
        'llama3-70b-8192',
        'llama-3.1-8b-instant',
      ];

      for (const modelName of groqModelsToTry) {
        try {
          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${effectiveGroqKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: rawUserMessage },
              ],
              temperature: 0.9,
              max_tokens: 1024,
              response_format: { type: 'json_object' },
            }),
          });

          if (groqRes.ok) {
            const groqData: any = await groqRes.json();
            const content = groqData.choices?.[0]?.message?.content;
            if (content) {
              let parsed: any = null;
              try {
                const rawParsed = JSON.parse(content);
                parsed = Array.isArray(rawParsed)
                  ? rawParsed
                  : rawParsed.responses || rawParsed.messages || Object.values(rawParsed)[0];
              } catch (e) {}

              if (Array.isArray(parsed) && parsed.length > 0) {
                return res.status(200).json({
                  responses: parsed,
                  usedEngine: 'groq',
                  model: modelName,
                });
              }
            }
          }
        } catch (groqErr) {
          console.warn(`Group Groq error with ${modelName}:`, groqErr);
        }
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
