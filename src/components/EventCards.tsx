import React, { useState } from 'react';
import { EventScenario, Agent } from '../types';
import { INITIAL_EVENTS } from '../data/initialEvents';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Play,
  Flame,
  Trophy,
  Compass,
  Search,
  MapPin,
  Maximize2,
  X,
  Tag,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Camera,
  Layers,
} from 'lucide-react';

interface EventCardsProps {
  agents: Agent[];
  onStartScenario: (agent: Agent, startingPrompt: string) => void;
  accentHex?: string;
}

const CATEGORIES = [
  'Tümü',
  'Futbol/Spor',
  'Sosyal Medya/Mizah',
  'Gizem/Korku',
  'Bilim Kurgu',
  'Fantastik',
  'Romantik',
  'Macera',
  'Anime',
];

export const EventCards: React.FC<EventCardsProps> = ({
  agents,
  onStartScenario,
  accentHex = '#00D2FF',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title: string;
    location: string;
    agentName: string;
    caption?: string;
  } | null>(null);

  const handleLaunch = (event: EventScenario) => {
    // Find matching agent or use default
    const matchingAgent =
      agents.find((a) => a.name === event.agentName || a.name.includes(event.agentName.split(' ')[0])) || agents[0];
    onStartScenario(matchingAgent, event.startingPrompt);
  };

  const filteredEvents = INITIAL_EVENTS.filter((ev) => {
    const matchesCategory = selectedCategory === 'Tümü' || ev.category === selectedCategory;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-[#121212] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 relative z-10">
          <div
            className="p-3.5 rounded-2xl bg-white/5 text-white border border-white/10 shrink-0"
            style={{ borderColor: `${accentHex}40` }}
          >
            <Sparkles className="w-8 h-8" style={{ color: accentHex }} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Özel Temalı Etkinlik Kartları & Senaryolar
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {INITIAL_EVENTS.length} Canlı Senaryo
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              4K Gerçekçi İstanbul, Derbi, Siber & Mitolojik mekan fotoğrafları ve albüm galerileri eşliğinde interaktif senaryolar
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative z-10 w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Senaryo, mekan veya ajan ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#050505] text-white text-xs rounded-2xl pl-10 pr-4 py-3 border border-white/10 focus:outline-none focus:border-white/30 transition-all placeholder-gray-500"
          />
        </div>
      </div>

      {/* Category Filter Horizontal Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-white text-black shadow-lg scale-105'
                : 'bg-white/5 text-gray-400 border border-white/5 hover:border-white/20 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scenario Cards Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -20 }}
              transition={{
                duration: 0.45,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.25 },
              }}
              className="group bg-[#121212] rounded-3xl border border-white/10 hover:border-[#00D2FF]/50 p-5 space-y-4 transition-colors duration-300 shadow-xl overflow-hidden flex flex-col justify-between"
            >
            <div className="space-y-4">
              {/* Main Banner Image with Fullscreen Zoom Trigger */}
              <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group/img">
                <img
                  src={event.bannerImage}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-amber-300 text-[10px] font-extrabold border border-amber-500/40 uppercase">
                    {event.category}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg backdrop-blur-md text-[10px] font-extrabold border ${
                      event.difficulty === 'Efsanevi'
                        ? 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                        : event.difficulty === 'Zor'
                        ? 'bg-amber-950/90 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    🔥 {event.difficulty}
                  </span>
                </div>

                {/* Lightbox Zoom Icon Button */}
                <button
                  onClick={() =>
                    setLightboxImage({
                      url: event.bannerImage,
                      title: event.title,
                      location: event.location,
                      agentName: event.agentName,
                      caption: event.subtitle,
                    })
                  }
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 opacity-0 group-hover/img:opacity-100 transition-all cursor-pointer"
                  title="Fotoğrafı Tam Ekran İncele"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Location & Guide Agent Label */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 bg-black/85 p-2 rounded-xl backdrop-blur-md border border-white/15">
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={event.agentAvatar}
                      alt={event.agentName}
                      className="w-6 h-6 rounded-md object-cover border border-amber-400 shrink-0"
                      onError={(e) => {
                        const fallback = event.agentName.toLowerCase().includes('hakan')
                          ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80'
                          : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80';
                        (e.target as HTMLImageElement).src = fallback;
                      }}
                    />
                    <span className="text-[11px] font-bold text-white truncate">{event.agentName}</span>
                  </div>
                  <span className="text-[10px] text-gray-300 font-medium flex items-center gap-1 shrink-0 bg-white/10 px-2 py-0.5 rounded-md">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {event.location.split(',')[0]}
                  </span>
                </div>
              </div>

              {/* Title & Info */}
              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {event.title}
                </h3>
                <p className="text-xs font-semibold" style={{ color: accentHex }}>
                  {event.subtitle}
                </p>
                <p className="text-xs text-gray-300 leading-relaxed bg-[#050505] p-3 rounded-2xl border border-white/10">
                  {event.description}
                </p>
              </div>

              {/* Photo Gallery Thumbnails (If Available) */}
              {event.galleryImages && event.galleryImages.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                    <Camera className="w-3 h-3 text-amber-400" />
                    Gerçekçi Mekan Fotoğraf Galerisi ({event.galleryImages.length})
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {event.galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          setLightboxImage({
                            url: img.url,
                            title: `${event.title} - ${img.tag || 'Fotoğraf'}`,
                            location: event.location,
                            agentName: event.agentName,
                            caption: img.caption,
                          })
                        }
                        className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 hover:border-amber-400/80 transition-all cursor-pointer group/thumb"
                      >
                        <img
                          src={img.url}
                          alt={img.caption}
                          className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover/thumb:bg-transparent transition-colors" />
                        <span className="absolute bottom-1 left-1 right-1 text-[8px] font-bold text-white bg-black/80 px-1 py-0.5 rounded truncate text-center">
                          {img.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reward & Stats Ribbon */}
              <div className="flex items-center justify-between text-[11px] bg-[#050505] p-2.5 rounded-xl border border-white/10">
                <span className="text-amber-300 font-extrabold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Ödül: {event.rewardBadge || 'Müttefiklik Mührü'}
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-emerald-400" />
                  +{event.rewardXp || 400} XP
                </span>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-1.5">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[10px] font-semibold border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Launch Action Button */}
            <div className="pt-3 border-t border-white/10">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleLaunch(event)}
                className="w-full py-3 rounded-2xl text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                style={{ backgroundColor: accentHex, boxShadow: `0 0 15px ${accentHex}40` }}
              >
                <Play className="w-4 h-4 fill-black" />
                Senaryoyu Başlat ({event.agentName.split(' ')[0]} ile)
              </motion.button>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>

        {filteredEvents.length === 0 && (
          <div className="col-span-full py-12 text-center bg-[#121212] rounded-3xl border border-white/10 text-gray-400 text-xs">
            Aradığınız kriterlere uygun senaryo bulunamadı.
          </div>
        )}
      </motion.div>

      {/* Lightbox Modal for Photo Preview */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#111111] border border-white/20 rounded-3xl p-5 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">{lightboxImage.title}</h3>
                <p className="text-xs text-amber-300 flex items-center gap-1 font-semibold mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  Konum: {lightboxImage.location} • Rehber Ajan: {lightboxImage.agentName}
                </p>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-xl bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black max-h-[65vh]">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="w-full h-full object-contain max-h-[65vh]"
              />
            </div>

            {lightboxImage.caption && (
              <p className="text-xs text-gray-300 bg-[#050505] p-3 rounded-2xl border border-white/10">
                📸 {lightboxImage.caption}
              </p>
            )}

            <div className="p-3 bg-[#050505] rounded-xl text-xs text-gray-300 flex items-center justify-between border border-white/10">
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> 4K Gerçekçi Mekan & Hikaye Fotoğrafı
              </span>
              <button
                onClick={() => setLightboxImage(null)}
                className="text-amber-400 hover:underline font-bold"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
