import React, { useState, useEffect } from 'react';
import { Agent, UserSettings } from './types';
import { getAgents, getSettings, saveSettings } from './utils/storage';
import { getThemeConfig } from './utils/theme';
import { Navbar } from './components/Navbar';
import { DiscoverView } from './components/DiscoverView';
import { ChatView } from './components/ChatView';
import { GroupChatView } from './components/GroupChatView';
import { MemoryPanel } from './components/MemoryPanel';
import { AgentStudio } from './components/AgentStudio';
import { EventCards } from './components/EventCards';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal, getActiveUser, logoutActiveUser, UserAccount } from './components/AuthModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(getActiveUser());
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeTab, setActiveTab] = useState<'discover' | 'chat' | 'group' | 'memory' | 'studio' | 'events'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettingsState] = useState<UserSettings>(getSettings());
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const activeTheme = getThemeConfig(settings.glowTheme);

  useEffect(() => {
    const loadedAgents = getAgents();
    setAgents(loadedAgents);
    if (loadedAgents.length > 0) {
      setSelectedAgent(loadedAgents[0]);
    }
  }, []);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.fullName || user.username) {
      const updated = { ...settings, userName: user.fullName || user.username };
      setSettingsState(updated);
      saveSettings(updated);
    }
  };

  const handleLogout = () => {
    logoutActiveUser();
    setCurrentUser(null);
  };

  const handleSelectAgentAndChat = (agent: Agent) => {
    setSelectedAgent(agent);
    setActiveTab('chat');
  };

  const handleUpdateAgent = (updatedAgent: Agent) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === updatedAgent.id ? updatedAgent : a))
    );
    if (selectedAgent?.id === updatedAgent.id) {
      setSelectedAgent(updatedAgent);
    }
  };

  const handleAgentCreated = (newAgent: Agent) => {
    setAgents((prev) => [newAgent, ...prev]);
    setSelectedAgent(newAgent);
    setActiveTab('chat');
  };

  const handleStartScenario = (agent: Agent, startingPrompt: string) => {
    setSelectedAgent(agent);
    setActiveTab('chat');
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettingsState(newSettings);
    saveSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-white selection:text-black flex flex-col justify-between">
      {/* Background Neon Grid & Radial Glow */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-700 opacity-15"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% -20%, ${activeTheme.hex}, rgba(0,0,0,0))`
        }}
      />

      {/* Auth Screen Modal (Shown when not logged in) */}
      {!currentUser && (
        <AuthModal
          onLoginSuccess={handleLoginSuccess}
          accentHex={activeTheme.hex}
        />
      )}

      <div>
        {/* Main Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          engineMode={settings.engineMode}
          setEngineMode={(mode) => handleSaveSettings({ ...settings, engineMode: mode })}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSettings={() => setShowSettingsModal(true)}
          activeAgentName={selectedAgent?.name}
          accentHex={activeTheme.hex}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Content Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 relative z-10">
          {activeTab === 'discover' && (
            <DiscoverView
              agents={agents}
              onSelectAgent={handleSelectAgentAndChat}
              onCreateNew={() => setActiveTab('studio')}
              onSelectEventScenario={() => setActiveTab('events')}
              onOpenGroupChat={() => setActiveTab('group')}
              accentHex={activeTheme.hex}
            />
          )}

          {activeTab === 'chat' && selectedAgent && (
            <ChatView
              agent={selectedAgent}
              engineMode={settings.engineMode}
              onBackToDiscover={() => setActiveTab('discover')}
              onOpenMemoryPanel={(ag) => {
                setSelectedAgent(ag);
                setActiveTab('memory');
              }}
              onUpdateAgent={handleUpdateAgent}
              accentHex={activeTheme.hex}
            />
          )}

          {activeTab === 'group' && (
            <GroupChatView
              agents={agents}
              onBackToDiscover={() => setActiveTab('discover')}
              accentHex={activeTheme.hex}
            />
          )}

          {activeTab === 'memory' && selectedAgent && (
            <MemoryPanel
              agents={agents}
              selectedAgent={selectedAgent}
              onSelectAgent={(ag) => setSelectedAgent(ag)}
              onGoToChat={(ag) => {
                setSelectedAgent(ag);
                setActiveTab('chat');
              }}
              accentHex={activeTheme.hex}
            />
          )}

          {activeTab === 'studio' && (
            <AgentStudio onAgentCreated={handleAgentCreated} />
          )}

          {activeTab === 'events' && (
            <EventCards
              agents={agents}
              onStartScenario={handleStartScenario}
            />
          )}
        </main>
      </div>

      {/* Footer / Status Bar - Elegant Dark Theme */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] py-4 px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-20 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full animate-pulse shadow-md" style={{ backgroundColor: activeTheme.hex, boxShadow: `0 0 8px ${activeTheme.hex}` }} />
          <div>
            <p className="font-bold text-white">
              {selectedAgent ? `Aktif Ajan: ${selectedAgent.name}` : 'XASİL Yapay Zeka Platformu'}
            </p>
            <p className="text-[10px] font-medium" style={{ color: activeTheme.hex }}>
              {settings.engineMode === 'local' ? 'Yerel Offline Model Aktif' : settings.engineMode === 'groq' ? 'Groq Llama 3 Modeli Aktif' : 'XASİL Hibrit AI Çekirdeği'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-[11px] font-medium text-gray-500">
          <span onClick={() => setActiveTab('discover')} className="hover:text-white cursor-pointer transition-colors">KEŞFET</span>
          <span onClick={() => setActiveTab('studio')} className="hover:text-white cursor-pointer transition-colors">STÜDYO</span>
          <span onClick={() => setShowSettingsModal(true)} className="hover:text-white cursor-pointer transition-colors">AYARLAR</span>
          <span className="font-bold uppercase tracking-wider" style={{ color: activeTheme.hex }}>v2.0.0 TURKISH_HYBRID</span>
        </div>
      </footer>

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
