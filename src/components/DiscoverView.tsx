import React, { useState } from 'react';
import { Agent, Category } from '../types';
import { Search, Star, MessageSquare, Plus, Sparkles, Heart, Users, Zap, ShieldCheck, MapPin } from 'lucide-react';
import { getThemeConfig } from '../utils/theme';

interface DiscoverViewProps {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
  onCreateNew: () => void;
  onSelectEventScenario: () => void;
  onOpenGroupChat?: () => void;
  accentHex?: string;
}

const CATEGORIES: Category[] = [
  'Tümü',
  'Futbol/Spor',
  'Sosyal Medya/Mizah',
  'Anime',
  'Fantastik',
  'Bilim Kurgu',
  'Romantik',
  'Macera',
  'Gizem/Korku',
];

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  agents,
  onSelectAgent,
  onCreateNew,
  onSelectEventScenario,
  onOpenGroupChat,
  accentHex = '#00D2FF',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesCategory =
      selectedCategory === 'Tümü' || agent.category === selectedCategory;
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agent.turkishOrigin && agent.turkishOrigin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      agent.personalityTraits.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a0a0a] via-[#111111] to-[#0a0a0a] border border-white/10 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20" style={{ backgroundColor: accentHex }} />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold" style={{ color: accentHex }}>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            %100 Türkçe & Yerel Açık Kaynak Zeka Ağı
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Yerli Türk Ajanlar & <span style={{ color: accentHex }}>XASİL Siber Evren</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Galata sularından Anadolu mitolojisine, Pera yağmurlarından İstanbul kuantum laboratuvarlarına yerli hikayelere sahip Türk sohbet ajanlarıyla bağ kur, anı kartları biriktir.
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {onOpenGroupChat && (
              <button
                onClick={onOpenGroupChat}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer border border-white/20 animate-pulse"
              >
                <Users className="w-4 h-4 fill-white" />
                Ajan Kaos & Grup Odasına Gir! 🔥
              </button>
            )}
            <button
              onClick={onCreateNew}
              className="px-6 py-2.5 rounded-full text-black font-extrabold text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
              style={{ backgroundColor: accentHex, boxShadow: `0 0 20px ${accentHex}50` }}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Yeni Türk Ajan Yarat
            </button>
            <button
              onClick={onSelectEventScenario}
              className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Etkinlikler & Senaryolar
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Tabs - Rounded Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'text-black shadow-md font-extrabold scale-105'
                    : 'bg-white/5 text-gray-400 border border-white/5 hover:border-white/20 hover:text-white'
                }`}
                style={selectedCategory === cat ? { backgroundColor: accentHex, boxShadow: `0 0 15px ${accentHex}50` } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Ajan ismi, şehir veya özellik ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121212] text-white placeholder-gray-500 text-xs rounded-full pl-10 pr-4 py-2.5 border border-white/10 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Elegant Dark PolyBuzz-Style Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => onSelectAgent(agent)}
            className="group bg-[#121212] rounded-3xl border border-white/10 overflow-hidden hover:border-white/30 transition-all cursor-pointer flex flex-col justify-between relative shadow-xl hover:shadow-2xl"
          >
            <div>
              {/* Avatar Image Banner */}
              <div className="h-52 bg-slate-900 relative overflow-hidden">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40" />

                {/* Category & Custom Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                  <span
                    className="px-2.5 py-1 text-black text-[10px] font-extrabold rounded-lg shadow-md uppercase tracking-wider"
                    style={{ backgroundColor: accentHex }}
                  >
                    {agent.category}
                  </span>
                  {agent.moodEmoji && (
                    <span className="px-2 py-0.5 bg-black/80 text-white text-[10px] font-bold rounded-lg border border-white/10 backdrop-blur-md">
                      {agent.moodEmoji} {agent.mood || 'Neşeli'}
                    </span>
                  )}
                </div>

                {/* Favorite Heart Button */}
                <button
                  onClick={(e) => toggleFavorite(e, agent.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-gray-300 hover:text-rose-500 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorites[agent.id] ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                </button>

                {/* Origin Location & Online Status */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  {agent.turkishOrigin && (
                    <div className="flex items-center gap-1 bg-black/80 px-2.5 py-1 rounded-xl text-gray-200 text-[10px] font-medium backdrop-blur-md border border-white/10">
                      <MapPin className="w-3 h-3" style={{ color: accentHex }} />
                      <span className="truncate max-w-[120px]">{agent.turkishOrigin}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-xl text-emerald-400 text-[10px] font-bold backdrop-blur-md border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Aktif
                  </div>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-5 space-y-2.5">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors flex items-center justify-between">
                    <span>{agent.name}</span>
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {agent.rating || '4.9'}
                    </span>
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: accentHex }}>
                    {agent.title}
                  </p>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 italic leading-relaxed bg-[#050505] p-2.5 rounded-xl border border-white/5">
                  "{agent.greeting || agent.bio}"
                </p>

                {/* Dynamic Energy & Bond Gauges */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>⚡ Enerji: <strong className="text-emerald-400">%{agent.energy || 90}</strong></span>
                    <span>❤️ Bağ: <strong style={{ color: accentHex }}>%{agent.bond || agent.relationshipLevel || 30}</strong></span>
                  </div>
                  <div className="w-full bg-[#050505] rounded-full h-1.5 overflow-hidden border border-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, agent.bond || agent.relationshipLevel || 30)}%`, backgroundColor: accentHex }}
                    />
                  </div>
                </div>

                {/* Traits */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {agent.personalityTraits.slice(0, 3).map((trait) => (
                    <span
                      key={trait}
                      className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[10px] font-medium border border-white/5"
                    >
                      #{trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer Action */}
            <div className="px-5 pb-5 pt-2 border-t border-white/5 flex items-center justify-between">
              <div className="text-[11px] text-gray-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" style={{ color: accentHex }} />
                <span>{agent.talkCount ? `${(agent.talkCount / 1000).toFixed(1)}k` : '12.4k'} sohbet</span>
              </div>

              <button
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer"
                style={{ borderColor: `${accentHex}40`, color: accentHex, backgroundColor: `${accentHex}10` }}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Sohbet Et
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-16 bg-[#121212] rounded-3xl border border-white/10 space-y-3">
          <p className="text-gray-400 text-sm">
            Aradığınız kriterlere uygun Türk ajan bulunamadı.
          </p>
          <button
            onClick={onCreateNew}
            className="px-5 py-2 rounded-full text-black font-bold text-xs"
            style={{ backgroundColor: accentHex }}
          >
            Ajan Oluşturma Stüdyosu'nda İlk Ajanını Tasarla
          </button>
        </div>
      )}
    </div>
  );
};
