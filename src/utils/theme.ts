export type NeonTheme = 'cyan' | 'purple' | 'green' | 'red' | 'amber' | 'pink';

export interface ThemeConfig {
  id: NeonTheme;
  name: string;
  hex: string;
  borderClass: string;
  bgGlowClass: string;
  badgeBg: string;
  textClass: string;
  btnBg: string;
  btnHover: string;
  shadowGlow: string;
  gradientFromTo: string;
}

export const THEME_PRESETS: Record<NeonTheme, ThemeConfig> = {
  cyan: {
    id: 'cyan',
    name: 'Siber Mavi (Cyan)',
    hex: '#00D2FF',
    borderClass: 'border-[#00D2FF]',
    bgGlowClass: 'bg-[#00D2FF]/10',
    badgeBg: 'bg-[#00D2FF]',
    textClass: 'text-[#00D2FF]',
    btnBg: 'bg-[#00D2FF]',
    btnHover: 'hover:bg-[#00B8E6]',
    shadowGlow: 'shadow-[0_0_20px_rgba(0,210,255,0.4)]',
    gradientFromTo: 'from-[#00D2FF] to-[#3a7bd5]',
  },
  purple: {
    id: 'purple',
    name: 'Siber Mor (Purple)',
    hex: '#a855f7',
    borderClass: 'border-purple-500',
    bgGlowClass: 'bg-purple-500/10',
    badgeBg: 'bg-purple-500',
    textClass: 'text-purple-400',
    btnBg: 'bg-purple-500',
    btnHover: 'hover:bg-purple-600',
    shadowGlow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    gradientFromTo: 'from-purple-500 to-indigo-600',
  },
  green: {
    id: 'green',
    name: 'Zehir Yeşili (Emerald)',
    hex: '#10b981',
    borderClass: 'border-emerald-500',
    bgGlowClass: 'bg-emerald-500/10',
    badgeBg: 'bg-emerald-500',
    textClass: 'text-emerald-400',
    btnBg: 'bg-emerald-500',
    btnHover: 'hover:bg-emerald-600',
    shadowGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    gradientFromTo: 'from-emerald-400 to-teal-600',
  },
  red: {
    id: 'red',
    name: 'Kan Kırmızısı (Crimson)',
    hex: '#ef4444',
    borderClass: 'border-red-500',
    bgGlowClass: 'bg-red-500/10',
    badgeBg: 'bg-red-500',
    textClass: 'text-red-400',
    btnBg: 'bg-red-500',
    btnHover: 'hover:bg-red-600',
    shadowGlow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    gradientFromTo: 'from-red-500 to-rose-700',
  },
  amber: {
    id: 'amber',
    name: 'Altın Amber (Gold)',
    hex: '#f59e0b',
    borderClass: 'border-amber-500',
    bgGlowClass: 'bg-amber-500/10',
    badgeBg: 'bg-amber-500',
    textClass: 'text-amber-400',
    btnBg: 'bg-amber-500',
    btnHover: 'hover:bg-amber-600',
    shadowGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    gradientFromTo: 'from-amber-400 to-orange-600',
  },
  pink: {
    id: 'pink',
    name: 'Siber Pembe (Neon Pink)',
    hex: '#ec4899',
    borderClass: 'border-pink-500',
    bgGlowClass: 'bg-pink-500/10',
    badgeBg: 'bg-pink-500',
    textClass: 'text-pink-400',
    btnBg: 'bg-pink-500',
    btnHover: 'hover:bg-pink-600',
    shadowGlow: 'shadow-[0_0_20px_rgba(236,72,153,0.4)]',
    gradientFromTo: 'from-pink-500 to-rose-600',
  },
};

export function getThemeConfig(themeKey?: NeonTheme): ThemeConfig {
  if (themeKey && THEME_PRESETS[themeKey]) {
    return THEME_PRESETS[themeKey];
  }
  return THEME_PRESETS.cyan;
}
