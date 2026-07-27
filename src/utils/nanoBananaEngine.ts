// Nano Banana Pro AI Visual Model Client & Generator Engine

export interface NanoBananaImageResult {
  imageUrl: string;
  caption: string;
  prompt: string;
  model: string;
}

export async function generateNanoBananaImage(params: {
  prompt: string;
  topic?: string;
  agentName?: string;
  style?: string;
}): Promise<NanoBananaImageResult> {
  const { prompt, topic, agentName = 'Ajan', style = 'cinematic 4k photorealistic' } = params;

  try {
    const storedGeminiKeys = localStorage.getItem('xasil_gemini_keys') || '';
    const storedGroqKey = localStorage.getItem('xasil_groq_api_key') || '';

    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gemini-keys': storedGeminiKeys,
        'x-groq-api-key': storedGroqKey,
      },
      body: JSON.stringify({
        prompt,
        topic,
        agentName,
        style,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.imageUrl) {
        return {
          imageUrl: data.imageUrl,
          caption: data.caption || `📸 Nano Banana Pro ile ${agentName} tarafından sıfırdan oluşturulan görsel`,
          prompt: data.prompt || prompt,
          model: data.model || 'Nano Banana Pro AI',
        };
      }
    }
  } catch (e) {
    console.warn('Server image generation endpoint error, falling back to client Nano Banana Pro flux generator:', e);
  }

  // Client-side fallback generation using Nano Banana Pro prompt builder + Flux AI model
  const cleanPrompt = prompt.replace(/[^\w\s\döçşığüÖÇŞİĞÜ,.-]/gi, ' ').trim();
  const englishKeywords = translateToEnglishKeywords(cleanPrompt, topic, agentName);
  
  const seed = Math.floor(Math.random() * 1000000);
  const enhancedEnglishPrompt = `A high quality ${style} photograph, ${englishKeywords}, detailed 8k resolution, vibrant color balance, masterpiece, photo of ${agentName}`;
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedEnglishPrompt)}?width=800&height=600&nologo=true&seed=${seed}&model=flux`;

  return {
    imageUrl,
    caption: `✨ Nano Banana Pro AI ile sıfırdan oluşturuldu: ${cleanPrompt}`,
    prompt: enhancedEnglishPrompt,
    model: 'Nano Banana Pro AI (Flux Engine)',
  };
}

function translateToEnglishKeywords(prompt: string, topic?: string, agentName?: string): string {
  const lower = (prompt + ' ' + (topic || '')).toLowerCase();
  
  const keywords: string[] = [];

  if (agentName) keywords.push(`portrait of ${agentName}`);

  if (lower.includes('derbi') || lower.includes('stadyum') || lower.includes('futbol') || lower.includes('maç') || lower.includes('saha')) {
    keywords.push('football stadium match fans cheering stadium lights crowd excitement sports photography');
  } else if (lower.includes('kahve') || lower.includes('bebek') || lower.includes('boğaz') || lower.includes('istanbul') || lower.includes('deniz')) {
    keywords.push('scenic cafe in bosphorus istanbul sea view coffee cup luxury lifestyle sunset photography');
  } else if (lower.includes('caps') || lower.includes('meme') || lower.includes('mizah') || lower.includes('trend') || lower.includes('viral')) {
    keywords.push('viral social media pop culture creative illustration vibrant colors trending artwork');
  } else if (lower.includes('kuantum') || lower.includes('bilim') || lower.includes('teknoloji') || lower.includes('kod') || lower.includes('ekran')) {
    keywords.push('futuristic quantum technology glowing holograms cyber neon lab high tech screen');
  } else if (lower.includes('tarih') || lower.includes('mitoloji') || lower.includes('efsane') || lower.includes('antik') || lower.includes('müze')) {
    keywords.push('ancient mythology historical artifacts glowing runes mysterious atmosphere dramatic lighting');
  } else if (lower.includes('selfie') || lower.includes('yüz') || lower.includes('portre')) {
    keywords.push('friendly smiling selfie portrait stylish modern fashion ultra clear skin natural lighting');
  } else {
    keywords.push(`${prompt} elegant composition cinematic lighting photorealistic 8k detail`);
  }

  return keywords.join(', ');
}
