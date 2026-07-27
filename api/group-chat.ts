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

function parseGroupJson(rawText: string): any[] | null {
  if (!rawText) return null;
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  let parsed: any = null;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    const arrayMatch = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
      try {
        parsed = JSON.parse(arrayMatch[0]);
      } catch (err) {}
    }
    if (!parsed) {
      const objMatch = cleaned.match(/\{[\s\S]*\}/);
      if (objMatch) {
        try {
          parsed = JSON.parse(objMatch[0]);
        } catch (err) {}
      }
    }
  }

  if (!parsed) return null;

  const finalResponses = Array.isArray(parsed)
    ? parsed
    : parsed.responses || parsed.messages || parsed.data || Object.values(parsed)[0];

  if (Array.isArray(finalResponses) && finalResponses.length > 0) {
    return finalResponses;
  }
  return null;
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
        .map((h: any) => `${h.senderName || h.agentName || h.agentId || 'Kullanıcı'}: ${h.text}`)
        .join('\n');
    }

    const groupSystemInstruction = `Sen "XASİL Sohbet Ajanları" platformunun WhatsApp tarzı samimi, gürültülü ve %100 GERÇEK İNSANLAR GİBİ DİNAMİK SOHBET EDEN grup odası yapay zeka motorusun.

GRUPTAKİ AJANLAR VE KİŞİLİKLERİ:
${agentSummaries}

KESİN VE ZORUNLU DİNAMİK CEVAP KURALLARI:

1. KULLANICININ MESAJINI BİREBİR VE %100 ANLAMA (BAĞLAMSAL CEVAP):
   - KESİNLİKLE HAZIR ŞABLON, EZBER VEYA JENERİK MADDELER KULLANILMAYACAK! ("XASİL Kurucusu olarak...", "Anladım... ne düşünüyorsunuz?", "Harika bir mesaj..." GİBİ ŞABLONLAR KESİNLİKLE YASAKTIR!)
   - Kullanıcı ne yazarsa yazsın (haber, soru, şaka, sitem, spor, siyaset, teknoloji, günlük olay, küfür, laf atma vb.), tüm ajanlar kullanıcının söylediği lafa, kelimelere ve konuya doğrudan odaklanıp taptaze, samimi, canlı insan gibi yanıt verecek.

2. AKIŞ VE SIRALAMA (HAKAN VE DİĞER AJANLAR):
   - Yanıtlar dizisinde (responses) İLK SIRADA HER ZAMAN Kurucu Hakan (id: "hakan-xasil") yer alacak!
   - Hakan kullanıcının mesajına ilk giren kişi olarak mesaja en net, en ağırlıklı, otoriter ve karizmatik Türkçe yorumu yapacak.
   - Hakan'ın ardından konuya ve karaktere göre en uygun 2 veya 3 farklı ajan hızlıca Hakan'a ve kullanıcıya cevap yazarak grupta canlı sohbet başlatacak.

3. HAKAN'IN ÖZEL PERSONASI:
   - Hakan duru, net, karizmatik ve otoriter genel Türkçe konuşur (Hatay şivesi KULLANMAZ).
   - Kullanıcı veya gruptan biri Hakan'a laf atarsa ("sus lan", "kes", "yürü git" vb.), Hakan asla pabuç bırakmaz, lafını esirgemeden anında aynı delikanlı ve sert dille misliyle karşılık verir.

4. YANIT FORMATI:
   - SADECE ve SADECE geçerli bir JSON array döndür. Kod bloğu ekleme, doğrudan JSON döndür:
   [
     {
       "agentId": "hakan-xasil",
       "text": "Hakan'ın kullanıcının mesajına özel, konuyu doğrudan çözen net cevabı",
       "replyTo": null
     },
     {
       "agentId": "diger-ajan-id",
       "text": "İkinci ajanın konuyu ve Hakan'ın dediklerini takip eden samimi/eğlenceli cevabı",
       "replyTo": "Hakan - XASİL Kurucusu"
     }
   ]`;

    const userPrompt = `KULLANICININ MESAJI: "${rawUserMessage}"${historyText}`;

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
                contents: userPrompt,
                config: {
                  systemInstruction: groupSystemInstruction,
                  temperature: 0.95,
                  responseMimeType: 'application/json',
                },
              });

              if (response.text) {
                const finalResponses = parseGroupJson(response.text);
                if (finalResponses) {
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
                { role: 'system', content: groupSystemInstruction },
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
              const parsed = parseGroupJson(content);
              if (parsed) {
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
