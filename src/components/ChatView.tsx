import React, { useState, useEffect, useRef } from 'react';
import { Agent, ChatMessage, EngineMode, MemoryItem } from '../types';
import {
  Send,
  Camera,
  Brain,
  Volume2,
  VolumeX,
  Trash2,
  Sparkles,
  Zap,
  ShieldCheck,
  Maximize2,
  X,
  Heart,
  ChevronLeft,
  MapPin,
  Coffee,
  Gift,
  Smile,
  Mic,
  Music,
  RotateCcw,
  PlusCircle,
  Eye,
} from 'lucide-react';
import { generateLocalResponse } from '../utils/localEngine';
import { saveChatMessage, getChatMessages, addMemory, clearChatHistory, saveAgent, getMemories } from '../utils/storage';
import { REACTION_CLIPS, playReactionClip, speakTextTurkish, ReactionClip } from '../utils/soundBank';
import { AgentOverlayCard } from './AgentOverlayCard';
import { generateNanoBananaImage } from '../utils/nanoBananaEngine';

interface ChatViewProps {
  agent: Agent;
  engineMode: EngineMode;
  onBackToDiscover: () => void;
  onOpenMemoryPanel: (agent: Agent) => void;
  onUpdateAgent: (agent: Agent) => void;
  accentHex?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  agent,
  engineMode,
  onBackToDiscover,
  onOpenMemoryPanel,
  onUpdateAgent,
  accentHex = '#00D2FF',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [autoSpeech, setAutoSpeech] = useState(false);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);
  const [showSoundBank, setShowSoundBank] = useState(false);
  const [lastPlayedClip, setLastPlayedClip] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showOverlayCard, setShowOverlayCard] = useState(false);
  const [overlayMessageText, setOverlayMessageText] = useState('');
  const [autoDevScene, setAutoDevScene] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on agent change
  useEffect(() => {
    const history = getChatMessages(agent.id);
    if (history.length === 0) {
      const greetingMsg: ChatMessage = {
        id: `greeting-${Date.now()}`,
        agentId: agent.id,
        sender: 'agent',
        text: agent.greeting,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      saveChatMessage(agent.id, greetingMsg);
      setMessages([greetingMsg]);
    } else {
      setMessages(history);
    }
  }, [agent.id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Quick Boosters (Çay Ismarla, Hediye Gönder, Takdir Et)
  const handleAgentBooster = (type: 'tea' | 'gift' | 'praise') => {
    let boostText = '';
    let energyAdd = 0;
    let happinessAdd = 0;
    let bondAdd = 0;

    if (type === 'tea') {
      boostText = 'Sana taze demlenmiş tavşankanı bir çay getirdim! ☕ Afiyet olsun!';
      energyAdd = 20;
      happinessAdd = 15;
      bondAdd = 5;
    } else if (type === 'gift') {
      boostText = 'Sana özel küçük bir hediye hazırladım! 🎁 Umarım beğenirsin!';
      energyAdd = 10;
      happinessAdd = 25;
      bondAdd = 15;
    } else {
      boostText = 'Sen gerçekten harika bir dost ve ajansın, seninle vakit geçirmek mükemmel! 🌟';
      energyAdd = 10;
      happinessAdd = 20;
      bondAdd = 10;
    }

    const currentEnergy = agent.energy !== undefined ? agent.energy : 90;
    const currentHappiness = agent.happiness !== undefined ? agent.happiness : 90;
    const currentBond = agent.bond !== undefined ? agent.bond : (agent.relationshipLevel || 30);

    const updatedAgent: Agent = {
      ...agent,
      energy: Math.min(100, currentEnergy + energyAdd),
      happiness: Math.min(100, currentHappiness + happinessAdd),
      bond: Math.min(100, currentBond + bondAdd),
      relationshipLevel: Math.min(100, currentBond + bondAdd),
      mood: 'Coşkulu',
      moodEmoji: '🎉',
    };

    saveAgent(updatedAgent);
    onUpdateAgent(updatedAgent);

    handleSendMessage(boostText);
  };

  // Play Sound Reaction Clip
  const handlePlayReaction = (clip: ReactionClip) => {
    playReactionClip(clip);
    setLastPlayedClip(clip.label);
    setTimeout(() => setLastPlayedClip(null), 3000);
  };

  // Send message logic
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      agentId: agent.id,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = saveChatMessage(agent.id, userMsg);
    setMessages(updated);
    setInputText('');
    setIsTyping(true);

    let replyText = '';
    let mediaUrl: string | undefined = undefined;
    let mediaType: 'image' | 'audio' | undefined = undefined;
    let memorySaved = false;
    let xpGained = 15;
    let newEnergy = agent.energy || 90;
    let newHappiness = agent.happiness || 90;
    let newBond = agent.bond || agent.relationshipLevel || 30;
    let newMood = agent.mood || 'Neşeli';
    let newMoodEmoji = agent.moodEmoji || '✨';

    if (engineMode === 'hybrid' || engineMode === 'groq') {
      try {
        const storedGroqKey = localStorage.getItem('xasil_groq_api_key') || '';
        const storedGeminiKeys = localStorage.getItem('xasil_gemini_keys') || '';
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-gemini-keys': storedGeminiKeys,
            'x-groq-api-key': storedGroqKey,
          },
          body: JSON.stringify({
            agent,
            userMessage: text,
            chatHistory: updated,
            groqApiKey: storedGroqKey,
            geminiKeys: storedGeminiKeys ? JSON.parse(storedGeminiKeys) : [],
            engineMode: engineMode,
          }),
        });
        const data = await res.json();
        if (data.replyText) {
          replyText = data.replyText;
        }
      } catch (err) {
        console.warn('Server API unavailable, falling back to local simulation engine');
      }
    }

    if (!replyText) {
      const localResult = generateLocalResponse(agent, text, updated, getMemories(agent.id));
      replyText = localResult.replyText;
      mediaUrl = localResult.mediaUrl;
      mediaType = localResult.mediaType;
      xpGained = localResult.xpGained;
      newEnergy = localResult.newEnergy;
      newHappiness = localResult.newHappiness;
      newBond = localResult.newBond;
      newMood = localResult.newMood;
      newMoodEmoji = localResult.newMoodEmoji;

      if (localResult.newMemory) {
        memorySaved = true;
        addMemory(agent.id, {
          id: `mem-${Date.now()}`,
          agentId: agent.id,
          title: localResult.newMemory.title,
          content: localResult.newMemory.content,
          type: localResult.newMemory.type,
          date: new Date().toLocaleDateString('tr-TR'),
          impactLevel: 'high',
        });
      }
    }

    const wantsPhoto = /selfie|foto|resim|görsel|yüzünü göster|nasıl görünüyorsun/i.test(text) || (replyText && replyText.includes('[SELFIE_REQUESTED]'));
    if (wantsPhoto || mediaUrl) {
      try {
        const nanoRes = await generateNanoBananaImage({
          prompt: text || `${agent.name} selfie fotoğrafı`,
          topic: text,
          agentName: agent.name,
        });
        mediaUrl = nanoRes.imageUrl;
        mediaType = 'image';
      } catch (e) {}
    }

    setTimeout(() => {
      setIsTyping(false);

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        agentId: agent.id,
        sender: 'agent',
        text: replyText,
        mediaUrl,
        mediaType,
        memorySaved,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };

      const finalHistory = saveChatMessage(agent.id, agentMsg);
      setMessages(finalHistory);

      // Open Cinematic Large Agent Overlay Card automatically for agent replies if enabled
      if (autoDevScene) {
        setOverlayMessageText(replyText);
        setShowOverlayCard(true);
      }

      const newXp = (agent.xp || 0) + xpGained;
      let newTitle = agent.relationshipTitle || 'Yeni Tanışılan';

      if (newBond >= 80) {
        newTitle = 'Ayrılmaz Ruh Eşi';
      } else if (newBond >= 50) {
        newTitle = 'Sırdaş Dost';
      } else if (newBond >= 30) {
        newTitle = 'Güvenilir Müttefik';
      }

      const updatedAgent: Agent = {
        ...agent,
        xp: newXp,
        relationshipLevel: newBond,
        bond: newBond,
        energy: newEnergy,
        happiness: newHappiness,
        mood: newMood,
        moodEmoji: newMoodEmoji,
        relationshipTitle: newTitle,
        totalMessages: (agent.totalMessages || 0) + 1,
      };
      saveAgent(updatedAgent);
      onUpdateAgent(updatedAgent);

      if (autoSpeech) {
        speakTextTurkish(replyText);
      }
    }, 800);
  };

  const handleClearChat = () => {
    setShowClearModal(true);
  };

  const confirmClearChat = () => {
    clearChatHistory(agent.id);

    const greetingMsg: ChatMessage = {
      id: `greeting-${Date.now()}`,
      agentId: agent.id,
      sender: 'agent',
      text: agent.greeting,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };
    saveChatMessage(agent.id, greetingMsg);
    setMessages([greetingMsg]);
    setShowClearModal(false);

    setToastMessage('Sohbet geçmişi tamamen silindi ve yeni sohbet başlatıldı! ✨');
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="flex flex-col h-[82vh] bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="bg-[#111111] border-b border-white/10 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDiscover}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors cursor-pointer border border-white/5"
            title="Keşfet Sayfasına Dön"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 bg-slate-900 shrink-0" style={{ borderColor: accentHex }}>
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const fallback = agent.id.includes('hakan')
                  ? '/hakan_xasil_avatar.svg'
                  : agent.gender === 'Erkek'
                  ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
                (e.target as HTMLImageElement).src = fallback;
              }}
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#111111] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-extrabold text-white">{agent.name}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-md text-black font-extrabold uppercase" style={{ backgroundColor: accentHex }}>
                {agent.category}
              </span>
              {agent.turkishOrigin && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/10 flex items-center gap-1">
                  <MapPin className="w-3 h-3" style={{ color: accentHex }} />
                  {agent.turkishOrigin}
                </span>
              )}
            </div>

            {/* Energy, Happiness & Bond Indicators */}
            <div className="flex items-center gap-3 mt-1 text-[11px] flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-xs">{agent.moodEmoji || '✨'}</span>
                <span className="font-bold text-white text-[10px]">{agent.mood || 'Neşeli'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-emerald-400 font-mono">⚡ %{agent.energy || 90}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-14 bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, agent.bond || agent.relationshipLevel || 30)}%`, backgroundColor: accentHex }}
                  />
                </div>
                <span className="text-[10px] text-amber-300 font-semibold truncate max-w-[100px]">
                  %{agent.bond || agent.relationshipLevel || 30} Bağ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowSoundBank(!showSoundBank)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-200 border border-purple-500/40 hover:scale-105"
            title="Mizahi Sesli Tepki Bankasını Aç"
          >
            <Mic className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Sesli Tepki</span>
          </button>

          <button
            onClick={() => onOpenMemoryPanel(agent)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border"
            style={{ borderColor: `${accentHex}40`, color: accentHex, backgroundColor: `${accentHex}15` }}
            title="Ajanın Kalıcı Hafıza Paneli"
          >
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">Anı Albümü</span>
          </button>

          <button
            onClick={() => setAutoSpeech(!autoSpeech)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              autoSpeech
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                : 'bg-white/5 text-gray-400 border-white/10'
            }`}
            title="Otomatik Seslendir"
          >
            {autoSpeech ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1 bg-amber-950/40 p-1 rounded-xl border border-amber-500/30">
            <button
              onClick={() => {
                const lastAgentMsg = [...messages].reverse().find(m => m.sender === 'agent');
                setOverlayMessageText(lastAgentMsg ? lastAgentMsg.text : agent.greeting);
                setShowOverlayCard(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:scale-105"
              title="Ajan Karakterini Görseldeki Gibi Sahneye Çıkar"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>🎭 Karakter Sahnesi</span>
            </button>
            <button
              onClick={() => setAutoDevScene(!autoDevScene)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                autoDevScene
                  ? 'bg-amber-400 text-black border-amber-300 font-extrabold'
                  : 'bg-white/5 text-gray-400 border-white/10'
              }`}
              title="Mesaj Geldiğinde Karakter Sahnesini Otomatik Aç/Kapat"
            >
              {autoDevScene ? 'Oto: AÇIK' : 'Oto: KAPALI'}
            </button>
          </div>

          <button
            onClick={() => setShowClearModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 hover:scale-105"
            title="Sohbeti Sıfırla ve Yeni Sohbet Başlat"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Yeni Sohbet</span>
          </button>

          <button
            onClick={() => setShowClearModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 hover:scale-105"
            title="Tüm Sohbet Geçmişini Sil"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Sohbeti Sil</span>
          </button>
        </div>
      </div>

      {/* Local Reaction Sound Bank Drawer */}
      {showSoundBank && (
        <div className="bg-[#121018] border-b border-purple-500/30 p-3.5 animate-fadeIn z-20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-purple-300">
              <Music className="w-4 h-4 text-purple-400" />
              Çevrimdışı Sesli Tepki & Yerli Mizah Bankası
            </div>
            <button
              onClick={() => setShowSoundBank(false)}
              className="text-gray-400 hover:text-white text-xs font-bold"
            >
              Kapat ✖
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mb-2">
            Aşağıdaki sesli tepkilerden birine tıklayarak ajana lokal ses / mizah repliği dinletebilirsin:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {REACTION_CLIPS.map((clip) => (
              <button
                key={clip.id}
                onClick={() => handlePlayReaction(clip)}
                className="p-2 rounded-xl bg-white/5 hover:bg-purple-900/50 border border-white/10 hover:border-purple-500/50 text-left transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="text-base">{clip.emoji}</span>
                <div className="truncate">
                  <div className="text-[11px] font-bold text-white truncate">{clip.label}</div>
                  <div className="text-[9px] text-purple-300 opacity-80 truncate">{clip.turkishPhrase}</div>
                </div>
              </button>
            ))}
          </div>
          {lastPlayedClip && (
            <div className="mt-2 text-[10px] font-bold text-emerald-400 animate-pulse text-center">
              🔊 Çalınıyor: "{lastPlayedClip}"
            </div>
          )}
        </div>
      )}

      {/* Engine Status Banner */}
      <div className="bg-[#070707] px-4 py-1.5 border-b border-white/5 flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5">
          {engineMode === 'local' ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Çalışma Modu: <strong className="text-emerald-400">Açık Kaynak Yerel Motor (Mistral-7B Offline)</strong></span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5" style={{ color: accentHex }} />
              <span>Çalışma Modu: <strong style={{ color: accentHex }}>XASİL Hibrit AI Çekirdeği</strong></span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Quick Boosters */}
          <button
            onClick={() => handleAgentBooster('tea')}
            className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 hover:scale-105 cursor-pointer"
            title="Ajana Taze Çay Ismarla (+20 Enerji)"
          >
            <Coffee className="w-3 h-3 text-amber-400" />
            Çay Ismarla ☕
          </button>
          <button
            onClick={() => handleAgentBooster('gift')}
            className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1 hover:scale-105 cursor-pointer"
            title="Ajana Hediye Ver (+15 Bağ)"
          >
            <Gift className="w-3 h-3 text-rose-400" />
            Hediye Ver 🎁
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 bg-gradient-to-b from-[#050505] to-[#0f1115]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            {msg.sender === 'agent' && (
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-8 h-8 rounded-xl object-cover border border-white/10 shrink-0 mt-1"
                onError={(e) => {
                  const fallback = agent.id.includes('hakan')
                    ? '/hakan_xasil_avatar.svg'
                    : agent.gender === 'Erkek'
                    ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
                  (e.target as HTMLImageElement).src = fallback;
                }}
              />
            )}

            {/* Bubble Container */}
            <div className={`max-w-[85%] sm:max-w-[70%] space-y-1 ${msg.sender === 'user' ? 'items-end' : ''}`}>
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                  msg.sender === 'user'
                    ? 'text-black font-semibold rounded-tr-none'
                    : 'bg-[#121212] text-gray-200 border border-white/10 rounded-tl-none'
                }`}
                style={msg.sender === 'user' ? { backgroundColor: accentHex } : {}}
              >
                {/* Media Image / Selfie */}
                {msg.mediaUrl && msg.mediaType === 'image' && (
                  <div className="mb-3 rounded-xl overflow-hidden border relative group cursor-pointer" style={{ borderColor: accentHex }} onClick={() => setPreviewMediaUrl(msg.mediaUrl!)}>
                    <img
                      src={msg.mediaUrl}
                      alt="Ajan Selfie"
                      className="w-full max-h-60 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[10px] font-black border border-yellow-200 flex items-center gap-1 shadow-xl animate-pulse z-10">
                      <Sparkles className="w-3 h-3 text-black" />
                      <span>Nano Banana Pro AI</span>
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Maximize2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}

                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Memory Saved Tag */}
                {msg.memorySaved && (
                  <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                    <Brain className="w-3 h-3 text-amber-400" />
                    Anı Kalıcı Hafızaya Kaydedildi!
                  </div>
                )}
              </div>

              {/* Timestamp & Actions */}
              <div className={`flex items-center gap-2 text-[10px] text-gray-500 px-1 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                <span>{msg.timestamp}</span>
                {msg.sender === 'agent' && (
                  <>
                    <button
                      onClick={() => speakTextTurkish(msg.text)}
                      className="hover:text-white transition-colors cursor-pointer"
                      title="Seslendir"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        setOverlayMessageText(msg.text);
                        setShowOverlayCard(true);
                      }}
                      className="hover:text-cyan-300 text-cyan-400/80 transition-colors cursor-pointer flex items-center gap-1 font-bold"
                      title="Büyük Sinematik Sahne Kartında Aç"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Büyük Kart</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs font-semibold p-2" style={{ color: accentHex }}>
            <img
              src={agent.avatar}
              alt="Agent"
              className="w-6 h-6 rounded-lg object-cover"
              onError={(e) => {
                const fallback = agent.id.includes('hakan')
                  ? '/hakan_xasil_avatar.svg'
                  : agent.gender === 'Erkek'
                  ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
                (e.target as HTMLImageElement).src = fallback;
              }}
            />
            <div className="flex items-center gap-1 bg-[#121212] px-3 py-2 rounded-xl border border-white/10">
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: accentHex }} />
              <span className="w-2 h-2 rounded-full animate-bounce delay-100" style={{ backgroundColor: accentHex }} />
              <span className="w-2 h-2 rounded-full animate-bounce delay-200" style={{ backgroundColor: accentHex }} />
              <span className="ml-1 text-[11px] text-gray-400">{agent.name} yazıyor...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="px-4 py-2 bg-[#0d0d0d] border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => handleSendMessage('Bana özel bir selfie fotoğrafı gönderir misin?')}
          className="px-3.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border"
          style={{ borderColor: `${accentHex}30`, color: accentHex, backgroundColor: `${accentHex}10` }}
        >
          <Camera className="w-3.5 h-3.5" />
          📸 Selfie İste
        </button>

        <button
          onClick={() => handleSendMessage('Sana bir sırrımı anlatmak istiyorum, saklayabilir misin?')}
          className="px-3.5 py-1 rounded-full bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/30 text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer"
        >
          <Brain className="w-3.5 h-3.5 text-purple-400" />
          🧠 Sır Paylaş
        </button>

        <button
          onClick={() => handleSendMessage('Seninle ilgili unutamadığım bir anımızı anlatır mısın?')}
          className="px-3.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          ✨ Anıyı Anlat
        </button>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-[#111111] border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          placeholder={`${agent.name} ile sohbet et...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 bg-[#050505] text-white placeholder-gray-500 text-xs sm:text-sm rounded-xl px-4 py-3 border border-white/10 focus:outline-none transition-all"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isTyping}
          className="px-5 py-3 rounded-xl text-black font-extrabold text-xs flex items-center gap-2 shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all cursor-pointer"
          style={{ backgroundColor: accentHex, boxShadow: `0 0 15px ${accentHex}50` }}
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Gönder</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-emerald-950/95 text-emerald-200 border border-emerald-500/50 px-5 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clear Chat Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14121a] border border-rose-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-fadeIn text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white mb-2">
              Sohbeti Sil & Sıfırla
            </h3>
            <p className="text-xs text-gray-300 mb-6 leading-relaxed">
              <strong className="text-amber-300">{agent.name}</strong> ile olan tüm mesaj geçmişiniz tamamen silinecek ve taze bir yeni sohbet başlatılacak. Emin misiniz?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-bold transition-all cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={confirmClearChat}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-extrabold shadow-lg shadow-rose-900/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Evet, Sil</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal Preview */}
      {previewMediaUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setPreviewMediaUrl(null)}>
          <div className="relative max-w-2xl w-full bg-[#121212] rounded-3xl p-3 border border-white/20 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewMediaUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:text-amber-400 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewMediaUrl} alt="Selfie Preview" className="w-full max-h-[80vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}
      {/* Large Agent Cinematic Overlay Card */}
      <AgentOverlayCard
        isOpen={showOverlayCard}
        agent={agent}
        messageText={overlayMessageText || agent.greeting}
        onClose={() => setShowOverlayCard(false)}
        accentHex={accentHex}
        autoSpeak={autoSpeech}
      />
    </div>
  );
};
