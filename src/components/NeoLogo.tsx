import React from 'react';

interface NeoLogoProps {
  accentHex?: string;
  onClick?: () => void;
}

export const NeoLogo: React.FC<NeoLogoProps> = ({ accentHex = '#00F0FF', onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer group select-none py-1"
      title="XASİL Sohbet Ajanları - Yerli Neo-Mavi Siber AI Çekirdeği"
    >
      {/* Neo-Mavi Hybrid Logo Icon Container */}
      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
        
        {/* Outer Pulsing Ambient Neon Glow Halo */}
        <div className="absolute inset-0 rounded-2xl bg-[#00F0FF]/20 blur-md animate-neo-pulse group-hover:bg-[#00F0FF]/35 transition-all" />

        {/* Cyberpunk Holographic Rotating Outer Ring 1 (Clockwise Dashed Ring) */}
        <div className="absolute inset-0 rounded-2xl border border-dashed border-[#00F0FF]/60 animate-spin-fast p-0.5 opacity-80" />

        {/* Cyberpunk Holographic Rotating Inner Ring 2 (Counter-Clockwise Tech Ring) */}
        <div className="absolute inset-1 rounded-xl border border-dotted border-[#00F0FF] animate-spin-reverse opacity-90" />

        {/* Corner Cyber Nodes */}
        <span className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#00F0FF] rounded-full shadow-[0_0_6px_#00F0FF]" />
        <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#FF2A55] rounded-full shadow-[0_0_6px_#FF2A55]" />
        <span className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-[#FF2A55] rounded-full shadow-[0_0_6px_#FF2A55]" />
        <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#00F0FF] rounded-full shadow-[0_0_6px_#00F0FF]" />

        {/* Main Center Badge with Metallic/Neon Cyber Gradient */}
        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#0a0f1d] via-[#00223e] to-[#040914] border border-[#00F0FF]/80 flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,240,255,0.4)] overflow-hidden group-hover:scale-105 transition-transform duration-300">
          
          {/* Subtle Cyber Circuit Background Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 40 40">
            <path d="M0 10 H40 M10 0 V40 M0 30 H40 M30 0 V40" stroke="#00F0FF" strokeWidth="0.5" strokeDasharray="1 2" />
          </svg>

          {/* Glowing Metallic / Neon Blue "X" Letter */}
          <div className="relative font-black text-2xl tracking-tighter bg-gradient-to-tr from-[#00F0FF] via-[#70E0FF] to-[#FFFFFF] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(0,240,255,0.9)] z-10 flex items-center justify-center">
            X
          </div>

          {/* Integrated Yerli Neon Crescent & Star (Hilal & Yıldız) Badge */}
          <div className="absolute -bottom-0.5 -right-0.5 z-20 flex items-center justify-center bg-[#0d020a] border border-[#FF2A55] rounded-full px-0.5 py-0.5 shadow-[0_0_8px_rgba(255,42,85,0.9)] animate-pulse">
            <svg className="w-3.5 h-3.5 text-[#FF2A55]" viewBox="0 0 24 24" fill="currentColor">
              {/* Crescent Hilal */}
              <path d="M12 2a10 10 0 1 0 10 10 8 8 0 0 1-10-10z" />
              {/* Star Yıldız */}
              <path d="M18.5 7.5l1.2 2.4 2.6.4-1.9 1.8.4 2.6-2.3-1.2-2.3 1.2.4-2.6-1.9-1.8 2.6-.4z" fill="#FFD700" />
            </svg>
          </div>
        </div>

        {/* Live Active Status Indicator Node */}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#0a0a0a] rounded-full animate-ping z-30" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#0a0a0a] rounded-full z-30" />
      </div>

      {/* Brand Title & Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          {/* Futuristic Glowing XASİL Title */}
          <span className="font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#80F2FF] to-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
            XASİL
          </span>

          {/* Yerli Siber Badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black tracking-widest text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/40 rounded-md shadow-[0_0_10px_rgba(0,240,255,0.2)] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A55] animate-pulse" />
            SOHBET AJANLARI
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-[10px] font-bold text-gray-400 tracking-wide flex items-center gap-1">
          <span className="text-[#00F0FF]">⚡</span> Yerli Neo-Mavi Siber AI Çekirdeği
        </p>
      </div>
    </div>
  );
};
