import React, { useState } from 'react';
import { User, Lock, Mail, UserCheck, Shield, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { NeoLogo } from './NeoLogo';

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

interface AuthModalProps {
  onLoginSuccess: (user: UserAccount) => void;
  accentHex?: string;
}

const USERS_STORAGE_KEY = 'xasil_users_db';
const ACTIVE_USER_KEY = 'xasil_active_user';

export function getRegisteredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function getActiveUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

export function logoutActiveUser() {
  localStorage.removeItem(ACTIVE_USER_KEY);
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess, accentHex = '#00F0FF' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Loading & Transition state
  const [isLoadingTransition, setIsLoadingTransition] = useState(false);
  const [loadingUser, setLoadingUser] = useState<UserAccount | null>(null);

  // Login State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [regUsername, setRegUsername] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');

  // Status & Error Banners
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Trigger login transition
  const triggerLoginTransition = (user: UserAccount) => {
    setLoadingUser(user);
    setIsLoadingTransition(true);
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    
    setTimeout(() => {
      onLoginSuccess(user);
    }, 2400);
  };

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanUsername = loginUsername.trim().toLowerCase();
    const cleanPassword = loginPassword.trim();

    if (!cleanUsername || !cleanPassword) {
      setErrorMessage('Lütfen kullanıcı adı ve şifrenizi giriniz.');
      return;
    }

    const users = getRegisteredUsers();
    const user = users.find(
      (u) => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanUsername
    );

    if (!user || user.passwordHash !== cleanPassword) {
      setErrorMessage('Hatalı kullanıcı adı veya şifre! Lütfen bilgilerinizi kontrol edin.');
      return;
    }

    // Success login with animated logo transition
    triggerLoginTransition(user);
  };

  // Handle Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanUsername = regUsername.trim().toLowerCase();
    const cleanFullName = regFullName.trim();
    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanPassword = regPassword.trim();

    if (!cleanUsername || !cleanFullName || !cleanPassword) {
      setErrorMessage('Lütfen zorunlu alanları (Kullanıcı Adı, Ad Soyad, Şifre) doldurunuz.');
      return;
    }

    if (cleanPassword.length < 4) {
      setErrorMessage('Şifreniz en az 4 karakter uzunluğunda olmalıdır.');
      return;
    }

    if (cleanPassword !== regPasswordConfirm.trim()) {
      setErrorMessage('Girdiğiniz şifreler eşleşmiyor.');
      return;
    }

    const users = getRegisteredUsers();
    const existing = users.find(
      (u) => u.username.toLowerCase() === cleanUsername || (cleanEmail && u.email.toLowerCase() === cleanEmail)
    );

    if (existing) {
      setErrorMessage('Bu kullanıcı adı veya e-posta adresi zaten kayıtlı! Lütfen giriş yapınız.');
      return;
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      username: regUsername.trim(),
      fullName: cleanFullName,
      email: cleanEmail || `${cleanUsername}@xasil.ai`,
      passwordHash: cleanPassword,
      createdAt: new Date().toLocaleDateString('tr-TR'),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    // Automatically trigger transition into app
    triggerLoginTransition(newUser);
  };

  if (isLoadingTransition && loadingUser) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-fadeIn">
        {/* Glowing Background Pulse */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-25 animate-pulse pointer-events-none"
          style={{ backgroundColor: accentHex }}
        />

        {/* Animated Spinning Neo Logo */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-28 h-28 rounded-3xl border-2 border-dashed animate-spin p-2"
            style={{ borderColor: accentHex, animationDuration: '3s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center scale-125">
            <NeoLogo accentHex={accentHex} />
          </div>
        </div>

        <div className="space-y-2 relative z-10 max-w-sm">
          <h3 className="text-xl font-black text-white tracking-wide">
            Giriş Yapılıyor...
          </h3>
          <p className="text-xs font-semibold text-gray-400">
            Hoş geldin, <span className="text-white font-bold">{loadingUser.fullName}</span>! XASİL Ajanlar dünyası ve kişiselleştirilmiş hafıza senkronize ediliyor.
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full rounded-full animate-[pulse_1s_infinite]"
            style={{
              backgroundColor: accentHex,
              width: '100%',
              boxShadow: `0 0 12px ${accentHex}`,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      {/* Background Cyber Glow */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: accentHex }}
      />

      <div className="relative w-full max-w-md bg-[#0f1117] rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 my-auto">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-2 border-b border-white/10 pb-5">
          <NeoLogo accentHex={accentHex} />
          <p className="text-xs font-semibold text-gray-400 max-w-xs pt-1">
            XASİL Ajanlar Dünyasına Hoş Geldiniz. Lütfen hesabınıza giriş yapın veya ücretsiz oluşturun.
          </p>
        </div>

        {/* Tab Selection Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#050505] rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? 'bg-white/10 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
            style={activeTab === 'login' ? { color: accentHex, borderBottom: `2px solid ${accentHex}` } : {}}
          >
            <UserCheck className="w-4 h-4" />
            Giriş Yap
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-white/10 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
            style={activeTab === 'register' ? { color: accentHex, borderBottom: `2px solid ${accentHex}` } : {}}
          >
            <Sparkles className="w-4 h-4" />
            Kayıt Ol
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert Box */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" />
                Kullanıcı Adı veya E-posta
              </label>
              <input
                type="text"
                placeholder="Örn: xasil_kullanici"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00F0FF] focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                Şifre
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#00F0FF] focus:outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-black font-extrabold text-xs shadow-lg transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 mt-2"
              style={{ backgroundColor: accentHex, boxShadow: `0 0 20px ${accentHex}50` }}
            >
              <span>Uygulamaya Giriş Yap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" />
                Kullanıcı Adı <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Örn: xasil_kullanici"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                className="w-full bg-[#050505] text-white text-xs rounded-xl p-2.5 border border-white/10 focus:border-[#00F0FF] focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gray-400" />
                Ad Soyad / Profil İsmi <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Örn: XASİL Ajan Sever"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                className="w-full bg-[#050505] text-white text-xs rounded-xl p-2.5 border border-white/10 focus:border-[#00F0FF] focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                E-posta Adresi (İsteğe Bağlı)
              </label>
              <input
                type="email"
                placeholder="xasil_kullanici@xasil.ai"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full bg-[#050505] text-white text-xs rounded-xl p-2.5 border border-white/10 focus:border-[#00F0FF] focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  Şifre <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-2.5 border border-white/10 focus:border-[#00F0FF] focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  Şifre Tekrarı <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regPasswordConfirm}
                  onChange={(e) => setRegPasswordConfirm(e.target.value)}
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-2.5 border border-white/10 focus:border-[#00F0FF] focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-black font-extrabold text-xs shadow-lg transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 mt-2"
              style={{ backgroundColor: accentHex, boxShadow: `0 0 20px ${accentHex}50` }}
            >
              <Shield className="w-4 h-4" />
              <span>Hemen Ücretsiz Kayıt Ol</span>
            </button>
          </form>
        )}

        {/* Footer Note */}
        <div className="pt-2 text-center text-[10px] text-gray-500 border-t border-white/5">
          E-posta doğrulaması gerekmez. Bilgileriniz cihazınızın yerel depolamasında güvenle saklanır.
        </div>

      </div>
    </div>
  );
};
