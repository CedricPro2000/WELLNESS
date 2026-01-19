
import React, { useEffect, useState } from 'react';
import { useApp } from '../../App';
import { generateWellnessReport } from '../../services/gemini';
import { ScanResult, Lesson } from '../../types';
import { translations } from '../../i18n';

interface ResultsScreenProps {
  onBack: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ onBack }) => {
  const { language } = useApp();
  const t = (key: string) => translations[key][language];
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      const data = await generateWellnessReport(language);
      setResult(data);
      setLoading(false);
    };
    fetchResults();
  }, [language]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleShareResults = async () => {
    if (!result) return;
    const shareData = {
      title: 'My WELLNESS Africa Report',
      text: `My Wellness Score is ${result.score}% (${result.status}!) 🌍\n\nI'm improving my health using affordable local foods like ${result.localFoods.join(', ')}. Track your health too with WELLNESS!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setToast({ message: "Shared successfully!", type: 'success' });
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
        setToast({ message: "Copied to clipboard!", type: 'success' });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setToast({ message: "Share failed.", type: 'info' });
      }
    }
  };

  const lessons: Lesson[] = [
    {
      id: 'hydration_recovery',
      title: 'Hydration Recovery',
      category: 'hydration',
      icon: '💧',
      why: 'Your current hydration markers are below optimal levels.',
      steps: ['Drink two glasses of water now.', 'Add local sea salt.', 'Eat Watermelon.'],
      swap: { from: 'Industrial Juice', to: 'Hibiscus Tea', benefit: 'Natural antioxidants.' }
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-black text-center mb-2">Analyzing Numeric Data...</h2>
        <p className="text-zinc-500 text-center">Generating your personalized wellness report.</p>
      </div>
    );
  }

  const scoreColor = result?.status === 'Good' ? 'text-lime-500' : result?.status === 'Attention' ? 'text-yellow-500' : 'text-red-500';
  const scoreBg = result?.status === 'Good' ? 'bg-lime-500' : result?.status === 'Attention' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[400] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`px-6 py-3 rounded-full border shadow-2xl flex items-center gap-3 backdrop-blur-md ${toast.type === 'success' ? 'bg-lime-500/90 border-lime-400 text-white' : 'bg-zinc-800/90 border-zinc-700 text-zinc-300'}`}>
            <span className="text-xl">{toast.type === 'success' ? '✅' : 'ℹ️'}</span>
            <p className="text-sm font-black uppercase tracking-widest">{toast.message}</p>
          </div>
        </div>
      )}

      {activeLesson && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-zinc-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-t-[3.5rem] sm:rounded-[3rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-8"><div className="w-16 h-16 bg-lime-100 rounded-2xl flex items-center justify-center text-4xl">💧</div><button onClick={() => setActiveLesson(null)} className="p-2 bg-zinc-100 rounded-full active:scale-90"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>
            <h3 className="text-3xl font-black mb-6 leading-tight">{activeLesson.title}</h3>
            <button onClick={() => setActiveLesson(null)} className="w-full mt-10 bg-lime-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95">GOT IT</button>
          </div>
        </div>
      )}

      <header className="p-6 flex items-center justify-between bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-zinc-100 rounded-full active:scale-90 transition-transform"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
          <h1 className="text-xl font-extrabold">{t('results')}</h1>
        </div>
        <button onClick={handleShareResults} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full active:scale-90 transition-all hover:bg-lime-500 hover:text-white" title="Share results"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg></button>
      </header>

      <main className="flex-1 p-6 space-y-8 overflow-y-auto pb-12 max-w-2xl mx-auto w-full">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 dark:border-zinc-800 text-center space-y-4">
          <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">{t('wellnessScore')}</p>
          <div className={`text-7xl font-black ${scoreColor}`}>{result?.score}<span className="text-3xl opacity-50">%</span></div>
          <div className={`inline-block px-6 py-2 rounded-full text-white font-bold shadow-lg ${scoreBg}`}>{result?.status} Level</div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-black px-2 flex items-center gap-2"><span className="w-2 h-6 bg-lime-500 rounded-full"></span>Insights & Guidance</h3>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 space-y-6">
            <div className="flex gap-5"><div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">🥗</div><div><h4 className="font-extrabold">{t('nutrition')}</h4><p className="text-zinc-500 text-sm mt-1">{result?.nutrition}</p></div></div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800"></div>
            <div className="flex gap-5"><div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">💧</div><div><h4 className="font-extrabold">{t('hydration')}</h4><p className="text-zinc-500 text-sm mt-1">{result?.hydration}</p></div></div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-black px-2">Local Food Suggestions</h3>
          <div className="grid grid-cols-1 gap-3">{result?.localFoods.map((food, i) => (<div key={i} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{food}</span>
            <span className="text-lime-600 font-black text-[10px] uppercase tracking-widest">Recommended</span>
          </div>))}</div>
        </div>

        <div className="flex flex-col gap-4">
          <button onClick={handleShareResults} className="w-full bg-lime-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-lime-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
             SHARE RESULTS
          </button>
          <button onClick={onBack} className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-black py-5 rounded-2xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs">Return Home</button>
        </div>
      </main>
    </div>
  );
};

export default ResultsScreen;
