import { GoogleGenAI } from '@google/genai';
import { getStoredServerKeys } from './keys';

function extractGeminiKeys(req: any): string[] {
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

  try {
    const stored = getStoredServerKeys();
    for (const k of stored) {
      if (k && !keys.includes(k)) keys.push(k);
    }
  } catch (e) {}

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
  return validKeys.sort(() => Math.random() - 0.5);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, topic, agentName, style } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt parametresi zorunludur' });
    }

    const geminiCandidateKeys = extractGeminiKeys(req);
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
                return res.status(200).json({
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

    // Fallback: Pollinations Flux Engine for dynamic high quality visual generation
    const seed = Math.floor(Math.random() * 1000000);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=800&height=600&nologo=true&seed=${seed}&model=flux`;

    return res.status(200).json({
      imageUrl: pollinationsUrl,
      caption: caption,
      prompt: enhancedPrompt,
      model: 'Nano Banana Pro AI (Flux Engine)',
    });
  } catch (err: any) {
    console.error('API Generate Image Error:', err);
    return res.status(500).json({ error: 'Görsel üretme sunucu hatası.' });
  }
}
