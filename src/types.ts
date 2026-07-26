import { NeonTheme } from './utils/theme';

export type Category = 'Tümü' | 'Futbol/Spor' | 'Sosyal Medya/Mizah' | 'Anime' | 'Fantastik' | 'Bilim Kurgu' | 'Romantik' | 'Macera' | 'Gizem/Korku';

export type Gender = 'Kadın' | 'Erkek' | 'Non-Binary' | 'Robotik/Fantastik';

export type AgentMood = 'Neşeli' | 'Dalgın' | 'Heyecanlı' | 'Romantik' | 'Mistik' | 'Enerjik' | 'Ciddi' | 'Coşkulu';

export interface Agent {
  id: string;
  name: string;
  title: string;
  avatar: string;
  gender: Gender;
  category: Category;
  bio: string;
  greeting: string;
  personalityTraits: string[];
  voiceTone: string; // e.g. 'Sakin ve Bilge', 'Neşeli ve Enerjik'
  relationshipLevel: number; // 1-100 (Bond level)
  relationshipTitle: string; // 'Yeni Tanışılan', 'Samimi Arkadaş', 'Sırdaş', 'Ayrılmaz Bağ'
  xp: number;
  totalMessages: number;
  isOnline: boolean;
  isCustom?: boolean;
  createdAt: string;
  promptTemplate: string;
  keyFacts: string[];
  selfieStyle?: string;
  rating: number; // e.g. 4.9
  talkCount: number; // e.g. 12400
  
  // Dynamic Mood & Energy System
  energy: number; // 0 - 100
  happiness: number; // 0 - 100
  bond: number; // 0 - 100
  mood: AgentMood;
  moodEmoji: string;
  turkishOrigin: string; // e.g. "Galata Surları & Kadıköy, İstanbul"
}

export interface ChatMessage {
  id: string;
  agentId: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio';
  memorySaved?: boolean;
  memoryText?: string;
  emotion?: 'happy' | 'mysterious' | 'romantic' | 'excited' | 'serious' | 'surprised';
}

export interface MemoryItem {
  id: string;
  agentId: string;
  title: string;
  content: string;
  type: 'secret' | 'milestone' | 'fact' | 'promise';
  date: string;
  impactLevel: 'high' | 'medium' | 'normal';
  unlocked?: boolean;
  requiredBond?: number;
  image?: string;
  badge?: string;
}

export interface EventScenario {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  bannerImage: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor' | 'Efsanevi';
  description: string;
  startingPrompt: string;
  agentName: string;
  agentAvatar: string;
  tags: string[];
  location: string;
  galleryImages?: { url: string; caption: string; tag?: string }[];
  rewardBadge?: string;
  rewardXp?: number;
  participantCount?: number;
  loreBackground?: string;
}

export type EngineMode = 'local' | 'hybrid' | 'groq';

export interface UserSettings {
  engineMode: EngineMode;
  autoSpeak: boolean;
  voiceSpeed: number;
  userName: string;
  glowTheme: NeonTheme;
  localModelMemoryKb: number;
  groqApiKey?: string;
}

export interface GroupChatMessage {
  id: string;
  senderType: 'user' | 'agent' | 'system';
  agentId?: string;
  agentName?: string;
  agentAvatar?: string;
  text: string;
  timestamp: string;
  replyToAgentName?: string;
  tag?: string;
  imageUrl?: string;
  imageCaption?: string;
  imageType?: 'lore_photo' | 'whatsapp_dm' | 'agenda_meme' | 'stadium_photo' | 'tech_screen';
  whatsappDmData?: {
    senderName: string;
    receiverName: string;
    receiverAvatar?: string;
    messages: { senderName: string; text: string; time: string; isMe: boolean }[];
  };
}
