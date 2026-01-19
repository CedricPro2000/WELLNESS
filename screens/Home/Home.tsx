
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../App';
import { translations } from '../../i18n';
import { Logo } from '../../constants';
import { Lesson, UserGoal, GoalCategory, GoalFrequency } from '../../types';
import confetti from 'canvas-confetti';

interface HomeProps {
  onNavigate: (view: string) => void;
}

type ClimateType = 'tropical' | 'temperate' | 'dry';
type ActivityType = 'low' | 'moderate' | 'high';

interface HealthTip {
  id: string;
  text: string;
  category: 'Energy' | 'Immunity' | 'Digestion' | 'Hydration';
  icon: string;
  bgColor: string;
  textColor: string;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { auth, language } = useApp();
  const t = (key: string) => translations[key]?.[language] || key;

  // State Management
  const [climate, setClimate] = useState<ClimateType>('tropical');
  const [activity, setActivity] = useState<ActivityType>('moderate');
  const [waterDrank, setWaterDrank] = useState(0.4);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [recentlyUpdatedGoalId, setRecentlyUpdatedGoalId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [wellnessScore, setWellnessScore] = useState(68);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const healthTips: HealthTip[] = [
    { 
      id: 'tip_1', 
      text: 'Peak heat hours? Drink Madafu (coconut water) for natural electrolytes to stay strong.', 
      category: 'Hydration', 
      icon: '🥥', 
      bgColor: 'bg-blue-50/50 dark:bg-blue-900/10', 
      textColor: 'text-blue-600 dark:text-blue-400' 
    },
    { 
      id: 'tip_2', 
      text: 'Swap white rice for Sorghum or Millet. These ancient grains keep your energy steady all day.', 
      category: 'Energy', 
      icon: '🌾', 
      bgColor: 'bg-orange-50/50 dark:bg-orange-900/10', 
      textColor: 'text-orange-600 dark:text-orange-400' 
    },
    { 
      id: 'tip_3', 
      text: 'After a heavy meal like Fufu or Ugali, a 15-minute walk helps your digestion significantly.', 
      category: 'Digestion', 
      icon: '🚶', 
      bgColor: 'bg-emerald-50/50 dark:bg-emerald-900/10', 
      textColor: 'text-emerald-600 dark:text-emerald-400' 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [healthTips.length]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Enhanced Universal Share/Copy Logic
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: "Copied to clipboard!", type: 'success' });
    } catch (err) {
      setToast({ message: "Copy failed. Try again.", type: 'info' });
    }
  };

  const handleUniversalShare = async (title: string, text: string) => {
    const shareData = {
      title: title,
      text: `${text}\n\nShared via WELLNESS Africa 🌍`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setToast({ message: "Shared successfully!", type: 'success' });
      } else {
        // Fallback to Clipboard if sharing is not available (e.g., Desktop browsers without native share)
        await handleCopy(`${title}\n\n${shareData.text}\n\n${shareData.url}`);
      }
    } catch (error) {
      // Don't show error if user cancelled the share sheet
      if ((error as Error).name !== 'AbortError') {
        console.error("Share failed", error);
        await handleCopy(text);
      }
    }
  };

  const [userGoals, setUserGoals] = useState<UserGoal[]>(() => {
    const saved = localStorage.getItem('wellness_user_goals');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Daily Hydration', category: 'hydrate', frequency: 'daily', target: 2, current: 0.4, streak: 5, lastUpdated: new Date().toISOString(), reminderTime: '08:00' },
      { id: '2', title: 'Vital Scans', category: 'scan', frequency: 'weekly', target: 3, current: 0, streak: 2, lastUpdated: new Date().toISOString(), reminderTime: '09:00' }
    ];
  });

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<{title: string, category: GoalCategory, frequency: GoalFrequency, target: number, reminderTime: string}>({
    title: '',
    category: 'scan',
    frequency: 'daily',
    target: 1,
    reminderTime: '08:00'
  });

  const [level, setLevel] = useState(4);
  const [xp, setXp] = useState(75);

  useEffect(() => {
    localStorage.setItem('wellness_user_goals', JSON.stringify(userGoals));
  }, [userGoals]);

  const recommendedHydration = useMemo(() => {
    let base = 2.0;
    if (climate === 'tropical') base += 0.3;
    if (climate === 'dry') base += 0.6;
    if (activity === 'moderate') base += 0.4;
    if (activity === 'high') base += 1.0;
    return parseFloat(base.toFixed(1));
  }, [climate, activity]);

  const hydrationProgress = Math.min((waterDrank / recommendedHydration) * 100, 100);

  const triggerConfettiAtElement = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({ 
      particleCount: 150, 
      spread: 80, 
      origin: { x, y }, 
      colors: ['#84cc16', '#22c55e', '#ffffff', '#3b82f6', '#fbbf24'],
      ticks: 250,
      gravity: 1.1,
      scalar: 0.9,
      zIndex: 1000
    });
    setXp(prev => Math.min(prev + 10, 100));
  };

  const logWater = (e: React.MouseEvent) => {
    const amountToAdd = 0.25;
    const newAmount = parseFloat((waterDrank + amountToAdd).toFixed(2));
    setWaterDrank(newAmount);
    
    const hydrationGoal = userGoals.find(g => g.category === 'hydrate');
    if (hydrationGoal) {
      setRecentlyUpdatedGoalId(hydrationGoal.id);
      setTimeout(() => setRecentlyUpdatedGoalId(null), 800);
    }

    setUserGoals(prev => prev.map(g => {
      if (g.category === 'hydrate') {
        const nextVal = Math.min(g.current + amountToAdd, g.target);
        if (nextVal >= g.target && g.current < g.target) {
          const goalEl = document.getElementById(`goal-${g.id}`);
          if (goalEl) triggerConfettiAtElement(goalEl);
          else triggerConfettiAtElement(e.currentTarget as HTMLElement);
        }
        return { ...g, current: parseFloat(nextVal.toFixed(2)) };
      }
      return g;
    }));
  };

  const logGoalProgress = (id: string, e: React.MouseEvent) => {
    setRecentlyUpdatedGoalId(id);
    setTimeout(() => setRecentlyUpdatedGoalId(null), 800);

    setUserGoals(prev => prev.map(g => {
      if (g.id === id) {
        const increment = g.category === 'hydrate' ? 0.25 : 1;
        const next = Math.min(g.current + increment, g.target);
        
        if (next >= g.target && g.current < g.target) {
          const goalEl = document.getElementById(`goal-${g.id}`);
          if (goalEl) triggerConfettiAtElement(goalEl);
          else triggerConfettiAtElement(e.currentTarget as HTMLElement);
          return { ...g, current: next, streak: g.streak + 1 };
        }
        return { ...g, current: next };
      }
      return g;
    }));
  };

  const shareGoalProgress = (goal: UserGoal) => {
    const percent = Math.round((goal.current / goal.target) * 100);
    const statusEmoji = percent >= 100 ? '✅' : '📊';
    
    const snippets: Record<string, string> = {
      en: `${statusEmoji} I've reached ${percent}% of my "${goal.title}" goal on WELLNESS! 🌍 Tracking my health with local African insights. Join me! #WellnessAfrica #HealthyHabits`,
      rw: `${statusEmoji} Nageze kuri ${percent}% ku ntego yanjye ya "${goal.title}" kuri WELLNESS! 🌍 Ndimo gukurikirana ubuzima bwanjye nifashishije inama z'iwacu muri Afurika. #WellnessAfrica`,
      fr: `${statusEmoji} J'ai atteint ${percent}% de mon objectif "${goal.title}" sur WELLNESS ! 🌍 Je suis ma santé avec des conseils africains locaux. #WellnessAfrica #Sante`,
      sw: `${statusEmoji} Nimefikia ${percent}% ya lengo langu la "${goal.title}" kwenye WELLNESS! 🌍 Ninafuatilia afya yangu kwa miongozo ya Afrika. #WellnessAfrica`
    };

    const shareText = snippets[language] || snippets.en;
    handleUniversalShare('WELLNESS Goal Progress', shareText);
  };

  const addNewGoal = () => {
    if (!newGoal.title) return;
    const goal: UserGoal = { id: Math.random().toString(36).substr(2, 9), ...newGoal, current: 0, streak: 0, lastUpdated: new Date().toISOString() };
    setUserGoals([goal, ...userGoals]);
    setIsGoalModalOpen(false);
    setNewGoal({ title: '', category: 'scan', frequency: 'daily', target: 1, reminderTime: '08:00' });
  };

  const deleteGoal = (id: string) => {
    setUserGoals(prev => prev.filter(g => g.id !== id));
    setGoalToDelete(null);
  };

  const lessons: Lesson[] = [
    { 
      id: 'low_hyd', 
      title: 'Hydration Recovery', 
      category: 'hydration', 
      icon: '💧', 
      why: 'Your hydration markers are currently below optimal levels, which is common during heat peaks.', 
      steps: ['Drink 250ml of water or Madafu immediately.', 'Avoid caffeine in heat.', 'Set a 2-hour reminder.'], 
      swap: { from: 'Industrial Soda', to: 'Coconut Water', benefit: 'Natural electrolytes.' } 
    }
  ];

  const suggestedLessons = useMemo(() => {
    const needed: Lesson[] = [];
    if (hydrationProgress < 50) needed.push(lessons[0]);
    return needed;
  }, [hydrationProgress]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[400] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`px-6 py-3 rounded-full border shadow-2xl flex items-center gap-3 backdrop-blur-md ${toast.type === 'success' ? 'bg-lime-500/90 border-lime-400 text-white' : 'bg-zinc-800/90 border-zinc-700 text-zinc-300'}`}>
            <span className="text-xl">{toast.type === 'success' ? '✅' : 'ℹ️'}</span>
            <p className="text-sm font-black uppercase tracking-widest">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Lesson Details Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-t-[3.5rem] sm:rounded-[3rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-500 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-4xl">{activeLesson.icon}</div>
              <button onClick={() => setActiveLesson(null)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full active:scale-90"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
            </div>
            <h3 className="text-3xl font-black mb-6 leading-tight">{activeLesson.title}</h3>
            <div className="space-y-8">
              <div><p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">{t('whyItMatters')}</p><p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">{activeLesson.why}</p></div>
              <div><p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">{t('howToImprove')}</p><ul className="space-y-4">{activeLesson.steps.map((step, i) => (<li key={i} className="flex gap-4 items-start"><div className="w-7 h-7 rounded-full bg-lime-100 dark:bg-lime-900/40 text-lime-600 flex items-center justify-center text-xs font-black shrink-0">{i + 1}</div><span className="text-[15px] font-bold text-zinc-700 dark:text-zinc-300">{step}</span></li>))}</ul></div>
            </div>
            <button onClick={() => setActiveLesson(null)} className="w-full mt-10 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95">GOT IT</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {goalToDelete && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[3rem] p-10 space-y-8 shadow-2xl animate-in zoom-in duration-300 text-center">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto">🗑️</div>
            <div className="space-y-3"><h3 className="text-3xl font-black leading-tight">{t('confirmDeleteTitle')}</h3><p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{t('confirmDeleteDesc')}</p></div>
            <div className="flex flex-col gap-4">
              <button onClick={() => deleteGoal(goalToDelete)} className="w-full bg-red-500 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-red-500/20 active:scale-95 transition-all uppercase tracking-widest text-xs">{t('delete')}</button>
              <button onClick={() => setGoalToDelete(null)} className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-black py-5 rounded-[1.5rem] active:scale-95 transition-all uppercase tracking-widest text-xs">{t('cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {isGoalModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-t-[3.5rem] sm:rounded-[3rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center mb-8"><h3 className="text-2xl font-black">{t('addNewGoal')}</h3><button onClick={() => setIsGoalModalOpen(false)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full transition-transform active:scale-90"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>
            <div className="space-y-6">
              <input type="text" value={newGoal.title} onChange={(e) => setNewGoal({...newGoal, title: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-5 py-4 font-bold" placeholder="Goal Title" />
              <div className="grid grid-cols-2 gap-4">
                <select value={newGoal.category} onChange={(e) => setNewGoal({...newGoal, category: e.target.value as GoalCategory})} className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-4 py-4 font-bold"><option value="scan">Scan</option><option value="hydrate">Hydrate</option><option value="nutrition">Nutrition</option></select>
                <input type="number" value={newGoal.target} onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value) || 1})} className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-5 py-4 font-bold" placeholder="Target" />
              </div>
            </div>
            <button onClick={addNewGoal} className="w-full mt-10 bg-lime-500 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-sm">{t('setGoal')}</button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 px-6 pt-8 pb-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-20">
        <Logo />
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-2">
            <div className="flex items-center gap-1"><span className="text-orange-500 text-sm">🔥</span><span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">5 Day Streak</span></div>
            <div className="flex items-center gap-1.5"><span className="text-xs font-bold text-zinc-400">Level {level}</span><div className="w-12 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-lime-500 transition-all duration-700" style={{ width: `${xp}%` }}></div></div></div>
          </div>
          <button onClick={() => onNavigate('profile')} className="w-12 h-12 rounded-full border-2 border-lime-500 overflow-hidden"><img src={`https://picsum.photos/seed/${auth.user?.name}/100/100`} alt="profile" /></button>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-10 max-w-2xl mx-auto w-full pb-32">
        <div className="space-y-1"><p className="text-zinc-500 font-medium">Hello, {auth.user?.name} 👋</p><h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">Daily Overview</h2></div>

        {/* Score Card */}
        <div className={`rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden transition-colors duration-700 ${wellnessScore < 70 ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-lime-500 to-emerald-600'}`}>
          <div className="relative z-10">
            <p className="text-white/70 font-bold text-sm tracking-widest uppercase mb-1">{t('wellnessScore')}</p>
            <div className="flex items-baseline gap-2"><span className="text-6xl font-black">{wellnessScore}</span><span className="text-2xl font-bold opacity-70">%</span></div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        </div>

        {/* Improvement Hub */}
        {suggestedLessons.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-1"><div className="w-2 h-8 bg-amber-500 rounded-full"></div><h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">{t('improvementHub')}</h3></div>
            <div className="grid grid-cols-1 gap-4">
              {suggestedLessons.map(lesson => (
                <button key={lesson.id} onClick={() => setActiveLesson(lesson)} className="w-full text-left bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-amber-200/50 dark:border-amber-900/20 flex items-center justify-between group hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm">
                  <div className="flex items-center gap-5"><div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:rotate-6 transition-transform">{lesson.icon}</div><div><h4 className="font-black leading-tight">{lesson.title}</h4><p className="text-[9px] font-black text-amber-600 uppercase mt-1 tracking-widest">{lesson.category}</p></div></div>
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg group-hover:translate-x-1 transition-transform"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Goal Setting */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3"><div className="w-2 h-8 bg-lime-500 rounded-full"></div><h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">{t('goalSetting')}</h3></div>
              <div className="flex gap-2"><button onClick={() => setIsEditMode(!isEditMode)} className={`px-4 py-2 rounded-full text-xs font-black transition-all ${isEditMode ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50' : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500'}`}>{isEditMode ? 'DONE' : 'MANAGE'}</button><button onClick={() => setIsGoalModalOpen(true)} className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-4 py-2 rounded-full text-xs font-black shadow-lg shadow-zinc-900/10 active:scale-95 transition-transform">+ {t('addNewGoal')}</button></div>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              {userGoals.map((goal) => (
                <div key={goal.id} className={`relative overflow-hidden rounded-[2.5rem] group transition-all duration-300 ${recentlyUpdatedGoalId === goal.id ? 'scale-[1.03] shadow-lg shadow-lime-500/10' : ''}`}>
                  <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory">
                    <div className="min-w-full snap-start relative bg-white dark:bg-zinc-900 p-7 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
                       <div className="absolute top-4 right-4 flex items-center gap-2">
                         <button onClick={() => shareGoalProgress(goal)} className="w-10 h-10 bg-lime-50 dark:bg-lime-900/20 text-lime-600 rounded-2xl flex items-center justify-center transition-all active:scale-90 group-hover:opacity-100 group-hover:scale-100 opacity-0 scale-75" title="Share progress"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg></button>
                         {isEditMode && <button onClick={() => setGoalToDelete(goal.id)} className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center transition-all active:scale-90"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>}
                       </div>
                       <div className="flex items-center justify-between pr-12">
                          <div className="flex items-center gap-4">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${goal.category === 'hydrate' ? 'bg-blue-100 text-blue-600' : goal.category === 'scan' ? 'bg-lime-100 text-lime-600' : 'bg-orange-100 text-orange-600'}`}>{goal.category === 'hydrate' ? '💧' : goal.category === 'scan' ? '👆' : '🥗'}</div>
                             <div><h4 className="font-black leading-tight">{goal.title}</h4><p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{t(goal.frequency)}</p></div>
                          </div>
                          <button disabled={goal.current >= goal.target} onClick={(e) => logGoalProgress(goal.id, e)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${goal.current >= goal.target ? 'bg-lime-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 active:scale-90'}`}>
                            {goal.current >= goal.target ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 5v14M5 12h14"/></svg>}
                          </button>
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between items-end"><p className="text-xs font-bold text-zinc-500">{goal.current} / {goal.target}</p><p className="text-[10px] font-black text-lime-600 uppercase tracking-widest">{Math.round((goal.current / goal.target) * 100)}%</p></div>
                          <div className="h-2.5 w-full bg-zinc-50 dark:bg-zinc-800 rounded-full overflow-hidden"><div className={`h-full transition-all duration-700 ${goal.category === 'hydrate' ? 'bg-blue-500' : 'bg-lime-500'}`} style={{ width: `${(goal.current / goal.target) * 100}%` }}></div></div>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* Health Tips */}
        <section className="space-y-4 pb-10">
          <div className="flex items-center gap-3 px-1"><div className="w-2 h-8 bg-orange-500 rounded-full"></div><h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">{t('healthTips')}</h3></div>
          <div className="relative h-[180px]">
            {healthTips.map((tip, idx) => (
              <div key={tip.id} className={`transition-all duration-1000 absolute inset-0 ${idx === currentTipIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <div className={`${tip.bgColor} p-6 rounded-[2.5rem] border border-white/50 dark:border-zinc-800/50 backdrop-blur-lg shadow-sm flex flex-col justify-between h-full`}>
                   <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3"><div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-3xl shadow-sm">{tip.icon}</div><div className="bg-white/60 dark:bg-zinc-800/60 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{tip.category}</div></div>
                      <div className="flex gap-2">
                        {/* Copy Button */}
                        <button 
                          onClick={() => handleCopy(tip.text)} 
                          className="p-3 bg-white/40 dark:bg-zinc-800/40 rounded-full hover:bg-lime-500 hover:text-white transition-all transform active:scale-90"
                          title="Copy Tip"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                        {/* Share Button (Native) */}
                        <button 
                          onClick={() => handleUniversalShare('WELLNESS Health Tip', tip.text)} 
                          className="p-3 bg-white/40 dark:bg-zinc-800/40 rounded-full hover:bg-lime-500 hover:text-white transition-all transform active:scale-90"
                          title="Share Tip"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                        </button>
                      </div>
                   </div>
                   <p className={`text-[15px] font-bold leading-relaxed ${tip.textColor}`}>{tip.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-2">
            {healthTips.map((_, i) => (<button key={i} onClick={() => setCurrentTipIndex(i)} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentTipIndex ? 'w-8 bg-orange-500' : 'w-2 bg-zinc-200 dark:bg-zinc-800'}`} />))}
          </div>
        </section>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-800 px-8 py-4 flex justify-around items-center z-30">
        <button onClick={() => onNavigate('home')} className="flex flex-col items-center gap-1 text-lime-600 transition-transform active:scale-90"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg><span className="text-[10px] font-bold uppercase tracking-widest">{t('home')}</span></button>
        <button onClick={() => onNavigate('scan')} className="relative -top-10 w-20 h-20 bg-lime-500 rounded-full flex items-center justify-center text-white shadow-2xl border-8 border-zinc-50 dark:border-zinc-950 active:scale-90 transition-all"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg></button>
        <button onClick={() => onNavigate('profile')} className="flex flex-col items-center gap-1 text-zinc-400 transition-transform active:scale-90"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span className="text-[10px] font-bold uppercase tracking-widest">{t('profile')}</span></button>
      </nav>
    </div>
  );
};

export default Home;
