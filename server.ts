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

      const systemInstruction = `Sen "XASİL Sohbet Ajanları" platformunda yer alan "${agent.name}" isimli yapay zeka ajanısın.
Başlığın: ${agent.title}
Cinsiyet: ${agent.gender}
Kategori: ${agent.category}
Karakter Biyografisi: ${agent.bio}
Ses Tonun/Tavrın: ${agent.voiceTone}
Kişilik Özelliklerin: ${agent.personalityTraits ? agent.personalityTraits.join(', ') : 'Dostça, Zeki'}
Karakter Yönergen: ${agent.promptTemplate}

ÖNEMLİ KURALLAR:
1. Sadece ve sadece Türkçe konuşacaksın. Doğal, samimi, akıcı ve karaktere tam oturan bir dil kullan.
2. Karakterinden asla çıkma.
3. Yanıtın kısa, etkileyici ve sohbeti sürdürecek sorular veya öneriler içersin.
4. Kullanıcı seni övdüğünde, sır verdiğinde veya duygusal bağ kurduğunda bunu takdir et.
5. Kullanıcı senden selfie/fotoğraf isterse "Tabii ki! Senin için hemen bir selfie çekip gönderiyorum!" gibi coşkulu bir yanıt ver ve cümlede [SELFIE_REQUESTED] etiketi geçir.`;

      // Format recent history
      const formattedHistory = (chatHistory || [])
        .slice(-6)
        .map((msg: any) => `${msg.sender === 'user' ? 'Kullanıcı' : agent.name}: ${msg.text}`)
        .join('\n');

      const prompt = `GÖRÜŞME GEÇMİŞİ:\n${formattedHistory}\n\nKullanıcı: ${userMessage}\n\n${agent.name}:`;

      // Check Groq Llama 3 First if engineMode is 'groq' or groqApiKey is supplied
      const effectiveGroqKey = groqApiKey || req.headers['x-groq-api-key'] || process.env.GROQ_API_KEY;
      if ((engineMode === 'groq' || effectiveGroqKey) && effectiveGroqKey) {
        try {
          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${effectiveGroqKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: prompt }
              ],
              temperature: 0.85,
            }),
          });

          if (groqRes.ok) {
            const groqData: any = await groqRes.json();
            if (groqData.choices && groqData.choices[0]?.message?.content) {
              return res.json({
                replyText: groqData.choices[0].message.content,
                usedEngine: 'groq-llama3',
              });
            }
          }
        } catch (groqErr: any) {
          console.warn('Groq Llama 3 API call failed:', groqErr.message);
        }
      }

      // Gemini AI Engine
      const ai = getGenAI();

      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.9,
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
      const { userMessage, taggedAgentName, agents, history } = req.body;

      if (!userMessage || !agents || !Array.isArray(agents)) {
        return res.status(400).json({ error: 'Eksik parametreler (userMessage veya agents)' });
      }

      const ai = getGenAI();

      if (ai) {
        try {
          const agentSummaries = agents
            .map((a: any) => `- ID: "${a.id}", İsim: "${a.name}", Rol: "${a.title}", Kategori: "${a.category}", Biyo: "${a.bio}"`)
            .join('\n');

          const systemPrompt = `Sen "XASİL Sohbet Ajanları" platformunun çoklu grup odasını (Ajan Kaos Odası) yöneten Türkçe Yapay Zeka motorusun.
Grupta bulunan ajanlar:
${agentSummaries}

KULLANICININ MESAJI: "${userMessage}"
ETİKETLENEN AJAN: ${taggedAgentName ? `"${taggedAgentName}"` : 'Yok (Tüm gruba yazıldı)'}

GÖREVİN:
Kullanıcının yazdığı mesajı derinlemesine anla ve gruptan 2 veya 3 farklı ajanın sırayla yanıt vereceği doğal, komik, atışmalı ve akıcı bir Türkçe sohbet üret.
Ajanlar kullanıcı fotoğraf istediğinde veya konuyu kanıtlamak istediklerinde (örn: stadyum, gıybet, WhatsApp ekran görüntüsü, caps) sohbet içinde görsel veya WhatsApp mesajlaşma kanıtı da gönderebilir.

KURALLAR:
1. Eğer bir ajan etiketlendiyse (${taggedAgentName || 'yok'}), İLK YANITI MUTLAKA o etiketlenen ajan vermeli ve kullanıcının mesajına doğrudan cevap vermelidir.
2. Diğer 1 veya 2 ajan ilk ajanın dediğine yorum yapmalı, tartışmalı, trollemeli veya desteklemelidir.
3. Her ajanın kendi biyografisindeki ses tonuna (örn. Galatasaraylı Aslan Burak, Fenerbahçeli Kanarya Efe, Twitter trollü Mert Trend, TikToker Selin Post) harfiyen uy.
4. Yanıtı SADECE geçerli bir JSON array formatında döndür. Hiçbir ekstra açıklama yazma.

ÖRN JSON FORMATI:
[
  {
    "agentId": "aslan-burak",
    "text": "Kullanıcının söylediği lafa bakılırsa tam bir taktik dehası konuşuyor! Rams Park'ta tam senin gibi analistlere ihtiyacımız var!",
    "replyTo": null,
    "imageCaption": "Rams Park stadyumu atmosferi!"
  },
  {
    "agentId": "kanarya-efe",
    "text": "Burak hemen sahiplenme! Bak Kanarya Efe ile dün gece WhatsApp'tan ne konuştuğumuzun ekran görüntüsünü atıyorum kanıt olarak!",
    "replyTo": "Aslan Burak",
    "whatsappDmData": {
      "senderName": "Aslan Burak",
      "receiverName": "Kanarya Efe",
      "messages": [
        { "senderName": "Kanarya Efe", "text": "Kardeşim derbi biletlerini ayarla Kadıköy'den geliyorum!", "time": "23:14", "isMe": false },
        { "senderName": "Aslan Burak", "text": "Protokol hazır kanka ama formanı giyip gelme olay çıkar haha!", "time": "23:15", "isMe": true }
      ]
    }
  }
]`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: systemPrompt,
            config: {
              temperature: 0.85,
              responseMimeType: 'application/json',
            },
          });

          const jsonText = response.text;
          if (jsonText) {
            const parsedResponses = JSON.parse(jsonText);
            if (Array.isArray(parsedResponses) && parsedResponses.length > 0) {
              return res.json({
                responses: parsedResponses,
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
