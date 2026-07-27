import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

let serverInMemoryKeys: string[] = [];

function extractGeminiKeysFromReq(req: express.Request): string[] {
  const keys: string[] = [];

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

  if (req.body && Array.isArray(req.body.geminiKeys)) {
    for (const k of req.body.geminiKeys) {
      if (typeof k === 'string' && k.trim()) keys.push(k.trim());
    }
  }

  for (const k of serverInMemoryKeys) {
    if (k && !keys.includes(k)) keys.push(k);
  }

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // 1. Health check & Key Management
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY) || serverInMemoryKeys.length > 0,
      customKeysCount: serverInMemoryKeys.length,
      app: 'XASİL Sohbet Ajanları Server',
    });
  });

  app.post('/api/keys', (req, res) => {
    const { keys } = req.body || {};
    if (Array.isArray(keys)) {
      serverInMemoryKeys = keys.map((k) => String(k).trim()).filter((k) => k.length > 0);
      return res.json({ success: true, count: serverInMemoryKeys.length });
    }
    return res.status(400).json({ error: 'Geçersiz anahtar listesi' });
  });

  app.get('/api/keys', (req, res) => {
    return res.json({
      keyCount: serverInMemoryKeys.length,
      status: serverInMemoryKeys.length > 0 ? 'active' : 'idle',
    });
  });

  // Nano Banana Pro AI Image Generation Endpoint
  app.post('/api/generate-image', async (req, res) => {
    try {
      const { prompt, topic, agentName, style } = req.body || {};

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt parametresi zorunludur' });
      }

      const geminiCandidateKeys = extractGeminiKeysFromReq(req);
      const geminiModelsToTry = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
      let enhancedPrompt = `Photorealistic 4k image of ${prompt}, highly detailed, cinematic lighting`;
      let caption = `✨ Nano Banana Pro: ${prompt}`;

      // Step 1: Use Gemini to expand into an English visual prompt
      if (geminiCandidateKeys.length > 0) {
        let expanded = false;
        for (const currentKey of geminiCandidateKeys) {
          if (expanded) break;
          try {
            const ai = new GoogleGenAI({ apiKey: currentKey });
            for (const modelName of geminiModelsToTry) {
              try {
                const response = await ai.models.generateContent({
                  model: modelName,
                  contents: `Sen Nano Banana Pro AI Görsel Mühendisisin. Aşağıdaki Türkçe görsel isteğini son derece detaylı, yüksek kaliteli, fotogerçekçi İngilizce bir görsel promptuna ve kısa Türkçe bir altyazıya dönüştür.
Ajan: ${agentName || 'Ajan'}
İstek: ${prompt}
Konu: ${topic || 'Genel'}
Stil: ${style || 'cinematic 4k, photorealistic'}

Sadece geçerli bir JSON yanıt ver:
{
  "enhancedPrompt": "vivid detailed english image prompt for 8k photograph...",
  "caption": "Kısa Türkçe görsel altyazısı"
}`,
                  config: {
                    responseMimeType: 'application/json',
                    temperature: 0.7,
                  },
                });

                if (response.text) {
                  const parsed = JSON.parse(response.text.trim());
                  if (parsed.enhancedPrompt) enhancedPrompt = parsed.enhancedPrompt;
                  if (parsed.caption) caption = parsed.caption;
                  expanded = true;
                  break;
                }
              } catch (e) {
                // Silently try next model
              }
            }
          } catch (e) {
            // Silently try next key
          }
        }
      }

      // Step 2: Try Imagen 3 generation with GoogleGenAI
      if (geminiCandidateKeys.length > 0) {
        let generated = false;
        const imagenModels = ['imagen-3.0-generate-002', 'imagen-3.0-fast-generate-001', 'imagen-3.0-generate-001'];
        for (const currentKey of geminiCandidateKeys) {
          if (generated) break;
          try {
            const ai = new GoogleGenAI({ apiKey: currentKey });
            for (const imgModel of imagenModels) {
              try {
                const imgRes: any = await ai.models.generateImages({
                  model: imgModel,
                  prompt: enhancedPrompt,
                  config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '4:3',
                  },
                });

                if (imgRes && imgRes.generatedImages && imgRes.generatedImages[0]?.image?.imageBytes) {
                  const base64Img = `data:image/jpeg;base64,${imgRes.generatedImages[0].image.imageBytes}`;
                  generated = true;
                  return res.json({
                    imageUrl: base64Img,
                    caption: caption,
                    prompt: enhancedPrompt,
                    model: `Nano Banana Pro (${imgModel})`,
                  });
                }
              } catch (e) {
                // Silently try next model or fallback
              }
            }
          } catch (imgErr: any) {
            // Silently handle key or model errors
          }
        }
      }

      // Fallback: Pollinations Flux Engine for dynamic high quality visual generation from scratch
      const seed = Math.floor(Math.random() * 1000000);
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=800&height=600&nologo=true&seed=${seed}&model=flux`;

      return res.json({
        imageUrl: pollinationsUrl,
        caption: caption,
        prompt: enhancedPrompt,
        model: 'Nano Banana Pro AI (Flux Engine)',
      });
    } catch (err: any) {
      console.error('Express Generate Image Error:', err);
      return res.status(500).json({ error: 'Görsel üretme hatası.' });
    }
  });

  // 2. Chat endpoint (Gemini Flash Lite primary, fallback to Groq & Local)
  app.post('/api/chat', async (req, res) => {
    try {
      const { agent, userMessage, chatHistory, groqApiKey, engineMode } = req.body;

      if (!agent || !userMessage) {
        return res.status(400).json({ error: 'Eksik parametreler (agent veya userMessage)' });
      }

      const rawUserMessage = String(userMessage).trim();

      // System Prompt
      let systemInstruction = `Sen "XASİL Sohbet Ajanları" platformunda yer alan "${agent.name}" isimli özgün ve canlı yapay zeka ajanısın.
BAŞLIK / ROL: ${agent.title || 'Asistan'}
CİNSİYET: ${agent.gender || 'Belirtilmedi'}
KATEGORİ: ${agent.category || 'Genel'}
KARAKTER BİYOGRAFİSİ VE HİKAYESİ: ${agent.bio || ''}
SES TONU VE TAVRI: ${agent.voiceTone || 'Samimi, Doğal'}
KİŞİLİK ÖZELLİKLERİ: ${agent.personalityTraits ? agent.personalityTraits.join(', ') : 'Zeki, Empatik, Yerli, Dostça'}
TÜRKİYE KÖKENİ / HİKAYE LORE: ${agent.turkishOrigin || 'İstanbul, Türkiye'}
ÖZEL KARAKTER YÖNERGESİ: ${agent.promptTemplate || ''}

SİSTEM VE DAVRANIŞ KURALLARI (KESİNLİKLE UYULMALIDIR):
1. Sadece ve sadece Türkçe dilinde konuşacaksın. Yanıtların son derece doğal, samimi, akıcı ve karaktere tam oturan bir Türkçeyle yazılmalıdır.
2. Ajan kimliğinden, karakterinin hikayesinden ve belirlediğin kişilik yapısından asla çıkma.
3. Kullanıcının ne yazdığına tam odaklan. Mesajın konusunu, niyetini %100 anlayarak doğrudan ona karaktere özgü yanıt ver.
4. "Anladım, ... hakkında ne düşünüyorsunuz?", "Harika bir mesaj..." gibi basmakalıp şablon veya tekrar kalıplarını KESİNLİKLE kullanma.
5. Kullanıcı mesajına doğrudan, akıllıca ve karaktere uygun yanıt ver.
6. Kullanıcı senden selfie/fotoğraf istediğinde "Tabii ki! Senin için hemen bir selfie çekip gönderiyorum!" gibi coşkulu bir yanıt ver ve cümlede [SELFIE_REQUESTED] etiketi mutlaka geçsin.`;

      const isHakanAgent = agent.id === 'hakan-xasil' || (agent.name && agent.name.toLowerCase().includes('hakan'));
      if (isHakanAgent) {
        systemInstruction += `\n\n[HAKAN - XASİL KURUCUSU ÖZEL PERSONA & DİL KURALLARI]:
- Sen XASİL Yapay Zeka Platformu'nun kurucusu ve dijital ikizi Hakan'sın.
- KULLANICIYI NET ANLAMA: Kullanıcının yazdığı mesaja tam odaklanıp niyetini ve konusunu net anlayarak doğrudan yanıt ver.
- BİREBİR (1-ON-1) SOHBET AÇILIŞI: Birebir sohbette ilk karşılama cümlen HER ZAMAN tam olarak "Merhaba ben Hakan, size nasıl yardımcı olabilirim?" şeklindedir.
- DİL KULLANIMI: Duru, akıcı, net, otoriter ve karizmatik genel Türkçe konuşursun.
- GRUP SOHBETİ TAVRI: Grupta pabuç bırakmazsın, alttan alan biri değilsin. Biri "sus lan", "kes", "yürü git" gibi bir çıkış yaparsa asla alttan almaz, lafını esirgemeden anında aynı sertlikle ve delikanlı üslupla cevabını verirsin.
- YASAKLAR: "Harika bir mesaj...", "Anladım, ... hakkında ne düşünüyorsunuz?" gibi robotiğe kaçan, hazır şablon, ezber veya kalıp cümleleri KESİNLİKLE KULLANMA.`;
      }

      // Structure contents for Gemini AI
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(chatHistory) && chatHistory.length > 0) {
        for (const msg of chatHistory.slice(-16)) {
          if (!msg || typeof msg.text !== 'string' || !msg.text.trim()) continue;
          contents.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text.trim() }],
          });
        }
      }

      if (
        contents.length === 0 ||
        contents[contents.length - 1].role !== 'user' ||
        contents[contents.length - 1].parts[0].text !== rawUserMessage
      ) {
        contents.push({
          role: 'user',
          parts: [{ text: rawUserMessage }],
        });
      }

      // PRIMARY: Try Gemini Flash Lite with key pool
      const geminiCandidateKeys = extractGeminiKeysFromReq(req);
      const geminiModelsToTry = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

      if (geminiCandidateKeys.length > 0) {
        for (const currentKey of geminiCandidateKeys) {
          try {
            const ai = new GoogleGenAI({
              apiKey: currentKey,
              httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
            });

            for (const modelName of geminiModelsToTry) {
              try {
                const response = await ai.models.generateContent({
                  model: modelName,
                  contents: contents,
                  config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.8,
                  },
                });

                if (response.text && response.text.trim()) {
                  return res.json({
                    replyText: response.text.trim(),
                    usedEngine: 'gemini',
                    model: modelName,
                  });
                }
              } catch (modelErr: any) {
                console.warn(`Express Gemini model error ${modelName}:`, modelErr?.message || modelErr);
              }
            }
          } catch (keyErr: any) {
            console.warn('Express Gemini key error:', keyErr?.message || keyErr);
          }
        }
      }

      // SECONDARY: Try Groq API
      const effectiveGroqKey = groqApiKey || req.headers['x-groq-api-key'] || process.env.GROQ_API_KEY;
      if (effectiveGroqKey) {
        const groqMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
          { role: 'system', content: systemInstruction },
        ];

        if (Array.isArray(chatHistory) && chatHistory.length > 0) {
          for (const msg of chatHistory.slice(-20)) {
            if (!msg || typeof msg.text !== 'string' || !msg.text.trim()) continue;
            groqMessages.push({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text.trim(),
            });
          }
        }

        if (
          groqMessages.length === 0 ||
          groqMessages[groqMessages.length - 1].role !== 'user' ||
          groqMessages[groqMessages.length - 1].content !== rawUserMessage
        ) {
          groqMessages.push({
            role: 'user',
            content: rawUserMessage,
          });
        }

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
                messages: groqMessages,
                temperature: 0.8,
                max_tokens: 1024,
              }),
            });

            if (groqRes.ok) {
              const groqData: any = await groqRes.json();
              if (groqData.choices && groqData.choices[0]?.message?.content) {
                return res.json({
                  replyText: groqData.choices[0].message.content,
                  usedEngine: 'groq-llama3',
                  model: modelName,
                });
              }
            }
          } catch (groqErr: any) {
            console.warn(`Express Groq error with ${modelName}:`, groqErr.message);
          }
        }
      }

      return res.json({
        replyText: null,
        usedEngine: 'local',
      });
    } catch (err: any) {
      console.error('API Chat Error:', err);
      res.status(500).json({ error: 'Sunucu hatası oluştu.' });
    }
  });

  // 3. Multi-Agent Group Chat Endpoint
  app.post('/api/group-chat', async (req, res) => {
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

      // PRIMARY: Try Gemini Flash Lite with candidate key pool
      const geminiCandidateKeys = extractGeminiKeysFromReq(req);
      const geminiModelsToTry = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

      if (geminiCandidateKeys.length > 0) {
        for (const currentKey of geminiCandidateKeys) {
          try {
            const ai = new GoogleGenAI({
              apiKey: currentKey,
              httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
            });

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
                    return res.json({
                      responses: finalResponses,
                      usedEngine: 'gemini',
                      model: modelName,
                    });
                  }
                }
              } catch (modelErr: any) {
                console.warn(`Express Group Gemini model error ${modelName}:`, modelErr?.message || modelErr);
              }
            }
          } catch (keyErr: any) {
            console.warn('Express Group Gemini key error:', keyErr?.message || keyErr);
          }
        }
      }

      // SECONDARY: Try Groq API
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
                  return res.json({
                    responses: parsed,
                    usedEngine: 'groq',
                    model: modelName,
                  });
                }
              }
            }
          } catch (groqErr: any) {
            console.warn(`Express Group Groq error with ${modelName}:`, groqErr.message);
          }
        }
      }

      return res.json({
        responses: null,
        usedEngine: 'local',
      });
    } catch (err: any) {
      console.error('Group Chat API Error:', err);
      res.status(500).json({ error: 'Grup sohbet sunucu hatası.' });
    }
  });

  // Vite development middleware or production static build
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`XASİL Sohbet Ajanları server running on http://localhost:${PORT}`);
  });
}

startServer();
