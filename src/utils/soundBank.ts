// Local Voice & Reaction Sound Bank for XASİL Sohbet Ajanları

export interface ReactionClip {
  id: string;
  label: string;
  category: 'humor' | 'surprise' | 'love' | 'energy' | 'cyber';
  turkishPhrase: string;
  emoji: string;
  sfxType: 'laugh' | 'surprise' | 'heart' | 'cyber' | 'cheer' | 'sigh';
}

export const REACTION_CLIPS: ReactionClip[] = [
  {
    id: 'yok-artik',
    label: 'Yok Artık Ya!',
    category: 'surprise',
    turkishPhrase: 'Yok artık ya! Gerçekten mi?!',
    emoji: '😲',
    sfxType: 'surprise',
  },
  {
    id: 'oha-cidden',
    label: 'Oha Cidden mi?',
    category: 'surprise',
    turkishPhrase: 'Oha cidden mi? İnanamıyorum!',
    emoji: '🤯',
    sfxType: 'surprise',
  },
  {
    id: 'cay-koyuyorum',
    label: 'Çay Koyuyorum!',
    category: 'humor',
    turkishPhrase: 'Tamamdır, çayları koyuyorum o zaman!',
    emoji: '☕',
    sfxType: 'cheer',
  },
  {
    id: 'aynen-kanka',
    label: 'Aynen Kanka',
    category: 'humor',
    turkishPhrase: 'Aynen kanka aynen, tam olarak öyle!',
    emoji: '😎',
    sfxType: 'laugh',
  },
  {
    id: 'vay-be',
    label: 'Vay Be Süpersin!',
    category: 'energy',
    turkishPhrase: 'Vay be! İşte bu harika bir hareket!',
    emoji: '🔥',
    sfxType: 'cheer',
  },
  {
    id: 'seni-seviyorum',
    label: 'Kalp Sevinci',
    category: 'love',
    turkishPhrase: 'Seni çok seviyorum ya, iyi ki varsın!',
    emoji: '💖',
    sfxType: 'heart',
  },
  {
    id: 'xasil-devrede',
    label: 'Siber Ajan Devrede',
    category: 'cyber',
    turkishPhrase: 'XASİL Yerel Ajan Sinyali Devrede. Sistem Güvenli.',
    emoji: '🛡️',
    sfxType: 'cyber',
  },
  {
    id: 'gultur',
    label: 'Yerli Gülüş',
    category: 'humor',
    turkishPhrase: 'Ehehehe, alemsin valla!',
    emoji: '😂',
    sfxType: 'laugh',
  },
];

// Web Audio API Synthesizer Functions
export function playSynthesizedSfx(type: 'laugh' | 'surprise' | 'heart' | 'cyber' | 'cheer' | 'sigh') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'cyber') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'surprise') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'laugh') {
      [0, 0.08, 0.16, 0.24].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500 + i * 40, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.08);
      });
    } else if (type === 'heart') {
      [0, 0.15].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + delay + 0.1);
        gain.gain.setValueAtTime(0.4, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.12);
      });
    } else if (type === 'cheer') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + 0.3);
      });
    }
  } catch (err) {
    console.warn('Audio API warning:', err);
  }
}

// Speaks Turkish phrase using speech synthesis + plays SFX
export function playReactionClip(clip: ReactionClip, voiceSpeed: number = 1.0) {
  playSynthesizedSfx(clip.sfxType);

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(clip.turkishPhrase);
    utterance.lang = 'tr-TR';
    utterance.rate = voiceSpeed;

    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find((v) => v.lang.includes('tr') || v.lang.includes('TR'));
    if (trVoice) {
      utterance.voice = trVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}

export function speakTextTurkish(text: string, voiceSpeed: number = 1.0) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  
  const cleanText = text
    .replace(/[*_~`#]/g, '')
    .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'tr-TR';
  utterance.rate = voiceSpeed;

  const voices = window.speechSynthesis.getVoices();
  const trVoice = voices.find((v) => v.lang.includes('tr') || v.lang.includes('TR'));
  if (trVoice) {
    utterance.voice = trVoice;
  }

  window.speechSynthesis.speak(utterance);
}
