import React, { useState } from 'react';
import { Agent, Category, Gender } from '../types';
import { Bot, Sparkles, Image, CheckCircle, Play, UserPlus, Shield, Heart, Zap, Award, Star } from 'lucide-react';
import { saveAgent } from '../utils/storage';
import { motion, AnimatePresence } from 'motion/react';

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
  const [createdHoloAgent, setCreatedHoloAgent] = useState<Agent | null>(null);

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
    // Trigger Holographic Reveal modal!
    setCreatedHoloAgent(newAgent);
  };

  const handleLaunchChat = () => {
    if (createdHoloAgent) {
      onAgentCreated(createdHoloAgent);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12 relative"
    >
      {/* Header */}
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-[#121212] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-10 -right-10 w-72 h-72 bg-[#00D2FF] rounded-full blur-3xl pointer-events-none"
        />

        <div className="flex items-center gap-3 relative z-10">
          <div className="p-3.5 rounded-2xl bg-[#00D2FF]/10 text-[#00D2FF] border border-[#00D2FF]/30 shadow-[0_0_15px_rgba(0,210,255,0.2)]">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ajan Oluşturma Stüdyosu
            </h1>
            <p className="text-xs sm:text-sm text-[#00D2FF] font-medium">
              Kendi özel karakterini tasarla, kişiliğini belirle ve anında sinematik açılışla sohbet başlat!
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Creation Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-2 bg-[#121212] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-xl"
        >
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
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none transition-all shadow-inner"
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
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none transition-all shadow-inner"
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
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none transition-all"
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
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none transition-all"
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
                className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none transition-all shadow-inner"
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
                className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none transition-all shadow-inner"
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
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none transition-all"
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
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none transition-all"
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
                  <motion.button
                    key={idx}
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
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
                  </motion.button>
                ))}
              </div>

              <input
                type="url"
                placeholder="Veya harici bir görsel URL adresi girin (https://...)"
                value={customAvatarInput}
                onChange={(e) => setCustomAvatarInput(e.target.value)}
                className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00D2FF] focus:outline-none transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-white/10">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,210,255,0.6)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl bg-[#00D2FF] text-black font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all cursor-pointer"
              >
                <UserPlus className="w-5 h-5 stroke-[2.5]" />
                Oluştur ve Sinematik Açılışla Sohbet Et 🔥
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Live Card Preview with Smooth Scale-In */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-4"
        >
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Image className="w-5 h-5 text-[#00D2FF]" />
            Canlı Ajan Kartı Önizleme
          </h2>

          <div className="bg-[#121212] rounded-3xl border border-white/10 p-5 space-y-3 shadow-2xl sticky top-20 hover:border-[#00D2FF]/50 transition-colors">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
              <img
                src={customAvatarInput.trim() || avatarUrl}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30" />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-[#00D2FF] text-[10px] font-black text-black uppercase shadow-md">
                {category}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white">{name || 'Ajan İsmi'}</h3>
              <p className="text-xs text-[#00D2FF] font-bold">{title || 'Unvan / Rol'}</p>
            </div>

            <p className="text-xs text-gray-300 line-clamp-3 italic bg-[#050505] p-3 rounded-xl border border-white/10 leading-relaxed">
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
        </motion.div>
      </div>

      {/* Cinematic Holographic Card Reveal Modal */}
      <AnimatePresence>
        {createdHoloAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.3, rotateY: 180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotateY: -90 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-md w-full bg-[#0a0a0a] rounded-3xl p-6 sm:p-8 border-2 border-[#00D2FF] shadow-[0_0_80px_rgba(0,210,255,0.6)] text-center space-y-6 overflow-hidden"
            >
              {/* Rotating Holographic Particles & Glows */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-[#00D2FF]/20 via-transparent to-purple-600/20 animate-pulse" />
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00D2FF] rounded-full blur-3xl opacity-30 animate-spin-fast" />

              {/* Top Hologram Badge */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00D2FF]/20 border border-[#00D2FF] text-[#00D2FF] text-xs font-black tracking-widest uppercase shadow-[0_0_20px_#00D2FF]"
              >
                <Sparkles className="w-4 h-4 animate-spin-reverse" />
                HOLOGRAFİK AJAN DOĞDU
              </motion.div>

              {/* Agent Portrait Avatar in Holographic Ring */}
              <div className="relative w-36 h-36 mx-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-3 rounded-full border-2 border-dashed border-[#00D2FF] opacity-80"
                />
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="w-full h-full rounded-full overflow-hidden border-2 border-white/30 shadow-[0_0_30px_#00D2FF]"
                >
                  <img
                    src={createdHoloAgent.avatar}
                    alt={createdHoloAgent.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-1.5 rounded-full border-2 border-black shadow-md">
                  <CheckCircle className="w-5 h-5 stroke-[3]" />
                </div>
              </div>

              {/* Title & Bio Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {createdHoloAgent.name}
                </h2>
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#00D2FF]">
                  {createdHoloAgent.title}
                </p>
                <p className="text-xs text-gray-300 italic max-w-sm mx-auto leading-relaxed pt-2">
                  "{createdHoloAgent.greeting}"
                </p>
              </motion.div>

              {/* Quick Specs */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-2 bg-white/5 p-3 rounded-2xl border border-white/10 text-xs"
              >
                <div>
                  <span className="block text-[10px] text-gray-400">Kategori</span>
                  <strong className="text-white text-xs">{createdHoloAgent.category}</strong>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400">Tavır</span>
                  <strong className="text-[#00D2FF] text-xs">{createdHoloAgent.voiceTone}</strong>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400">Siber Güç</span>
                  <strong className="text-amber-400 text-xs">%{createdHoloAgent.energy}</strong>
                </div>
              </motion.div>

              {/* Action Launch Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 35px #00D2FF' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLaunchChat}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00D2FF] via-cyan-400 to-blue-600 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,210,255,0.5)] cursor-pointer"
              >
                <Play className="w-5 h-5 fill-black" />
                Sohbeti Başlat ve Siber Evrene Bağlan 🔥
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
