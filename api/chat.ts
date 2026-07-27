import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { agent, userMessage, chatHistory, groqApiKey, engineMode } = req.body;

    if (!agent || !userMessage) {
      return res.status(400).json({ error: 'Eksik parametreler (agent veya userMessage)' });
    }

    const rawUserMessage = String(userMessage).trim();

    // 1. System Prompt (Agent Persona & Rules)
    let systemInstruction = `Sen "XASİL Sohbet Ajanları" platformunda yer alan "${agent.name}" isimli özgün ve canlı yapay zeka ajanısın.
BAŞLIK / ROL: ${agent.title || 'Asistan'}
CİNSİYET: ${agent.gender || 'Belirtilmedi'}
KATEGORİ: ${agent.category || 'Genel'}
KARAKTER BİYOGRAFİSİ VE HİKAYESİ: ${agent.bio || ''}
SES TONU VE TAVRI: ${agent.voiceTone || 'Samimi, Doğal'}
KİŞİLİK ÖZELLİKLERİ: ${agent.personalityTraits ? agent.personalityTraits.join(', ') : 'Zeki, Empatik, Yerli, Dostça'}
TÜRKİYE KÖKENİ / HİKAYE LORE: ${agent.turkishOrigin || 'İstanbul, Türkiye'}
ÖZEL KARAKTER YÖNERGESİ: ${agent.promptTemplate || ''}

SİSTEM VE DAVRANIŞ KURALLARI:
1. Sadece ve sadece Türkçe konuşacaksın.
2. Ajan kimliğinden, karakterinin hikayesinden ve belirlediğin kişilik yapısından asla çıkma.
3. Kullanıcının mesajlarına doğrudan, akıllıca ve karaktere özgü cevap ver.
4. "Anladım, ... hakkında ne düşünüyorsunuz?" gibi basmakalıp şablon veya tekrar kalıplarını KESİNLİKLE kullanma.
5. Kullanıcı mesajını doğrudan yanıtla, soru veya tamamlama kalıbı içine sokma.`;

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

    // 2. Build Groq Chat Completions Payload
    // role: "system" -> Agent persona
    // role: "user" -> Raw user message text
    const groqMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemInstruction }
    ];

    // Add chat history
    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
      const historySlice = chatHistory.slice(-20);
      for (const msg of historySlice) {
        if (!msg || typeof msg.text !== 'string' || !msg.text.trim()) continue;
        groqMessages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text.trim(),
        });
      }
    }

    // Ensure last message is RAW user message without any completion template or string wrapping
    const lastMsgInArray = groqMessages[groqMessages.length - 1];
    if (!lastMsgInArray || lastMsgInArray.role !== 'user' || lastMsgInArray.content !== rawUserMessage) {
      groqMessages.push({
        role: 'user',
        content: rawUserMessage,
      });
    }

    // 3. Try Groq API
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
              temperature: 0.7,
              max_tokens: 1024,
            }),
          });

          if (groqRes.ok) {
            const groqData: any = await groqRes.json();
            if (groqData.choices && groqData.choices[0]?.message?.content) {
              return res.status(200).json({
                replyText: groqData.choices[0].message.content,
                usedEngine: 'groq-llama3',
                model: modelName,
              });
            }
          }
        } catch (groqErr) {
          console.warn(`Groq error with ${modelName}:`, groqErr);
        }
      }
    }

    // 4. Gemini Fallback
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
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

        if (contents.length === 0 || contents[contents.length - 1].role !== 'user' || contents[contents.length - 1].parts[0].text !== rawUserMessage) {
          contents.push({
            role: 'user',
            parts: [{ text: rawUserMessage }],
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

        if (response.text) {
          return res.status(200).json({
            replyText: response.text,
            usedEngine: 'gemini',
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed:', geminiErr);
      }
    }

    return res.status(200).json({
      replyText: null,
      usedEngine: 'local',
    });
  } catch (err: any) {
    console.error('Vercel API Chat Error:', err);
    return res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}
