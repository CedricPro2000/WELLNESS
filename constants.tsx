
import React from 'react';

export const COLORS = {
  primary: '#0052cc', // Professional Blue
  secondary: '#e94e77', // Wellness Pink/Red
  accent: '#84cc16', // Growth Lime
  background: '#ffffff',
  darkBackground: '#09090b',
};

export const Logo: React.FC<{ className?: string; showSubtitle?: boolean }> = ({ className, showSubtitle = false }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <div className="relative w-16 h-16 mb-1">
      {/* Precision SVG reconstruction of the provided logo */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
        {/* Heart with Plus */}
        <path 
          d="M50 40 C50 34, 42 26, 32 30 C22 34, 26 48, 50 62 C74 48, 78 34, 68 30 C58 26, 50 34, 50 40" 
          fill="#e94e77" 
        />
        {/* White Cross inside Heart */}
        <rect x="47.5" y="38" width="5" height="14" rx="1" fill="white" />
        <rect x="43" y="42.5" width="14" height="5" rx="1" fill="white" />
        {/* Supporting Hand */}
        <path 
          d="M20 65 Q20 52, 40 58 Q60 58, 68 45 Q78 38, 72 55 Q88 50, 82 68 Q72 88, 30 80 Q20 75, 20 65" 
          fill="#0052cc" 
        />
      </svg>
    </div>
    <div className="text-center">
      <span className="text-2xl font-black tracking-widest text-[#0052cc]">WELLNESS</span>
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em] mt-1">Nutrition Guidance</p>
    </div>
  </div>
);

export const PHONE_CODES = [
  { code: '+250', country: 'Rwanda' },
  { code: '+254', country: 'Kenya' },
  { code: '+255', country: 'Tanzania' },
  { code: '+256', country: 'Uganda' },
  { code: '+234', country: 'Nigeria' },
  { code: '+27', country: 'South Africa' },
  { code: '+233', country: 'Ghana' },
  { code: '+251', country: 'Ethiopia' },
];
