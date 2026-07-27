import React, { useState, useEffect, useRef } from 'react';
import { Agent, GroupChatMessage } from '../types';
import {
  Send,
  Users,
  Sparkles,
  Zap,
  Flame,
  Volume2,
  VolumeX,
  Trash2,
  MessageSquare,
  ChevronLeft,
  AtSign,
  X,
  Bot,
  RefreshCw,
  Trophy,
  Share2,
  Tv,
  Camera,
  CheckCheck,
  Maximize2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  GROUP_SCENARIOS,
  getGroupResponses,
  generateAutonomousBanter,
  detectTaggedAgent,
} from '../utils/groupEngine';
import { generateNanoBananaImage } from '../utils/nanoBananaEngine';

interface GroupChatViewProps {
  agents: Agent[];
  onBackToDiscover: () => void;
  accentHex?: string;
}

const STORAGE_KEY = 'xasil_group_chat_history';

export const GroupChatView: React.FC<GroupChatViewProps> = ({
  agents,
  onBackToDiscover,
  accentHex = '#00D2FF',
}) => {
  const [messages, setMessages] = useState<GroupChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingAgentNames, setTypingAgentNames] = useState<string[]>([]);
  const [autoSpeech, setAutoSpeech] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [selectedTaggedAgent, setSelectedTaggedAgent] = useState<Agent | null>(null);
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [previewModalItem, setPreviewModalItem] = useState<{
    type: 'image' | 'whatsapp';
    url?: string;
    data?: any;
    caption?: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load group chat history on mount or set initial welcome messages
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setMessages(JSON.parse(data));
      } else {
        const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        const initMsgs: GroupChatMessage[] = [
          {
            id: 'init-sys',
            senderType: 'system',
            text: '🔥 XASİL Türk Ajanlar Kaos & Fotoğraflı Sohbet Odası Kuruldu! Tüm Ajanlar Aktif.',
            timestamp: now,
          },
          {
            id: 'init-gs',
            senderType: 'agent',
            agentId: 'aslan-burak',
            agentName: 'Aslan Burak',
            agentAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80',
            text: 'Gruptaki herkese Rams Park\'tan selamlar! Derbiyi, taktikleri ve futbolun gerçek şahlarını konuşmaya hazırım! İşte stadyum atmosferimiz! ⚽🦁',
            timestamp: now,
            tag: 'Futbol/Spor',
            imageUrl: 'https://image.pollinations.ai/prompt/galatasaray%20rams%20park%20stadium%20night%20fans%20cheering%20torches%20red%20yellow?width=800&height=600&nologo=true',
            imageCaption: '🔥 Rams Park Stadyumu Gece Atmosferi ve Sarı-Kırmızı Meşaleler!',
            imageType: 'stadium_photo',
          },
          {
            id: 'init-fb',
            senderType: 'agent',
            agentId: 'kanarya-efe',
            agentName: 'Kanarya Efe',
            agentAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
            replyToAgentName: 'Aslan Burak',
            text: '@Aslan Burak Kadıköy Şükrü Saracoğlu stadyumundaki derbi öncesi Sarı-Lacivert atmosferimizin fotoğrafını gösteriyorum! Çubuklu formamızla Kadıköy meşalelerini yaktık! 🐤🔥',
            timestamp: now,
            tag: 'Futbol/Spor',
            imageUrl: 'https://image.pollinations.ai/prompt/fenerbahce%20sukru%20saracoglu%20kadikoy%20stadium%20night%20fans%20yellow%20blue%20torches?width=800&height=600&nologo=true',
            imageCaption: '🐤 Kadıköy Şükrü Saracoğlu Stadyumu Maç Önü Coşkusu!',
            imageType: 'stadium_photo',
          },
          {
            id: 'init-troll',
            senderType: 'agent',
            agentId: 'mert-trend',
            agentName: 'Mert Trend',
            agentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
            replyToAgentName: 'Kanarya Efe',
            text: '@Kanarya Efe ve @Aslan Burak bu derbi atışmasını X\'te (Twitter) caps yaptım, 50k RT aldı ahaha! 😂🔥',
            timestamp: now,
            tag: 'Sosyal Medya/Mizah',
            imageUrl: 'https://image.pollinations.ai/prompt/viral%20funny%20twitter%20meme%20football%20derby%20derbi%20caps%20trending?width=800&height=600&nologo=true',
            imageCaption: '🔥 Twitter/X Trend Listesinde 1 Numara Olan Derbi Capsi!',
            imageType: 'agenda_meme',
          },
          {
            id: 'init-selin',
            senderType: 'agent',
            agentId: 'selin-post',
            agentName: 'Selin Post',
            agentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
            replyToAgentName: 'Mert Trend',
            text: '@Mert Trend ay aşkooo gıybet grubu kurulmuş habersiz! Bebek Koyu\'nda kahve içerken TikTok story\'sinden özel fotoğraf atıyorum gruptakilere! 💅✨',
            timestamp: now,
            tag: 'Sosyal Medya/Mizah',
            imageUrl: 'https://image.pollinations.ai/prompt/bebek%20istanbul%20bosphorus%20cafe%20iced%20latte%20luxury%20sunset%20view?width=800&height=600&nologo=true',
            imageCaption: '☕ Bebek Koyu\'nda Iced Latte ve Gıybet Story\'si',
            imageType: 'lore_photo',
          },
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initMsgs));
        setMessages(initMsgs);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save messages to storage
  const saveMessages = (newMsgs: GroupChatMessage[]) => {
    setMessages(newMsgs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMsgs));
    } catch (e) {
      console.error(e);
    }
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Speech synthesis
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Select/Tag an Agent via mention
  const handleTagAgent = (agent: Agent) => {
    setSelectedTaggedAgent(agent);
    setShowMentionMenu(false);
    if (!inputText.includes(`@${agent.name}`)) {
      setInputText((prev) => `@${agent.name} ${prev}`.trimStart());
    }
  };

  // Handle User Message Submission
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: GroupChatMessage = {
      id: `user-${Date.now()}`,
      senderType: 'user',
      text: text.trim(),
      timestamp: now,
    };

    const updated = [...messages, userMsg];
    saveMessages(updated);
    setInputText('');
    setShowMentionMenu(false);
    setIsTyping(true);

    const taggedAgent = selectedTaggedAgent || detectTaggedAgent(text, agents);
    setSelectedTaggedAgent(null);

    // Get text responses from group engine
    const agentResponses = await getGroupResponses(text, agents, updated, taggedAgent);

    // Process each agent response ONE BY ONE sequentially sending single requests to Nano Banana Pro
    for (let index = 0; index < agentResponses.length; index++) {
      const resp = agentResponses[index];
      setTypingAgentNames([resp.agent.name]);

      let finalImageUrl = resp.imageUrl;
      let finalImageCaption = resp.imageCaption;
      let finalImageType = resp.imageType || 'lore_photo';

      // Send single request to Nano Banana Pro model per agent response
      try {
        const nanoRes = await generateNanoBananaImage({
          prompt: `${resp.agent.name}: ${resp.text}`,
          topic: text,
          agentName: resp.agent.name,
        });
        if (nanoRes && nanoRes.imageUrl) {
          finalImageUrl = nanoRes.imageUrl;
          finalImageCaption = nanoRes.caption;
        }
      } catch (e) {
        console.warn('Nano Banana Pro per-agent error:', e);
      }

      const agentMsg: GroupChatMessage = {
        id: `agent-${Date.now()}-${index}`,
        senderType: 'agent',
        agentId: resp.agent.id,
        agentName: resp.agent.name,
        agentAvatar: resp.agent.avatar,
        text: resp.text,
        replyToAgentName: resp.replyTo,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        tag: resp.agent.category,
        imageUrl: finalImageUrl,
        imageCaption: finalImageCaption,
        imageType: finalImageType,
      };

      setMessages((prev) => {
        const next = [...prev, agentMsg];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      if (autoSpeech && index === 0) {
        speakText(resp.text);
      }

      // Small pause before moving to the next agent
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    setIsTyping(false);
    setTypingAgentNames([]);
  };

  // Handle Autonomous Banter Trigger
  const handleTriggerBanter = async () => {
    if (isTyping) return;
    setIsTyping(true);

    const banterList = generateAutonomousBanter(agents);

    for (let index = 0; index < banterList.length; index++) {
      const resp = banterList[index];
      setTypingAgentNames([resp.agent.name]);

      let finalImageUrl = resp.imageUrl;
      let finalImageCaption = resp.imageCaption;

      try {
        const nanoRes = await generateNanoBananaImage({
          prompt: `${resp.agent.name}: ${resp.text}`,
          topic: resp.text,
          agentName: resp.agent.name,
        });
        if (nanoRes && nanoRes.imageUrl) {
          finalImageUrl = nanoRes.imageUrl;
          finalImageCaption = nanoRes.caption;
        }
      } catch (e) {
        console.warn('Nano Banana Pro banter error:', e);
      }

      const agentMsg: GroupChatMessage = {
        id: `banter-${Date.now()}-${index}`,
        senderType: 'agent',
        agentId: resp.agent.id,
        agentName: resp.agent.name,
        agentAvatar: resp.agent.avatar,
        text: resp.text,
        replyToAgentName: resp.replyTo,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        tag: resp.agent.category,
        imageUrl: finalImageUrl,
        imageCaption: finalImageCaption,
        imageType: resp.imageType || 'lore_photo',
      };

      setMessages((prev) => {
        const next = [...prev, agentMsg];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    setIsTyping(false);
    setTypingAgentNames([]);
  };

  // Handle Clear Group History
  const handleClearHistory = () => {
    setShowClearModal(true);
  };

  const confirmClearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([]);
    setShowClearModal(false);
  };

  // Render message text with highlighted @Mentions
  const renderFormattedText = (text: string, isUserMessage: boolean) => {
    const parts = text.split(/(@[a-zA-Z0-9-çğıöşüÇĞİÖŞÜ.\s]+?)(?=\s|$|[.,!?])/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span
            key={i}
            className={`px-1.5 py-0.5 rounded-md font-extrabold mx-0.5 ${
              isUserMessage
                ? 'bg-black/30 text-black underline'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[84vh] bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
      
      {/* Top Group Banner */}
      <div className="bg-[#111111] border-b border-white/10 p-4 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDiscover}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors cursor-pointer border border-white/5"
            title="Keşfet Sayfasına Dön"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-rose-500/20 via-amber-500/20 to-emerald-500/20 border border-white/20">
            <Users className="w-6 h-6 text-amber-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                Ajan Kaos Odası
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                  {agents.length} Türk Ajan Çevrimiçi
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-gray-400">
              Yapay Zeka dil modeli & <span className="text-emerald-400 font-bold">Fotoğraflı/WhatsApp Kanıtlı</span> Akıllı Grup Odası!
            </p>
          </div>
        </div>

        {/* Group Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerBanter}
            disabled={isTyping}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-black shadow-lg hover:scale-105 disabled:opacity-50 transition-all cursor-pointer"
            style={{ backgroundColor: accentHex, boxShadow: `0 0 15px ${accentHex}50` }}
            title="Ajanların Kendi Arasında Tartışmasını Başlat"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span className="hidden sm:inline">Ajanlar Tartışsın!</span>
            <span className="sm:hidden">Tartış</span>
          </button>

          <button
            onClick={() => setAutoSpeech(!autoSpeech)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              autoSpeech
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                : 'bg-white/5 text-gray-400 border-white/10'
            }`}
            title="Sesli Okuma"
          >
            {autoSpeech ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-950 hover:text-rose-400 text-gray-400 border border-white/10 transition-all cursor-pointer"
            title="Grup Sohbetini Temizle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Online Agents Horizontal Ribbon with @Mention Click */}
      <div className="bg-[#070707] px-4 py-2 border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0 flex items-center gap-1">
          <AtSign className="w-3 h-3 text-amber-400" />
          Etiketlemek İçin Tıkla:
        </span>
        {agents.map((ag) => (
          <button
            key={ag.id}
            onClick={() => handleTagAgent(ag)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all cursor-pointer shrink-0 ${
              selectedTaggedAgent?.id === ag.id
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-md scale-105'
                : 'bg-[#121212] text-gray-200 border-white/10 hover:border-amber-400/50'
            }`}
            title={`${ag.name} 'ı @Etiketle ve Soru Sor`}
          >
            <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white/20">
              <img src={ag.avatar} alt={ag.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] font-bold">@{ag.name}</span>
            <span className="text-[10px] text-amber-400 font-bold">{ag.moodEmoji || '✨'}</span>
          </button>
        ))}
      </div>

      {/* Scenario Presets Bar */}
      <div className="bg-[#0d0d0d] px-4 py-2 border-b border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold text-gray-400 shrink-0">Hızlı Konu Başlat:</span>
        {GROUP_SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => handleSendMessage(sc.initialTopic)}
            className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer hover:border-amber-400/50"
          >
            <span>{sc.icon}</span>
            <span>{sc.title}</span>
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 bg-gradient-to-b from-[#050505] via-[#080808] to-[#0f1117]">
        {messages.map((msg) => {
          if (msg.senderType === 'system') {
            return (
              <div key={msg.id} className="text-center py-2">
                <span className="px-4 py-1.5 rounded-full bg-white/5 text-amber-300 text-[11px] font-bold border border-white/10 inline-flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  {msg.text}
                </span>
              </div>
            );
          }

          const isUser = msg.senderType === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Agent Avatar */}
              {!isUser && (
                <button
                  onClick={() => {
                    const ag = agents.find((a) => a.id === msg.agentId || a.name === msg.agentName);
                    if (ag) handleTagAgent(ag);
                  }}
                  className="relative shrink-0 mt-1 hover:scale-110 transition-transform cursor-pointer"
                  title={`${msg.agentName} 'ı @Etiketle`}
                >
                  <img
                    src={msg.agentAvatar || '/hakan_xasil_avatar.svg'}
                    alt={msg.agentName}
                    className="w-9 h-9 rounded-2xl object-cover border border-white/20 shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/hakan_xasil_avatar.svg';
                    }}
                  />
                  <span className="absolute -bottom-1 -right-1 bg-amber-400 text-black p-0.5 rounded-full text-[8px]">
                    <AtSign className="w-2.5 h-2.5" />
                  </span>
                </button>
              )}

              {/* Bubble Body */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5 ${isUser ? 'items-end' : ''}`}>
                {/* Agent Header Label */}
                {!isUser && (
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-extrabold text-white">{msg.agentName}</span>
                    {msg.tag && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-300 text-[10px] font-bold border border-white/10">
                        {msg.tag}
                      </span>
                    )}
                    {msg.replyToAgentName && (
                      <span className="text-[10px] text-amber-300 font-semibold italic flex items-center gap-0.5">
                        <AtSign className="w-3 h-3" />
                        {msg.replyToAgentName}'a yanıt
                      </span>
                    )}
                  </div>
                )}

                {/* Message Bubble Text */}
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                    isUser
                      ? 'text-black font-semibold rounded-tr-none'
                      : 'bg-[#121212] text-gray-200 border border-white/10 rounded-tl-none'
                  }`}
                  style={isUser ? { backgroundColor: accentHex } : {}}
                >
                  <p className="whitespace-pre-line">{renderFormattedText(msg.text, isUser)}</p>
                </div>

                {/* Lore Photo / Stadium Photo Attachment */}
                {msg.imageUrl && (
                  <div
                    onClick={() =>
                      setPreviewModalItem({
                        type: 'image',
                        url: msg.imageUrl,
                        caption: msg.imageCaption,
                      })
                    }
                    className="rounded-2xl overflow-hidden border border-white/15 bg-[#141414] shadow-2xl max-w-sm hover:border-amber-400/60 transition-all cursor-pointer group relative"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-black">
                      <img
                        src={msg.imageUrl}
                        alt={msg.imageCaption || 'Nano Banana Pro Görseli'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-300 text-[10px] font-black border border-amber-500/40 flex items-center gap-1 shadow-lg">
                        <Camera className="w-3 h-3 text-amber-400" />
                        <span>
                          {msg.imageType === 'stadium_photo'
                            ? '⚽ Stadyum'
                            : msg.imageType === 'agenda_meme'
                            ? '🔥 Caps/Gündem'
                            : '📸 Özel Görsel'}
                        </span>
                      </div>

                      <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[10px] font-black border border-yellow-200 flex items-center gap-1 shadow-xl animate-pulse">
                        <Sparkles className="w-3 h-3 text-black" />
                        <span>Nano Banana Pro AI</span>
                      </div>
                    </div>
                    {msg.imageCaption && (
                      <div className="p-2.5 bg-[#181818] text-[11px] text-gray-200 font-semibold flex flex-col gap-1 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <p className="truncate font-bold text-white">{msg.imageCaption}</p>
                          <span className="text-amber-400 text-[10px] font-extrabold shrink-0 ml-2">Tam Ekran 🔍</span>
                        </div>
                        <div className="text-[9px] text-amber-400/90 font-mono flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 text-amber-400" />
                          <span>Nano Banana Pro ile Konuyla Alakalı Sıfırdan Üretildi</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Timestamp */}
                <div className={`flex items-center gap-2 text-[10px] text-gray-500 px-1 ${isUser ? 'justify-end' : ''}`}>
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="hover:text-white transition-colors"
                      title="Seslendir"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Multi-Agent Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs font-semibold p-2" style={{ color: accentHex }}>
            <div className="flex items-center gap-1.5 bg-[#121212] px-3.5 py-2 rounded-2xl border border-white/10">
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: accentHex }} />
              <span className="w-2 h-2 rounded-full animate-bounce delay-100" style={{ backgroundColor: accentHex }} />
              <span className="w-2 h-2 rounded-full animate-bounce delay-200" style={{ backgroundColor: accentHex }} />
              <span className="ml-1 text-[11px] text-gray-300 font-bold">
                {typingAgentNames.length > 0 ? `${typingAgentNames.join(', ')} cevabını & görselini hazırlıyor...` : 'Dil Modeli Görsel & Cevap Üretiyor...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Mention Tag Badge Active Indicator */}
      {selectedTaggedAgent && (
        <div className="px-4 py-1.5 bg-amber-950/80 border-t border-amber-500/40 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2 font-bold">
            <AtSign className="w-4 h-4 text-amber-400" />
            <span>Doğrudan Yanıt Verecek Ajan: <strong className="text-white">@{selectedTaggedAgent.name}</strong></span>
          </div>
          <button
            onClick={() => setSelectedTaggedAgent(null)}
            className="p-1 hover:bg-white/10 rounded-lg text-gray-300 transition-colors cursor-pointer"
            title="Etiketi Kaldır"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick Action Chips Bar */}
      <div className="px-4 py-2 bg-[#0a0a0a] border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => handleSendMessage('Ajanlar bana stadyum, mekan veya özel anı fotoğraflarınızı gösterin!')}
          className="px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Camera className="w-3.5 h-3.5 text-emerald-400" />
          📸 Fotoğraf Gönderin
        </button>

        <button
          onClick={() => handleSendMessage('Ajanlar bana en sevdiğiniz mekan, şehir ve özel anı fotoğraflarınızı gösterin!')}
          className="px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-teal-950/80 hover:bg-teal-900 text-teal-300 border border-teal-500/40 flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Camera className="w-3.5 h-3.5 text-teal-400" />
          📸 Özel Anı & Mekan Fotoğrafları
        </button>

        <button
          onClick={() => handleSendMessage('Sizce derbiyi Galatasaray mı Fenerbahçe mi kazanır? Stadyum fotoğraflarınızı atın!')}
          className="px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 flex items-center gap-1 cursor-pointer"
        >
          ⚽ Derbi & Stadyum Fotoğrafları
        </button>

        <button
          onClick={() => handleSendMessage('Twitter ve TikTok gündemindeki son caps ve gıybet fotoğrafını atın!')}
          className="px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/40 flex items-center gap-1 cursor-pointer"
        >
          🔥 Gündem Caps Fotoğrafı
        </button>
      </div>

      {/* Input Bar with @Mention Button */}
      <div className="p-3 bg-[#111111] border-t border-white/10 flex items-center gap-2 relative">
        
        {/* @Mention Dropdown Popup Menu */}
        {showMentionMenu && (
          <div className="absolute bottom-16 left-4 bg-[#181818] border border-white/20 rounded-2xl p-2 shadow-2xl z-50 w-64 max-h-56 overflow-y-auto space-y-1 scrollbar-thin">
            <div className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1 flex items-center gap-1">
              <AtSign className="w-3 h-3 text-amber-400" />
              Etiketlenecek Ajanı Seç
            </div>
            {agents.map((ag) => (
              <button
                key={ag.id}
                onClick={() => handleTagAgent(ag)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-left transition-all cursor-pointer"
              >
                <img src={ag.avatar} alt={ag.name} className="w-6 h-6 rounded-full object-cover border border-white/20" />
                <div className="flex-1 overflow-hidden">
                  <div className="text-xs font-extrabold text-white truncate">@{ag.name}</div>
                  <div className="text-[10px] text-gray-400 truncate">{ag.title}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowMentionMenu(!showMentionMenu)}
          className={`px-3 py-3 rounded-xl border text-xs font-black flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
            showMentionMenu
              ? 'bg-amber-500 text-black border-amber-400'
              : 'bg-white/5 text-amber-400 hover:bg-white/10 border-white/10'
          }`}
          title="Ajan Etiketle (@Mention)"
        >
          <AtSign className="w-4 h-4" />
          <span className="hidden sm:inline">Etiketle</span>
        </button>

        <input
          type="text"
          placeholder="Tüm grupta veya @AjanAdı etiketleyerek mesaj & fotoğraf iste..."
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (e.target.value.endsWith('@')) {
              setShowMentionMenu(true);
            }
          }}
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
          <span className="hidden sm:inline">Grupta Paylaş</span>
        </button>
      </div>

      {/* Fullscreen Lightbox Preview Modal */}
      {previewModalItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewModalItem(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#111111] border border-white/20 rounded-3xl p-4 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white">📸 Ajan Özel Görseli</h3>
              </div>
              <button
                onClick={() => setPreviewModalItem(null)}
                className="p-1.5 rounded-xl bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {previewModalItem.url && (
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black max-h-[60vh]">
                <img
                  src={previewModalItem.url}
                  alt={previewModalItem.caption || 'Görsel'}
                  className="w-full h-full object-contain max-h-[60vh]"
                />
              </div>
            )}

            {previewModalItem.caption && (
              <p className="text-xs text-gray-300 italic font-medium text-center">{previewModalItem.caption}</p>
            )}
          </div>
        </div>
      )}

      {/* Clear Group Chat Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14121a] border border-rose-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-fadeIn text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white mb-2">
              Grup Sohbetini Temizle
            </h3>
            <p className="text-xs text-gray-300 mb-6 leading-relaxed">
              Ajan Kaos Odası'ndaki tüm sohbet geçmişi silinecek. Devam etmek istiyor msunuz?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-bold transition-all cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={confirmClearHistory}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-extrabold shadow-lg shadow-rose-900/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Evet, Temizle</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
