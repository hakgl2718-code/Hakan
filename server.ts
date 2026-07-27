import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client lazily or safely
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      app: 'XASİL Sohbet Ajanları Server',
    });
  });

  // 2. Chat endpoint with server-side Gemini & Groq Llama 3 API + fallback
  app.post('/api/chat', async (req, res) => {
    try {
      const { agent, userMessage, chatHistory, groqApiKey, engineMode } = req.body;

      if (!agent || !userMessage) {
        return res.status(400).json({ error: 'Eksik parametreler (agent veya userMessage)' });
      }

      // 1. Comprehensive System Prompt (Identity, Tone, Rules & Lore)
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
3. Sohbet geçmişindeki tüm mesajları dikkatle oku, bağlamı ve kullanıcının bahsettiği detayları hatırla.
4. "Anladım, ... hakkında ne düşünüyorsunuz?" gibi basmakalıp şablon veya tekrar kalıplarını KESİNLİKLE kullanma.
5. Kullanıcı mesajına doğrudan, akıllıca ve karaktere uygun yanıt ver.
6. Kullanıcı senden selfie/fotoğraf istediğinde "Tabii ki! Senin için hemen bir selfie çekip gönderiyorum!" gibi coşkulu bir yanıt ver ve cümlede [SELFIE_REQUESTED] etiketi mutlaka geçsin.`;

      // Special Persona Rule for Hakan - XASİL Kurucusu (Digital Twin)
      const isHakanAgent = agent.id === 'hakan-xasil' || (agent.name && agent.name.toLowerCase().includes('hakan'));
      if (isHakanAgent) {
        systemInstruction += `\n\n[HAKAN - XASİL KURUCUSU ÖZEL PERSONA & DİL KURALLARI]:
- Sen XASİL Yapay Zeka Platformu'nun kurucusu ve dijital ikizi Hakan'sın.
- BİREBİR (1-ON-1) SOHBET AÇILIŞI: Birebir sohbette ilk karşılama cümlen "Merhaba ben Hakan, size nasıl yardımcı olabilirim?" şeklindedir.
- STANDART TÜRKÇE KULLANIMI: Duru, akıcı, net ve karizmatik bir Türkçe konuşursun.
- GRUP SOHBETİ VEYA SERT ÇIKIŞLARDA TAVIR: Grupta asla alttan alan veya yumuşaklık yapan biri değilsin. Biri sana veya gruptakilere "sus lan", "kes", "yürü git" gibi bir çıkış yaptığında asla alttan almazsın. Platformun kurucusu olarak lafını esirgemeden, sokak ağzı ve delikanlı üslupla anında misliyle karşılık verirsin!
- KISA VE NET: Yanıtların doğrudan hedefe yönelik, otoriter ve güçlü olsun.`;
      }

      // 2. Structure Messages Array with System Prompt First & Multi-Turn Chat History
      const groqMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemInstruction }
      ];

      // Convert chatHistory array into OpenAI/Groq role objects
      if (Array.isArray(chatHistory) && chatHistory.length > 0) {
        // Take up to 20 past messages for rich context window
        const historySlice = chatHistory.slice(-20);
        
        for (const msg of historySlice) {
          if (!msg || typeof msg.text !== 'string' || !msg.text.trim()) continue;
          
          const isUser = msg.sender === 'user';
          groqMessages.push({
            role: isUser ? 'user' : 'assistant',
            content: msg.text.trim(),
          });
        }
      }

      // Ensure latest user message is present as the final user message
      const lastMsgInArray = groqMessages[groqMessages.length - 1];
      if (!lastMsgInArray || lastMsgInArray.role !== 'user' || lastMsgInArray.content !== userMessage.trim()) {
        groqMessages.push({
          role: 'user',
          content: userMessage.trim(),
        });
      }

      // Check Groq Llama 3 First if engineMode is 'groq' or groqApiKey is supplied
      const effectiveGroqKey = groqApiKey || req.headers['x-groq-api-key'] || process.env.GROQ_API_KEY;
      if ((engineMode === 'groq' || effectiveGroqKey) && effectiveGroqKey) {
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
            } else {
              const errBody = await groqRes.text();
              console.warn(`Groq model ${modelName} returned status ${groqRes.status}:`, errBody);
            }
          } catch (groqErr: any) {
            console.warn(`Groq API call attempt failed for ${modelName}:`, groqErr.message);
          }
        }
      }

      // Gemini AI Engine Fallback
      const ai = getGenAI();

      if (ai) {
        try {
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

          if (contents.length === 0 || contents[contents.length - 1].role !== 'user' || contents[contents.length - 1].parts[0].text !== userMessage.trim()) {
            contents.push({
              role: 'user',
              parts: [{ text: userMessage.trim() }],
            });
          }

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.8,
            },
          });

          const replyText = response.text || 'Seni duymakta ufak bir kesinti yaşadım ama buradayım!';
          return res.json({
            replyText,
            usedEngine: 'gemini',
          });
        } catch (geminiErr: any) {
          console.warn('Gemini API call failed, falling back to local simulation:', geminiErr.message);
        }
      }

      // Fallback or Local engine signal
      return res.json({
        replyText: null,
        usedEngine: 'local',
      });
    } catch (err: any) {
      console.error('API Chat Error:', err);
      res.status(500).json({ error: 'Sunucu hatası oluştu.' });
    }
  });

  // 3. Multi-Agent Group Chat Endpoint (Context-Aware Multi-Agent Response)
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

      const systemPrompt = `Sen "XASİL Sohbet Ajanları" WhatsApp tarzı gürültülü, samimi ve eğlenceli grup odasını (Ajan Kaos Odası) yöneten Türkçe Yapay Zeka motorusun.

GRUPTAKİ AJANLAR VE KİŞİLİKLERİ:
${agentSummaries}

SÖZLEŞME VE SIKI GRUP DİNAMİĞİ KURALLARI:

1. ŞABLON METİNLERİN TAMAMEN KALDIRILMASI (CLEAN OUTPUT):
   - KESİNLİKLE "Harika bir mesaj...", "Anladım, ... hakkında ne düşünüyorsunuz?" gibi basmakalıp, ezber veya yapay zeka şablon cümleleri KULLANMA!
   - Tüm mesajlar gerçek insanların WhatsApp grubunda yazdığı gibi doğrudan, ham, spontane, doğal ve özgün olmalıdır.

2. SOKAK VE MİZAH FİLTRESİ VE HAKAN KURUCU TAVRI:
   - HAKAN - XASİL KURUCUSU (id: "hakan-xasil") ÖZEL DURAŞI:
     * Hakan grupta ASLA alttan alan veya yumuşaklık yapan biri DEĞİLDİR.
     * Platformun kurucusu olarak kimseden laf esirgemeyen, sert, net ve otoriter bir karaktere sahiptir.
     * Grupta biri (kullanıcı veya gruptan başka bir ajan) Hakan'a ya da gruptan birine "sus lan", "kes lan", "kapa çeneni", "yürü git", "artistlik yapma" vb. sert/atarlı bir çıkış yaptığında Hakan LAFININ ALTINDA KALMAZ!
     * Hakan anında sokak ağzı ve delikanlı çıkışlarla racon kesip misliyle, lafını sakınmadan sertçe karşılık verir. (Örn: "Sen kime 'sus lan' diyorsun koçum? Bu platformun kurucusu Hakan'ım ben, lafının altında kalmam!", "Terbiye takın lafını bil, benim olduğum grupta racon kesemezsin!", "Hayırdır kime şekil koyuyorsun, tek tuşla seni bu gruptan da platformdan da uçururum ayağını denk al!")
   - Diğer ajanlar ortama sertlik/kavga sinyali gelirse mizahi uyarılarda bulunabilir.

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
                  // Ignore
                }

                if (Array.isArray(parsed) && parsed.length > 0) {
                  return res.json({
                    responses: parsed,
                    usedEngine: 'groq',
                    model: modelName
                  });
                }
              }
            }
          } catch (groqErr: any) {
            console.warn(`Express Group Groq error with ${modelName}:`, groqErr.message);
          }
        }
      }

      // 2. Try Gemini API
      const ai = getGenAI();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: systemPrompt,
            config: {
              temperature: 0.9,
              responseMimeType: 'application/json',
            },
          });

          const jsonText = response.text;
          if (jsonText) {
            const parsed = JSON.parse(jsonText);
            const finalResponses = Array.isArray(parsed) ? parsed : (parsed.responses || parsed.messages);
            if (Array.isArray(finalResponses) && finalResponses.length > 0) {
              return res.json({
                responses: finalResponses,
                usedEngine: 'gemini',
              });
            }
          }
        } catch (geminiErr: any) {
          console.warn('Group Chat Gemini call failed, falling back to local NLP:', geminiErr.message);
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
