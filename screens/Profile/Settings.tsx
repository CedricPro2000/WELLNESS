
import React, { useState } from 'react';
import { useApp } from '../../App';
import { translations } from '../../i18n';
import { Language } from '../../types';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { language, setLanguage, theme, setTheme, logout } = useApp();
  const t = (key: string) => translations[key]?.[language] || key;
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const langs: { id: Language; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'rw', label: 'Kinyarwanda' },
    { id: 'fr', label: 'Français' },
    { id: 'sw', label: 'Kiswahili' }
  ];

  const supportEmail = 'irakozecedric21@gmail.com';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[2.5rem] p-8 space-y-6 shadow-2xl scale-in-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-4xl mx-auto">🛡️</div>
            <h3 className="text-2xl font-black text-center">{t('privacyPolicy')}</h3>
            <div className="max-h-60 overflow-y-auto pr-2">
               <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed text-center font-medium">
                {t('privacySummary')}
                <br /><br />
                Your numeric biometric profile is stored locally and encrypted. We do not share your health metrics with third parties without explicit consent.
              </p>
            </div>
            <button 
              onClick={() => setShowPrivacyModal(false)}
              className="w-full bg-lime-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-lime-500/20 active:scale-95 transition-all"
            >
              UNDERSTOOD
            </button>
          </div>
        </div>
      )}

      <header className="p-6 flex items-center gap-4 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
        <button onClick={onBack} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 className="text-xl font-extrabold">{t('settings')}</h1>
      </header>

      <main className="flex-1 p-6 space-y-8 max-w-2xl mx-auto w-full pb-12">
        {/* Appearance */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1 text-center sm:text-left">Appearance</h3>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800 space-y-1">
             <div className="flex items-center justify-between p-3">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">🌓</div>
                 <span className="font-bold">Dark Mode</span>
               </div>
               <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={`w-14 h-8 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-lime-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}
               >
                 <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${theme === 'dark' ? 'left-7' : 'left-1'}`}></div>
               </button>
             </div>
          </div>
        </section>

        {/* Language */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1 text-center sm:text-left">Language</h3>
          <div className="bg-white dark:bg-zinc-900 p-2 rounded-3xl border border-zinc-100 dark:border-zinc-800">
             {langs.map(lang => (
               <button 
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${language === lang.id ? 'bg-lime-50 dark:bg-lime-900/20 text-lime-600' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
               >
                 <span className="font-bold">{lang.label}</span>
                 {language === lang.id && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>}
               </button>
             ))}
          </div>
        </section>

        {/* Privacy & Support */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1 text-center sm:text-left">Support & Privacy</h3>
          <div className="bg-white dark:bg-zinc-900 p-2 rounded-3xl border border-zinc-100 dark:border-zinc-800">
            <button 
              onClick={() => setShowPrivacyModal(true)}
              className="w-full flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-colors"
            >
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-xl">🛡️</div>
              <span className="font-bold">{t('privacyPolicy')}</span>
            </button>
            <a 
              href={`mailto:${supportEmail}`}
              className="w-full flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-colors"
            >
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-xl">✉️</div>
              <div className="flex flex-col items-start">
                <span className="font-bold">{t('support')}</span>
                <span className="text-[10px] text-zinc-400 font-medium">{supportEmail}</span>
              </div>
            </a>
          </div>
        </section>

        {/* Account & Security */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1 text-center sm:text-left">Account Management</h3>
          <div className="bg-white dark:bg-zinc-900 p-2 rounded-3xl border border-zinc-100 dark:border-zinc-800">
            <button 
              onClick={() => alert("Notification settings coming in the next update!")}
              className="w-full flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-colors"
            >
              <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-xl">🔔</div>
              <span className="font-bold">Notifications</span>
            </button>
            <button 
              onClick={() => {
                if(confirm("Are you sure you want to delete your account? This action is irreversible.")) {
                  alert("Account deletion request submitted.");
                  logout();
                }
              }}
              className="w-full flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-colors text-red-500"
            >
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-xl">🗑️</div>
              <span className="font-bold">Delete Account</span>
            </button>
          </div>
        </section>

        {/* Logout */}
        <button 
          onClick={logout}
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-red-500 font-black py-5 rounded-3xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          {t('logout')}
        </button>
      </main>
      
      <style>{`
        .scale-in-center { animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
        @keyframes scale-in-center {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Settings;
