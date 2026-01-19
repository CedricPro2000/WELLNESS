
import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Wellness",
      desc: "The only app built for African health, using just your phone's camera.",
      icon: "🌍",
      color: "bg-lime-500"
    },
    {
      title: "Fingertip Scanning",
      desc: "Place your finger on the camera for 5 seconds to get complete health insights.",
      icon: "👆",
      color: "bg-emerald-500"
    },
    {
      title: "Localized Nutrition",
      desc: "Get recommendations based on affordable food in your local markets.",
      icon: "🌽",
      color: "bg-orange-500"
    },
    {
      title: "Privacy First",
      desc: "We never store biometric images. Only numeric wellness data is processed.",
      icon: "🛡️",
      color: "bg-blue-500"
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 p-8 transition-colors duration-500 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-50/50 to-transparent dark:from-zinc-900/50 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-end pt-4">
          <button onClick={onComplete} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-600">Skip</button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 py-20">
          <div className="relative group">
            <div className={`w-40 h-40 ${currentStep.color} rounded-[3rem] flex items-center justify-center text-7xl shadow-2xl group-hover:scale-110 transition-transform duration-700 animate-float-iso`}>
              {currentStep.icon}
            </div>
            <div className={`absolute -inset-4 ${currentStep.color} opacity-20 blur-2xl rounded-full -z-10 animate-pulse`}></div>
          </div>
          
          <div className="space-y-6 max-w-sm">
            <h2 className="text-5xl font-black tracking-tighter leading-none">{currentStep.title}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium leading-relaxed">{currentStep.desc}</p>
          </div>

          <div className="flex gap-3">
            {steps.map((_, i) => (
              <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === step ? 'w-10 bg-lime-500 shadow-lg shadow-lime-500/30' : 'w-2 bg-zinc-200 dark:bg-zinc-800'}`}></div>
            ))}
          </div>
        </div>

        <div className="pb-12">
          <button 
            onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete()}
            className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-black py-6 rounded-[2rem] shadow-2xl shadow-black/20 dark:shadow-white/10 transition-all hover:-translate-y-1 active:scale-95 uppercase text-xs tracking-[0.3em]"
          >
            {step < steps.length - 1 ? 'Continue' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
