import { Agent, ChatMessage, MemoryItem, UserSettings } from '../types';
import { INITIAL_AGENTS } from '../data/initialAgents';

const AGENTS_KEY = 'xasil_agents';
const SETTINGS_KEY = 'xasil_settings';

export const DEFAULT_SETTINGS: UserSettings = {
  engineMode: 'hybrid',
  autoSpeak: false,
  voiceSpeed: 1.0,
  userName: 'Kullanıcı',
  glowTheme: 'cyan',
  localModelMemoryKb: 2048,
};

// Agents storage
export function getAgents(): Agent[] {
  try {
    const data = localStorage.getItem(AGENTS_KEY);
    if (!data) {
      localStorage.setItem(AGENTS_KEY, JSON.stringify(INITIAL_AGENTS));
      return INITIAL_AGENTS;
    }
    const parsed: Agent[] = JSON.parse(data);
    // Ensure initial agents exist if new ones were added
    const ids = new Set(parsed.map((a) => a.id));
    const missing = INITIAL_AGENTS.filter((a) => !ids.has(a.id));
    if (missing.length > 0) {
      const merged = [...parsed, ...missing];
      localStorage.setItem(AGENTS_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (e) {
    console.error('Error loading agents:', e);
    return INITIAL_AGENTS;
  }
}

export function saveAgent(agent: Agent): void {
  const agents = getAgents();
  const index = agents.findIndex((a) => a.id === agent.id);
  if (index >= 0) {
    agents[index] = agent;
  } else {
    agents.unshift(agent);
  }
  localStorage.setItem(AGENTS_KEY, JSON.stringify(agents));
}

// Chat Messages storage
export function getChatMessages(agentId: string): ChatMessage[] {
  try {
    const data = localStorage.getItem(`xasil_chat_${agentId}`);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading chat messages:', e);
    return [];
  }
}

export function saveChatMessage(agentId: string, message: ChatMessage): ChatMessage[] {
  const messages = getChatMessages(agentId);
  messages.push(message);
  localStorage.setItem(`xasil_chat_${agentId}`, JSON.stringify(messages));
  return messages;
}

export function clearChatHistory(agentId: string): void {
  localStorage.removeItem(`xasil_chat_${agentId}`);
}

// Memory items storage
export function getMemories(agentId: string): MemoryItem[] {
  try {
    const data = localStorage.getItem(`xasil_memories_${agentId}`);
    if (!data) {
      // Create initial memories for pre-built agents
      const initialMemories = getInitialMemoriesForAgent(agentId);
      if (initialMemories.length > 0) {
        localStorage.setItem(`xasil_memories_${agentId}`, JSON.stringify(initialMemories));
        return initialMemories;
      }
      return [];
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading memories:', e);
    return [];
  }
}

export function addMemory(agentId: string, item: MemoryItem): MemoryItem[] {
  const memories = getMemories(agentId);
  memories.unshift(item);
  localStorage.setItem(`xasil_memories_${agentId}`, JSON.stringify(memories));
  return memories;
}

export function deleteMemory(agentId: string, memoryId: string): MemoryItem[] {
  const memories = getMemories(agentId).filter((m) => m.id !== memoryId);
  localStorage.setItem(`xasil_memories_${agentId}`, JSON.stringify(memories));
  return memories;
}

// Settings storage
export function getSettings(): UserSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Initial Memory Generator for Seed Agents
function getInitialMemoriesForAgent(agentId: string): MemoryItem[] {
  const now = new Date().toLocaleDateString('tr-TR');
  if (agentId === 'asya-neon') {
    return [
      {
        id: 'mem-1',
        agentId: 'asya-neon',
        title: 'Gece Devriyesi Karşılaşması',
        content: 'Matrix güvenlik duvarlarını birlikte aşarken ilk kez iletişim kurduk. Asya bana özel terminal erişimi verdi.',
        type: 'milestone',
        date: now,
        impactLevel: 'high',
      },
      {
        id: 'mem-2',
        agentId: 'asya-neon',
        title: 'Favori Kahve Sırrı',
        content: 'Asya soğuk elektrik kahvesine bayıldığını ve geceleri kod yazarken sadece bu içecekle odaklanabildiğini söyledi.',
        type: 'secret',
        date: now,
        impactLevel: 'normal',
      },
    ];
  } else if (agentId === 'sera-romance') {
    return [
      {
        id: 'mem-3',
        agentId: 'sera-romance',
        title: 'Gece Yağmuru Bestesi',
        content: 'Yağmurlu bir gecede piyanoda ilk çalındığı anda dinlediğim özel melodi. Bu parçayı bana ithaf etti.',
        type: 'promise',
        date: now,
        impactLevel: 'high',
      },
    ];
  } else if (agentId === 'kaelen-wizard') {
    return [
      {
        id: 'mem-4',
        agentId: 'kaelen-wizard',
        title: 'Gümüş Rün Mührü',
        content: 'Kadim kütüphanede korunmam için gümüş ışık saçan bir rün sembolü hediye etti.',
        type: 'fact',
        date: now,
        impactLevel: 'medium',
      },
    ];
  }
  return [];
}
