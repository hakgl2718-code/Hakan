import React, { useState } from 'react';
import { UserSettings, EngineMode } from '../types';
import { NeonTheme, THEME_PRESETS, getThemeConfig } from '../utils/theme';
import { Settings, X, ShieldCheck, Zap, Volume2, User, Palette, Key, ChevronDown, ChevronUp, Eye, EyeOff, Cpu } from 'lucide-react';

interface SettingsModalProps {
  settings: UserSettings;
  onSaveSettings: (newSettings: UserSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSaveSettings,
  onClose,
}) => {
  const [userName, setUserName] = useState(settings.userName || 'Kullanıcı');
  const [engineMode, setEngineMode] = useState<EngineMode>(settings.engineMode);
  const [autoSpeak, setAutoSpeak] = useState(settings.autoSpeak);
  const [glowTheme, setGlowTheme] = useState<NeonTheme>(settings.glowTheme || 'cyan');
  
  // Groq API Drawer State
  const [groqApiKey, setGroqApiKey] = useState(settings.groqApiKey || localStorage.getItem('xasil_groq_api_key') || '');
  const [isGroqDrawerOpen, setIsGroqDrawerOpen] = useState(false);
  const [showGroqKey, setShowGroqKey] = useState(false);

  const themeConfig = getThemeConfig(glowTheme);

  const handleSave = () => {
    if (groqApiKey.trim()) {
      localStorage.setItem('xasil_groq_api_key', groqApiKey.trim());
    } else {
      localStorage.removeItem('xasil_groq_api_key');
    }

    onSaveSettings({
      ...settings,
      userName,
      engineMode,
      autoSpeak,
      glowTheme,
      groqApiKey: groqApiKey.trim(),
    });
    onClose();
  };

  const themeOptions: NeonTheme[] = ['cyan', 'purple', 'green', 'red', 'amber', 'pink'];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121212] w-full max-w-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Top Glow Accent */}
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ backgroundColor: themeConfig.hex }} />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
          <div className="flex items-center gap-2 text-white font-extrabold text-lg">
            <Settings className="w-5 h-5" style={{ color: themeConfig.hex }} />
            XASİL Sistem Ayarları & AI Çekmecesi
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form */}
        <div className="space-y-5 relative z-10">
          
          {/* Neon Theme Palette Picker */}
          <div>
            <label className="block text-xs font-extrabold text-gray-300 mb-2 flex items-center gap-1.5">
              <Palette className="w-4 h-4" style={{ color: themeConfig.hex }} />
              Özelleştirilebilir Neon Vurgu Paleti
            </label>
            <div className="grid grid-cols-5 gap-2">
              {themeOptions.map((thKey) => {
                const conf = THEME_PRESETS[thKey];
                const isSelected = glowTheme === thKey;
                return (
                  <button
                    key={thKey}
                    type="button"
                    onClick={() => setGlowTheme(thKey)}
                    className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-white bg-white/10 scale-105 shadow-lg'
                        : 'border-white/10 bg-[#050505] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full shadow-md"
                      style={{ backgroundColor: conf.hex, boxShadow: `0 0 10px ${conf.hex}` }}
                    />
                    <span className="text-[10px] font-bold text-gray-200 truncate w-full">
                      {conf.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Nickname */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1 flex items-center gap-1.5">
              <User className="w-4 h-4" style={{ color: themeConfig.hex }} />
              Kullanıcı Takma İsminiz
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:outline-none transition-all"
            />
          </div>

          {/* Engine Mode Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">
              Varsayılan Yapay Zeka Motoru
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEngineMode('local')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  engineMode === 'local'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'bg-[#050505] text-gray-400 border-white/10'
                }`}
              >
                <div className="flex items-center gap-1 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Yerel Model
                </div>
                <span className="text-[9px] opacity-80">Offline Devre</span>
              </button>

              <button
                type="button"
                onClick={() => setEngineMode('hybrid')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  engineMode === 'hybrid'
                    ? 'bg-white/10 text-white border-white/40 shadow-md'
                    : 'bg-[#050505] text-gray-400 border-white/10'
                }`}
                style={engineMode === 'hybrid' ? { borderColor: themeConfig.hex, backgroundColor: `${themeConfig.hex}20` } : {}}
              >
                <div className="flex items-center gap-1 font-bold text-[11px]" style={engineMode === 'hybrid' ? { color: themeConfig.hex } : {}}>
                  <Zap className="w-3.5 h-3.5" />
                  XASİL Hibrit
                </div>
                <span className="text-[9px] opacity-80">Gelişmiş AI</span>
              </button>

              <button
                type="button"
                onClick={() => setEngineMode('groq')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  engineMode === 'groq'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-[#050505] text-gray-400 border-white/10'
                }`}
              >
                <div className="flex items-center gap-1 font-bold text-[11px] text-amber-400">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  Groq Llama 3
                </div>
                <span className="text-[9px] opacity-80">Açık Kaynak Llama 3.3</span>
              </button>
            </div>
          </div>

          {/* Groq Open Source Llama 3 API Key Secret Drawer (Gizli Anahtar Çekmecesi) */}
          <div className="bg-[#080b12] rounded-2xl border border-amber-500/30 overflow-hidden">
            <button
              type="button"
              onClick={() => setIsGroqDrawerOpen(!isGroqDrawerOpen)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-black text-amber-300 flex items-center gap-2">
                    Groq Llama 3 Gizli Anahtar Çekmecesi
                    {groqApiKey ? (
                      <span className="px-1.5 py-0.5 text-[9px] bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30 font-bold">
                        Aktivite Edildi
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 text-[9px] bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/30 font-bold">
                        Anahtar Girilmedi
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400">Açık kaynaklı Llama 3.3-70B modelini kendi Groq API key'inizle çalıştırın</p>
                </div>
              </div>
              {isGroqDrawerOpen ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
            </button>

            {isGroqDrawerOpen && (
              <div className="p-4 border-t border-amber-500/20 bg-[#04060a] space-y-3 animate-fadeIn">
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  Groq Cloud paneli üzerinden alacağınız <code className="text-amber-300 bg-amber-950/50 px-1 py-0.5 rounded">gsk_...</code> gizli API anahtarınızı buraya girebilirsiniz. Anahtarınız tarayıcınızın gizli deposunda saklanır ve sunucuda açık edilmez.
                </p>

                <div className="relative">
                  <input
                    type={showGroqKey ? 'text' : 'password'}
                    placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxx"
                    value={groqApiKey}
                    onChange={(e) => setGroqApiKey(e.target.value)}
                    className="w-full bg-[#0a0f1d] text-amber-200 text-xs rounded-xl p-3 pr-10 border border-amber-500/40 focus:border-amber-400 focus:outline-none transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGroqKey(!showGroqKey)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {showGroqKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-[10px] text-gray-400 flex items-center justify-between">
                  <span>Model: <strong>Llama-3.3-70b-versatile</strong></span>
                  <span className="text-amber-400 font-bold">Groq AI Cloud Engine</span>
                </div>
              </div>
            )}
          </div>

          {/* Auto Speak */}
          <div className="flex items-center justify-between p-3.5 bg-[#050505] rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
              <Volume2 className="w-4 h-4" style={{ color: themeConfig.hex }} />
              Otomatik Türkçe Seslendirme (TTS)
            </div>
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: themeConfig.hex }}
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 relative z-10">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-black font-extrabold text-xs shadow-lg transition-all hover:scale-105 cursor-pointer"
            style={{ backgroundColor: themeConfig.hex, boxShadow: `0 0 15px ${themeConfig.hex}60` }}
          >
            Ayarları Kaydet
          </button>
        </div>

      </div>
    </div>
  );
};
