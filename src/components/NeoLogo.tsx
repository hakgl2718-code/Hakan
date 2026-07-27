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
      {/* Cyber Badge Icon Container with Pulsing Halo */}
      <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
        
        {/* Ambient Neon Blue Glow Aura */}
        <div
          className="absolute inset-0 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-neo-pulse"
          style={{ backgroundColor: accentHex }}
        />

        {/* Futuristic Cyber Badge SVG Image */}
        <img
          src="/ic_launcher.svg"
          alt="XASİL Siber Logo"
          referrerPolicy="no-referrer"
          className="relative w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,210,255,0.8)] group-hover:scale-105 transition-transform duration-300 z-10"
        />

        {/* Live Active Status Indicator Node */}
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#0a0a0a] rounded-full animate-ping z-20" />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#0a0a0a] rounded-full z-20" />
      </div>

      {/* Brand Title & Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          {/* Futuristic Glowing XASİL Title */}
          <span className="font-black text-lg sm:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#80F2FF] to-[#00F0FF] drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]">
            XASİL
          </span>

          {/* Yerli Siber Badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black tracking-widest text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/40 rounded-md shadow-[0_0_10px_rgba(0,240,255,0.25)] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A55] animate-pulse" />
            SOHBET AJANLARI
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-[10px] font-bold text-gray-400 tracking-wide flex items-center gap-1 hidden xs:flex">
          <span className="text-[#00F0FF]">⚡</span> Yerli Neo-Mavi Siber AI Çekirdeği
        </p>
      </div>
    </div>
  );
};

