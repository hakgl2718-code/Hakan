import React, { useState } from 'react';
import { Agent, Category, Gender } from '../types';
import { Bot, Sparkles, Image, CheckCircle, Play, UserPlus, Shield, Heart } from 'lucide-react';
import { saveAgent } from '../utils/storage';

interface AgentStudioProps {
  onAgentCreated: (newAgent: Agent) => void;
}

const PRESET_AVATARS = [
  { label: 'Cyberpunk Girl', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80' },
  { label: 'Dark Wizard', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80' },
  { label: 'Sci-Fi Scientist', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80' },
  { label: 'Romantic Musician', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80' },
  { label: 'Ocean Explorer', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80' },
  { label: 'Shadow Detective', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80' },
  { label: 'Anime Idol', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80' },
];

export const AgentStudio: React.FC<AgentStudioProps> = ({ onAgentCreated }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [gender, setGender] = useState<Gender>('Kadın');
  const [category, setCategory] = useState<Category>('Anime');
  const [bio, setBio] = useState('');
  const [greeting, setGreeting] = useState('');
  const [voiceTone, setVoiceTone] = useState('Neşeli ve Enerjik');
  const [traitsText, setTraitsText] = useState('Zeki, Cesur, Eğlenceli');
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0].url);
  const [customAvatarInput, setCustomAvatarInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim() || !bio.trim() || !greeting.trim()) {
      alert('Lütfen tüm gerekli alanları doldurunuz.');
      return;
    }

    const traits = traitsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newAgent: Agent = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      title: title.trim(),
      avatar: customAvatarInput.trim() || avatarUrl,
      gender,
      category,
      bio: bio.trim(),
      greeting: greeting.trim(),
      personalityTraits: traits.length > 0 ? traits : ['Akıllı', 'Dost Canlısı'],
      voiceTone,
      relationshipLevel: 10,
      relationshipTitle: 'Yeni Tanışılan Ajan',
      xp: 100,
      totalMessages: 0,
      isOnline: true,
      isCustom: true,
      createdAt: new Date().toISOString().split('T')[0],
      promptTemplate: `Sen ${name} adında ${category} evreninden gelen bir ajansın. Başlığın: ${title}. ${bio}`,
      keyFacts: [`${name} seni kendi stüdyosunda bizzat tasarladı.`],
      selfieStyle: `${name} özel stüdyo fotoğrafı`,
      rating: 5.0,
      talkCount: 1,
      energy: 90,
      happiness: 85,
      bond: 50,
      mood: 'Heyecanlı',
      moodEmoji: '⚡',
      turkishOrigin: 'Özel Stüdyo Tasarımı',
    };

    saveAgent(newAgent);
    onAgentCreated(newAgent);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-[#121212] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#00D2FF]/10 text-[#00D2FF] border border-[#00D2FF]/30">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Ajan Oluşturma Stüdyosu
            </h1>
            <p className="text-xs sm:text-sm text-[#00D2FF] font-medium">
              Kendi özel karakterini tasarla, kişiliğini belirle ve anında yerel modelle sohbet başlat!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Creation Form */}
        <div className="lg:col-span-2 bg-[#121212] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Sparkles className="w-5 h-5 text-[#00D2FF]" />
            Karakter Kimlik ve Kişilik Özellikleri
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Ajan İsim *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Melis Soylu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Unvan / Rol *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Kuantum Siber Analisti"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none"
                />
              </div>
            </div>

            {/* Gender & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Cinsiyet
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none"
                >
                  <option value="Kadın">Kadın</option>
                  <option value="Erkek">Erkek</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Robotik/Fantastik">Robotik/Fantastik</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none"
                >
                  <option value="Anime">Anime</option>
                  <option value="Fantastik">Fantastik</option>
                  <option value="Bilim Kurgu">Bilim Kurgu</option>
                  <option value="Romantik">Romantik</option>
                  <option value="Macera">Macera</option>
                  <option value="Gizem/Korku">Gizem/Korku</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Karakter Biyografisi ve Hikayesi *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Ajanın geçmişi, hedefleri ve dünyası hakkındaki kısa özet..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none"
              />
            </div>

            {/* Greeting */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                İlk Karşılama Cümlesi *
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Selam dostum! Kodları hazırladım, hazır mısın?"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none"
              />
            </div>

            {/* Voice Tone & Traits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Ses Tonu / Tavır
                </label>
                <input
                  type="text"
                  placeholder="Örn: Neşeli ve Enerjik"
                  value={voiceTone}
                  onChange={(e) => setVoiceTone(e.target.value)}
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Kişilik Etiketleri (Virgülle ayırın)
                </label>
                <input
                  type="text"
                  placeholder="Zeki, Esprili, Cesur"
                  value={traitsText}
                  onChange={(e) => setTraitsText(e.target.value)}
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none"
                />
              </div>
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2">
                Avatar Görsel Seçimi
              </label>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-3">
                {PRESET_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(preset.url);
                      setCustomAvatarInput('');
                    }}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      avatarUrl === preset.url && !customAvatarInput
                        ? 'border-[#00D2FF] ring-2 ring-[#00D2FF]/50 scale-105'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <input
                type="url"
                placeholder="Veya harici bir görsel URL adresi girin (https://...)"
                value={customAvatarInput}
                onChange={(e) => setCustomAvatarInput(e.target.value)}
                className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#00D2FF] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:scale-[1.01] transition-all cursor-pointer"
              >
                <UserPlus className="w-5 h-5 stroke-[2.5]" />
                Ajanı Oluştur ve Hemen Sohbete Başla
              </button>
            </div>
          </form>
        </div>

        {/* Live Card Preview */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Image className="w-5 h-5 text-[#00D2FF]" />
            Canlı Ajan Kartı Önizleme
          </h2>

          <div className="bg-[#121212] rounded-3xl border border-white/10 p-5 space-y-3 shadow-2xl sticky top-20">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
              <img
                src={customAvatarInput.trim() || avatarUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30" />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-[#00D2FF] text-[10px] font-bold text-black uppercase">
                {category}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white">{name || 'Ajan İsmi'}</h3>
              <p className="text-xs text-[#00D2FF] font-medium">{title || 'Unvan / Rol'}</p>
            </div>

            <p className="text-xs text-gray-300 line-clamp-3 italic bg-[#050505] p-3 rounded-xl border border-white/10">
              "{greeting || 'İlk karşılama cümlesi burada görünecektir...'}"
            </p>

            <div className="flex flex-wrap gap-1">
              {traitsText.split(',').map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[10px] font-medium border border-white/5"
                >
                  #{t.trim() || 'Özellik'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
