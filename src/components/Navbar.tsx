import React from 'react';
import { Bot, MessageSquare, Brain, Sparkles, Compass, Settings, Zap, ShieldCheck, Users, LogOut, UserCheck } from 'lucide-react';
import { EngineMode } from '../types';
import { NeoLogo } from './NeoLogo';
import { UserAccount } from './AuthModal';

interface NavbarProps {
  activeTab: 'discover' | 'chat' | 'group' | 'memory' | 'studio' | 'events';
  setActiveTab: (tab: 'discover' | 'chat' | 'group' | 'memory' | 'studio' | 'events') => void;
  engineMode: EngineMode;
  setEngineMode: (mode: EngineMode) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenSettings: () => void;
  activeAgentName?: string;
  accentHex?: string;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  engineMode,
  setEngineMode,
  searchQuery,
  setSearchQuery,
  onOpenSettings,
  activeAgentName,
  accentHex = '#00D2FF',
  currentUser,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Neo-Mavi Hibrit Logo & Brand */}
          <NeoLogo accentHex={accentHex} onClick={() => setActiveTab('discover')} />

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#111111] p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'discover'
                  ? 'text-black font-extrabold shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              style={activeTab === 'discover' ? { backgroundColor: accentHex, boxShadow: `0 0 15px ${accentHex}50` } : {}}
            >
              <Compass className="w-4 h-4" />
              Keşfet
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === 'chat'
                  ? 'text-black font-extrabold shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              style={activeTab === 'chat' ? { backgroundColor: accentHex, boxShadow: `0 0 15px ${accentHex}50` } : {}}
            >
              <MessageSquare className="w-4 h-4" />
              Sohbet
              {activeAgentName && (
                <span className="max-w-[70px] truncate text-[10px] bg-black/80 text-white px-1.5 py-0.5 rounded-md border border-white/20">
                  {activeAgentName}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('group')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === 'group'
                  ? 'text-black font-extrabold shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              style={activeTab === 'group' ? { backgroundColor: accentHex, boxShadow: `0 0 15px ${accentHex}50` } : {}}
            >
              <Users className="w-4 h-4 text-amber-400" />
              Grup Odası
              <span className="px-1.5 py-0.5 text-[9px] font-black bg-rose-500 text-white rounded-full uppercase animate-pulse">
                KAOS
              </span>
            </button>

            <button
              onClick={() => setActiveTab('memory')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'memory'
                  ? 'text-black font-extrabold shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              style={activeTab === 'memory' ? { backgroundColor: accentHex, boxShadow: `0 0 15px ${accentHex}50` } : {}}
            >
              <Brain className="w-4 h-4" />
              Anı Albümü
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'studio'
                  ? 'text-black font-extrabold shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              style={activeTab === 'studio' ? { backgroundColor: accentHex, boxShadow: `0 0 15px ${accentHex}50` } : {}}
            >
              <Bot className="w-4 h-4 text-purple-400" />
              Ajan Stüdyosu
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'events'
                  ? 'text-black font-extrabold shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              style={activeTab === 'events' ? { backgroundColor: accentHex, boxShadow: `0 0 15px ${accentHex}50` } : {}}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Etkinlikler
            </button>
          </nav>

          {/* Right Actions & Engine Toggle */}
          <div className="flex items-center gap-2">
            
            {/* User Profile Badge */}
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#00F0FF] to-indigo-600 flex items-center justify-center font-black text-black text-[11px] shadow-sm">
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-bold text-[11px] text-white truncate max-w-[90px]">{currentUser.fullName}</span>
                  <span className="text-[9px] text-gray-400">@{currentUser.username}</span>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Oturumu Kapat / Çıkış Yap"
                    className="p-1 rounded-lg hover:bg-rose-500/20 hover:text-rose-400 text-gray-400 transition-colors ml-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Engine Mode Toggle */}
            <button
              onClick={() => setEngineMode(engineMode === 'local' ? 'hybrid' : 'local')}
              title="Açık Kaynak Yerel Model vs XASİL Hibrit Yapay Zeka Modu Değiştir"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer"
              style={
                engineMode === 'local'
                  ? { backgroundColor: 'rgba(6,78,59,0.8)', color: '#34d399', borderColor: '#10b981' }
                  : { backgroundColor: `${accentHex}15`, color: accentHex, borderColor: `${accentHex}40` }
              }
            >
              {engineMode === 'local' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Yerel</span>
                </>
              ) : engineMode === 'groq' ? (
                <>
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Groq Llama 3</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 animate-pulse" style={{ color: accentHex }} />
                  <span className="hidden sm:inline">XASİL Hibrit</span>
                </>
              )}
            </button>

            {/* Settings Trigger */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all cursor-pointer"
              title="Arayüz, Groq API ve Tema Ayarları"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tab Bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-white/10 overflow-x-auto text-[11px]">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${
              activeTab === 'discover' ? 'font-bold text-white' : 'text-gray-400'
            }`}
            style={activeTab === 'discover' ? { color: accentHex } : {}}
          >
            <Compass className="w-4 h-4" />
            Keşfet
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${
              activeTab === 'chat' ? 'font-bold text-white' : 'text-gray-400'
            }`}
            style={activeTab === 'chat' ? { color: accentHex } : {}}
          >
            <MessageSquare className="w-4 h-4" />
            Sohbet
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg relative ${
              activeTab === 'group' ? 'font-bold text-white' : 'text-gray-400'
            }`}
            style={activeTab === 'group' ? { color: accentHex } : {}}
          >
            <Users className="w-4 h-4 text-amber-400" />
            Grup
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${
              activeTab === 'memory' ? 'font-bold text-white' : 'text-gray-400'
            }`}
            style={activeTab === 'memory' ? { color: accentHex } : {}}
          >
            <Brain className="w-4 h-4" />
            Anılar
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${
              activeTab === 'studio' ? 'font-bold text-white' : 'text-gray-400'
            }`}
            style={activeTab === 'studio' ? { color: accentHex } : {}}
          >
            <Bot className="w-4 h-4" />
            Stüdyo
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${
              activeTab === 'events' ? 'font-bold text-white' : 'text-gray-400'
            }`}
            style={activeTab === 'events' ? { color: accentHex } : {}}
          >
            <Sparkles className="w-4 h-4" />
            Etkinlik
          </button>
        </div>
      </div>
    </header>
  );
};
