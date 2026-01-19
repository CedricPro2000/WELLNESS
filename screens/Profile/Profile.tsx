
import React, { useState } from 'react';
import { useApp } from '../../App';
import { translations } from '../../i18n';

interface ProfileProps {
  onNavigate: (view: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { auth, language } = useApp();
  const t = (key: string) => translations[key]?.[language] || key;
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(auth.user?.name || '');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <header className="p-6 flex items-center justify-between bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-20">
        <button onClick={() => onNavigate('home')} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 className="text-xl font-extrabold">{t('profile')}</h1>
        <button onClick={() => onNavigate('settings')} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </header>

      <main className="flex-1 p-6 space-y-8 max-w-2xl mx-auto w-full pb-12">
        {/* User Basic Info */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-32 h-32 rounded-[2.5rem] bg-lime-100 p-1 border-4 border-white dark:border-zinc-900 shadow-xl overflow-hidden relative group">
             <img src={`https://picsum.photos/seed/${auth.user?.name}/200/200`} className="w-full h-full object-cover rounded-[2.2rem]" alt="avatar" />
             <button className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-xs uppercase tracking-widest">Change</button>
          </div>
          <div className="w-full">
            {isEditing ? (
              <input 
                value={tempName} 
                onChange={(e) => setTempName(e.target.value)} 
                className="text-center text-3xl font-black bg-white dark:bg-zinc-800 rounded-xl px-4 py-2 border-2 border-lime-500 focus:outline-none w-full max-w-xs mx-auto"
                autoFocus
              />
            ) : (
              <h2 className="text-3xl font-black">{auth.user?.name}</h2>
            )}
            <p className="text-zinc-500 font-medium">{auth.user?.email}</p>
          </div>
          <button 
            onClick={() => {
              if (isEditing) {
                // Here you would call a context update function to save the name
                setIsEditing(false);
              } else {
                setIsEditing(true);
              }
            }}
            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 px-6 py-2 rounded-full font-bold text-sm hover:bg-zinc-200 transition-colors active:scale-95"
          >
            {isEditing ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>

        {/* Achievement Badges */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-1">
            <h3 className="text-xl font-extrabold">Badges Earned</h3>
            <button className="text-xs font-black text-lime-600 uppercase tracking-widest hover:underline" onClick={() => alert("Coming soon!")}>View All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 no-scrollbar">
             <div className="flex-shrink-0 w-24 h-24 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center gap-2 hover:scale-110 transition-transform cursor-pointer" onClick={() => alert("Early Adopter Badge")}>
               <span className="text-3xl">🚀</span>
               <span className="text-[10px] font-bold text-zinc-400">STARTER</span>
             </div>
             <div className="flex-shrink-0 w-24 h-24 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center gap-2 hover:scale-110 transition-transform cursor-pointer" onClick={() => alert("Nutrition Master Badge")}>
               <span className="text-3xl">🥑</span>
               <span className="text-[10px] font-bold text-zinc-400">VEGGIE PRO</span>
             </div>
             <div className="flex-shrink-0 w-24 h-24 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center gap-2 hover:scale-110 transition-transform cursor-pointer" onClick={() => alert("Perfect Week Badge")}>
               <span className="text-3xl">💎</span>
               <span className="text-[10px] font-bold text-zinc-400">7-DAY</span>
             </div>
             <div className="flex-shrink-0 w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-center opacity-50 group">
               <span className="text-2xl font-black text-zinc-400 group-hover:scale-125 transition-transform">+</span>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-lime-500 p-6 rounded-[2rem] text-white space-y-1 shadow-lg shadow-lime-500/20 active:scale-95 transition-transform cursor-pointer" onClick={() => onNavigate('scan')}>
             <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Completed Scans</p>
             <p className="text-3xl font-black">12</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-[2rem] text-white space-y-1 shadow-lg shadow-black/20 active:scale-95 transition-transform cursor-pointer" onClick={() => onNavigate('home')}>
             <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Active Goals</p>
             <p className="text-3xl font-black">2</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold px-1">Recent Insights</h3>
          <div className="space-y-3">
             {[1, 2, 3].map(i => (
               <div key={i} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between hover:border-lime-500 transition-all cursor-pointer group">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-lime-50 dark:bg-lime-900/30 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">✨</div>
                   <div>
                     <p className="font-bold text-sm">Wellness Analysis</p>
                     <p className="text-xs text-zinc-400">{i} day{i > 1 ? 's' : ''} ago</p>
                   </div>
                 </div>
                 <div className="font-black text-lime-600">82%</div>
               </div>
             ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
