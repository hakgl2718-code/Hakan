import React, { useState, useEffect } from 'react';
import { Agent } from '../types';
import { X, Volume2, Sparkles, ChevronDown, ChevronUp, Check, VolumeX } from 'lucide-react';
import { speakTextTurkish } from '../utils/soundBank';

interface AgentOverlayCardProps {
  isOpen: boolean;
  agent: Agent;
  messageText: string;
  onClose: () => void;
  accentHex?: string;
  autoSpeak?: boolean;
}

export const AgentOverlayCard: React.FC<AgentOverlayCardProps> = ({
  isOpen,
  agent,
  messageText,
  onClose,
  accentHex = '#F59E0B', // Default amber gold like in screenshot
  autoSpeak = false,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Character limit for collapsed speech bubble view
  const PREVIEW_LIMIT = 150;
  const isLongMessage = messageText.length > PREVIEW_LIMIT;

  // Typewriter effect
  useEffect(() => {
    if (!isOpen || !messageText) {
      setDisplayedText('');
      setIsTypingFinished(false);
      setIsExpanded(false);
      return;
    }

    setDisplayedText('');
    setIsTypingFinished(false);
    setIsExpanded(false);

    let currentIndex = 0;
    const targetText = messageText;
    const speed = Math.max(8, Math.min(25, Math.floor(6000 / targetText.length)));

    const timer = setInterval(() => {
      currentIndex++;
      setDisplayedText(targetText.slice(0, currentIndex));

      if (currentIndex >= targetText.length) {
        clearInterval(timer);
        setIsTypingFinished(true);
      }
    }, speed);

    if (autoSpeak) {
      speakTextTurkish(messageText);
      setIsSpeaking(true);
    }

    return () => clearInterval(timer);
  }, [isOpen, messageText, autoSpeak]);

  if (!isOpen) return null;

  const handleSpeakToggle = () => {
    if (isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speakTextTurkish(messageText);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 8000);
    }
  };

  const handleSkipTyping = () => {
    setDisplayedText(messageText);
    setIsTypingFinished(true);
  };

  // Truncated preview text if collapsed and still typing / long
  const textToShow = !isExpanded && isLongMessage && isTypingFinished
    ? messageText.slice(0, PREVIEW_LIMIT) + '...'
    : displayedText;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none flex items-end justify-end p-2 sm:p-6 overflow-hidden">
      {/* Soft Semi-Transparent Vignette Background */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto transition-opacity duration-300 animate-fadeIn"
      />

      {/* Floating Container: Character Avatar on Right + Attached Speech Bubble */}
      <div className="relative z-50 pointer-events-auto w-full max-w-4xl flex flex-col md:flex-row items-end justify-end gap-3 sm:gap-6 pb-2 sm:pb-4 animate-slideUp">
        
        {/* 1. SPEECH BUBBLE (Pop-up dialogue beside/in front of the character) */}
        <div className="w-full md:w-3/5 lg:w-2/3 order-2 md:order-1 mb-2 md:mb-12 transition-all duration-300">
          <div
            className="relative bg-[#0d121d]/95 border-2 rounded-3xl p-4 sm:p-6 shadow-[0_15px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl space-y-3"
            style={{
              borderColor: accentHex,
              boxShadow: `0 0 35px ${accentHex}45`,
            }}
          >
            {/* Pointer Tail pointing towards the Character Avatar on the right */}
            <div
              className="hidden md:block absolute -right-3 bottom-8 w-0 h-0 border-y-8 border-y-transparent border-l-[14px]"
              style={{ borderLeftColor: accentHex }}
            />

            {/* Bubble Top Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full border flex items-center justify-center font-black text-xs text-black shadow-md"
                  style={{ backgroundColor: accentHex, borderColor: '#ffffff50' }}
                >
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white leading-tight flex items-center gap-1.5">
                    {agent.name}
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-black"
                      style={{ backgroundColor: accentHex }}
                    >
                      Canlı Mesaj
                    </span>
                  </h4>
                  <p className="text-[10px] text-gray-400">{agent.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSpeakToggle}
                  className={`p-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                    isSpeaking
                      ? 'bg-amber-400 text-black border-amber-300 shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-gray-200 border-white/10'
                  }`}
                  title="Seslendir"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{isSpeaking ? 'Durdur' : 'Seslendir'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-red-500/30 text-gray-300 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
                  title="Kapat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Speech Bubble Text Content */}
            <div
              className={`text-sm sm:text-base text-gray-100 font-medium leading-relaxed whitespace-pre-wrap ${
                isExpanded ? 'max-h-[320px] overflow-y-auto pr-2 custom-scrollbar' : 'max-h-[140px] overflow-hidden'
              }`}
              onClick={!isTypingFinished ? handleSkipTyping : undefined}
            >
              {textToShow}
              {!isTypingFinished && (
                <span
                  className="inline-block w-2 h-4 ml-1 animate-pulse rounded-sm align-middle"
                  style={{ backgroundColor: accentHex }}
                />
              )}
            </div>

            {/* Bottom Actions: Devamını Oku (Read More) or Close */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
              {isLongMessage && isTypingFinished && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="px-3.5 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg transform hover:scale-105"
                  style={{
                    backgroundColor: `${accentHex}35`,
                    borderColor: accentHex,
                    color: '#ffffff',
                    border: '1px solid',
                  }}
                >
                  {isExpanded ? (
                    <>
                      <span>Kısalt (Daralt)</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                      <span>Devamını Oku (Mesajın Tamamı)</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}

              {!isTypingFinished && (
                <button
                  onClick={handleSkipTyping}
                  className="px-3 py-1 rounded-lg bg-white/10 text-gray-300 text-xs font-bold hover:bg-white/20 transition-all cursor-pointer"
                >
                  Hızlı Yazdır ⏩
                </button>
              )}

              <button
                onClick={onClose}
                className="ml-auto px-4 py-1.5 rounded-xl font-black text-xs text-black transition-all cursor-pointer shadow-md hover:scale-105 flex items-center gap-1"
                style={{ backgroundColor: accentHex }}
              >
                <span>Anladım / Sohbete Dön</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. AVATAR KARAKTERİ (Görseldeki Gibi Ekranın Sağında Beliren Karakter) */}
        <div className="w-48 sm:w-64 md:w-80 lg:w-96 order-1 md:order-2 flex-shrink-0 relative group">
          {/* Avatar Behind Glow Halo */}
          <div
            className="absolute bottom-0 w-full h-full rounded-full blur-3xl opacity-40 animate-pulse pointer-events-none"
            style={{ backgroundColor: accentHex }}
          />

          {/* Character Cutout Standing Frame */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[420px] overflow-hidden rounded-t-3xl border-t-2 border-x-2 shadow-[0_0_50px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:scale-[1.02]">
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-full h-full object-cover object-top filter brightness-105 contrast-105"
            />
            {/* Bottom Fade Gradient for Smooth Blending with UI */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent opacity-90" />

            {/* Glowing Accent Border */}
            <div
              className="absolute inset-0 rounded-t-3xl border-t-2 border-x-2 pointer-events-none opacity-80"
              style={{ borderColor: accentHex }}
            />

            {/* Floating Character Badge */}
            <div className="absolute bottom-3 left-3 right-3 p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-center">
              <span className="text-xs font-black text-white block truncate">{agent.name}</span>
              <span className="text-[10px] text-amber-300 font-bold block truncate">{agent.relationshipTitle || 'XASİL Ajanı'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
