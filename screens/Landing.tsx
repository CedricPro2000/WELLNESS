
import React, { useState, useEffect } from 'react';
import { Logo } from '../constants';
import { useApp } from '../App';
import { translations } from '../i18n';
import { Language } from '../types';

interface LandingProps {
  onAction: (view: string) => void;
}

const LandingPage: React.FC<LandingProps> = ({ onAction }) => {
  const { language, setLanguage } = useApp();
  const t = (key: string) => translations[key]?.[language] || key;
  
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 overflow-hidden selection:bg-lime-200 selection:text-lime-900 transition-colors duration-500">
      {/* Tutorial Video Modal */}
      {isTutorialOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-zinc-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
            <button 
              onClick={() => setIsTutorialOpen(false)}
              className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all active:scale-90"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
              title="Wellness App Tutorial"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Abstract Depth Background */}
      <div className="blob w-[800px] h-[800px] bg-lime-300 dark:bg-lime-900 -top-[20%] -right-[10%] animate-liquid"></div>
      <div className="blob w-[600px] h-[600px] bg-emerald-200 dark:bg-emerald-900 -bottom-[10%] -left-[10%] animate-liquid duration-1000"></div>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-10 flex justify-between items-center relative z-20">
        <Logo />
        <div className="hidden md:flex items-center gap-12">
          <a href="#features" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-lime-500 transition-colors">Features</a>
          <a href="#how" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-lime-500 transition-colors">How it Works</a>
          <a href="#privacy" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-lime-500 transition-colors">Privacy</a>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onAction('login')}
            className="text-zinc-500 dark:text-zinc-400 font-black text-xs uppercase tracking-widest hover:text-lime-600 transition-colors"
          >
            {t('login')}
          </button>
          <button 
            onClick={() => onAction('signup')}
            className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-8 py-3 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            {t('signup')}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 lg:pt-32 pb-48 flex flex-col lg:flex-row items-center gap-16 relative z-10">
        <div className="flex-1 space-y-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 glass px-5 py-2 rounded-full border border-white/20 shadow-xl animate-bounce">
            <span className="flex h-2 w-2 rounded-full bg-lime-500"></span>
            <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.3em]">Built Specifically For Africa</span>
          </div>
          
          <h1 className="text-7xl lg:text-[10rem] font-black text-zinc-900 dark:text-zinc-50 leading-[0.85] tracking-tighter">
            Your Daily <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-600 italic">Health Journey,</span> <br />
            Simplified.
          </h1>
          
          <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Join 50,000+ pioneers tracking wellness using just a camera scan. Local insights, affordable food, and absolute privacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center lg:items-start gap-8 justify-center lg:justify-start pt-6">
            <div className="flex flex-col items-center lg:items-start gap-4">
              <button 
                onClick={() => onAction('signup')}
                className="w-full sm:w-auto bg-lime-500 hover:bg-lime-600 text-white px-12 py-6 rounded-[2.5rem] text-xl font-black shadow-[0_25px_50px_-12px_rgba(132,204,22,0.5)] transition-all hover:-translate-y-2 active:scale-95"
              >
                Get Started Now
              </button>
              <button 
                onClick={() => setIsTutorialOpen(true)}
                className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 hover:text-lime-600 font-black text-sm uppercase tracking-[0.2em] transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-lime-500 group-hover:text-white transition-all shadow-md">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </div>
                Watch Tutorial
              </button>
            </div>
            
            <div className="flex items-center gap-4 px-6 opacity-60 self-center lg:self-start lg:mt-6">
               <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/af${i}/40/40`} className="w-10 h-10 rounded-full border-4 border-white dark:border-zinc-950 shadow-sm" alt="user" />
                  ))}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Verified Users</span>
            </div>
          </div>
        </div>

        {/* Static High-Quality App Illustration */}
        <div className="flex-1 flex justify-center items-center relative">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-lime-400 to-emerald-500 rounded-[4rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            {/* Main Illustration Container */}
            <div className="relative w-[340px] md:w-[400px] aspect-[1/2] rounded-[4rem] border-[12px] border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden">
               <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" 
                alt="Wellness App Illustration" 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
               />
               
               {/* UI Element Overlays (Static) */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 space-y-4">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
                    <p className="text-[10px] font-black text-lime-400 uppercase tracking-widest mb-1">Wellness Score</p>
                    <p className="text-3xl font-black text-white">84% Optimal</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Hydration</p>
                    <p className="text-3xl font-black text-white">1.2L / 2.0L</p>
                  </div>
               </div>
            </div>

            {/* Floating Decorative Items */}
            <div className="absolute -top-12 -right-16 bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 animate-float-iso delay-100 hidden md:block">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-lime-100 rounded-2xl flex items-center justify-center text-2xl">🥗</div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Diet Insight</p>
                    <p className="text-sm font-black dark:text-white">More Sorghum</p>
                  </div>
               </div>
            </div>

            <div className="absolute bottom-20 -left-16 bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 animate-float-iso hidden md:block">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">💧</div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Hydration</p>
                    <p className="text-sm font-black dark:text-white">Daily Goal Met</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bento Grid Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-48">
        <div className="text-center mb-24 space-y-4">
           <h2 className="text-xs font-black uppercase tracking-[0.5em] text-lime-600">Core Features</h2>
           <h3 className="text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">Everything You Need.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-8 h-auto lg:h-[800px]">
           <div className="md:col-span-2 md:row-span-2 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] p-12 flex flex-col justify-between border border-zinc-100 dark:border-zinc-800 group hover:border-lime-500/30 transition-all overflow-hidden relative">
              <div className="relative z-10 space-y-6">
                 <div className="w-20 h-20 bg-lime-500 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl shadow-lime-500/30 group-hover:scale-110 transition-transform">👆</div>
                 <h4 className="text-5xl font-black tracking-tighter">Biometric Scan <br /> Technology</h4>
                 <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-sm">No hardware required. Our AI uses your camera to analyze wellness in 5 seconds.</p>
              </div>
              <div className="absolute bottom-0 right-0 w-2/3 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                 <img src="https://picsum.photos/seed/biom/800/600" className="rounded-tl-[4rem] border-l border-t border-white/10" alt="Biometrics" />
              </div>
           </div>

           <div className="bg-zinc-900 dark:bg-white rounded-[3rem] p-12 text-white dark:text-zinc-900 border border-white/10 dark:border-zinc-200">
              <div className="h-full flex flex-col justify-between">
                 <div className="text-5xl">🌽</div>
                 <div className="space-y-4">
                    <h4 className="text-3xl font-black tracking-tighter leading-none">Local Food Database</h4>
                    <p className="text-sm opacity-60">Suggestions based on what's available in your local markets.</p>
                 </div>
              </div>
           </div>

           <div className="bg-lime-500 rounded-[3rem] p-12 text-white shadow-[0_30px_60px_-15px_rgba(132,204,22,0.4)]">
              <div className="h-full flex flex-col justify-between">
                 <div className="text-5xl">🛡️</div>
                 <div className="space-y-4">
                    <h4 className="text-3xl font-black tracking-tighter leading-none">Absolute Privacy</h4>
                    <p className="text-sm opacity-80">No images stored. Ever. Your biometric data is yours alone.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Social Proof Carousel */}
      <section className="bg-zinc-50 dark:bg-zinc-900 py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-20 text-center lg:text-left">
           <h4 className="text-xs font-black uppercase tracking-[0.5em] text-zinc-400 mb-4">Community Voice</h4>
           <h5 className="text-5xl font-black tracking-tighter">Trusted Across the Continent.</h5>
        </div>
        <div className="flex gap-8 px-6 overflow-x-auto no-scrollbar">
           {[
             { name: "Amara O.", city: "Lagos", quote: "The food recommendations are life-changing. I finally know how to use local grains for my health.", avatar: "af1" },
             { name: "Kofi B.", city: "Accra", quote: "As a farmer, I'm outdoors a lot. The hydration alerts are so accurate for the heat here.", avatar: "af2" },
             { name: "Sonia M.", city: "Nairobi", quote: "I love that it's private. No fingerprint images, just insights. Simple and smart.", avatar: "af3" },
             { name: "Thabo L.", city: "Johannesburg", quote: "The 5-second scan is magic. It keeps me consistent every morning.", avatar: "af4" }
           ].map((t, i) => (
             <div key={i} className="flex-shrink-0 w-[400px] bg-white dark:bg-zinc-950 p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                <div className="flex gap-1 text-lime-500">
                   {[...Array(5)].map((_, i) => <svg key={i} width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                </div>
                <p className="text-xl font-medium leading-relaxed italic text-zinc-600 dark:text-zinc-400">"{t.quote}"</p>
                <div className="flex items-center gap-4 pt-4">
                   <img src={`https://picsum.photos/seed/${t.avatar}/60/60`} className="w-14 h-14 rounded-2xl grayscale" alt="Testimonial" />
                   <div>
                      <p className="font-black text-zinc-900 dark:text-white">{t.name}</p>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t.city}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-48 text-center">
         <div className="bg-zinc-900 dark:bg-zinc-50 rounded-[4rem] p-24 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500 blur-[150px] opacity-20 group-hover:opacity-40 transition-all"></div>
            <div className="relative z-10 space-y-12">
               <h3 className="text-7xl lg:text-[10rem] font-black text-white dark:text-zinc-900 leading-[0.85] tracking-tighter">Your Health <br /> Starts Today.</h3>
               <button 
                  onClick={() => onAction('signup')}
                  className="bg-lime-500 hover:bg-lime-600 text-white px-16 py-8 rounded-[3rem] text-2xl font-black shadow-2xl transition-all hover:-translate-y-2 active:scale-95"
               >
                  Join the Movement
               </button>
               <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-400">Join 50k+ others in Africa</p>
            </div>
         </div>
      </section>

      {/* Sticky Bottom CTA for Mobile */}
      <div className="fixed bottom-8 inset-x-6 z-50 md:hidden animate-in slide-in-from-bottom duration-1000">
         <button 
            onClick={() => onAction('signup')}
            className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-black py-6 rounded-full shadow-[0_25px_50px_rgba(0,0,0,0.5)] active:scale-95 transition-all flex items-center justify-center gap-3"
         >
            <span className="text-xs uppercase tracking-[0.2em] font-black">Download Wellness</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
         </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-900 py-24 pb-48 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <Logo className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all scale-125" />
          
          <div className="flex items-center gap-12">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent border-none text-xs font-black text-zinc-400 hover:text-lime-600 focus:ring-0 cursor-pointer uppercase tracking-[0.3em]"
            >
              <option value="en">English</option>
              <option value="rw">Kinyarwanda</option>
              <option value="fr">Français</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>

          <div className="text-[10px] font-black text-zinc-300 dark:text-zinc-800 tracking-[0.5em] uppercase">
            © 2024 Wellness Africa • Private & Secure
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
