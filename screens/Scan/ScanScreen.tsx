
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../App';
import { translations } from '../../i18n';

interface ScanScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

const ScanScreen: React.FC<ScanScreenProps> = ({ onBack, onComplete }) => {
  const { language } = useApp();
  const t = (key: string) => translations[key][language];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'initializing' | 'ready' | 'scanning'>('initializing');
  const [dynamicMessage, setDynamicMessage] = useState('');
  const [hasConfirmedPrivacy, setHasConfirmedPrivacy] = useState(false);

  const scanMessages = [
    'Calibrating sensor...',
    'Detecting fingertip...',
    'Measuring pulse rate...',
    'Analyzing blood flow...',
    'Extracting wellness data...',
    'Finalizing report...'
  ];

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStatus('ready');
      } catch (err) {
        console.error("Camera access denied", err);
      }
    };

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isScanning) {
      const messageIndex = Math.floor((progress / 100) * scanMessages.length);
      setDynamicMessage(scanMessages[Math.min(messageIndex, scanMessages.length - 1)]);
    }
  }, [progress, isScanning]);

  const startScan = () => {
    if (!hasConfirmedPrivacy) return;
    setIsScanning(true);
    setStatus('scanning');
    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 50); // 5 seconds total
  };

  // Circular progress calculation
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50 overflow-hidden">
      {/* Camera Viewport */}
      <video 
        ref={videoRef} 
        autoPlay playsInline muted 
        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-1000 grayscale"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)] z-0 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(132,204,22,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(132,204,22,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Overlay UI */}
      <div className="relative h-full flex flex-col justify-between p-8 text-white z-10">
        <div className="flex justify-between items-center">
          <button onClick={onBack} className="p-3 bg-white/10 backdrop-blur-md rounded-full active:scale-90 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'scanning' ? 'bg-red-500 animate-pulse' : status === 'ready' ? 'bg-lime-500 shadow-[0_0_8px_#84cc16]' : 'bg-zinc-500'}`}></div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{status}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Dynamic Circular Progress Bar */}
            <svg className="absolute w-full h-full -rotate-90 pointer-events-none z-10">
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
                className="transition-opacity duration-500"
                style={{ opacity: isScanning ? 1 : 0 }}
              />
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                fill="none"
                stroke="#84cc16"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                style={{ 
                  strokeDashoffset: isScanning ? offset : circumference,
                  transition: 'stroke-dashoffset 0.1s linear, opacity 0.5s ease',
                  opacity: isScanning ? 1 : 0
                }}
              />
            </svg>

            {isScanning && (
              <>
                <div className="absolute inset-0 border-[1px] border-lime-500 rounded-full animate-[ping_4s_infinite] opacity-30"></div>
                <div className="absolute inset-[-10px] border-[1px] border-lime-400 rounded-full animate-[ping_3s_infinite_1s] opacity-20"></div>
                <div className="absolute inset-[-20px] border-[1px] border-emerald-500 rounded-full animate-[ping_5s_infinite_0.5s] opacity-10"></div>
                <div className="absolute inset-20 border-[1.5px] border-lime-500 rounded-full animate-pulse opacity-50 shadow-[0_0_15px_rgba(132,204,22,0.3)]"></div>
              </>
            )}
            
            <div className={`w-64 h-64 border-2 rounded-full flex items-center justify-center relative backdrop-blur-[1px] transition-all duration-1000 ${isScanning ? 'border-lime-500 scale-105 shadow-[0_0_50px_rgba(132,204,22,0.2)]' : 'border-white/20'}`}>
              <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl transition-colors duration-500 ${isScanning ? 'border-lime-500' : 'border-white/10'}`}></div>
              <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl transition-colors duration-500 ${isScanning ? 'border-lime-500' : 'border-white/10'}`}></div>
              <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl transition-colors duration-500 ${isScanning ? 'border-lime-500' : 'border-white/10'}`}></div>
              <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-xl transition-colors duration-500 ${isScanning ? 'border-lime-500' : 'border-white/10'}`}></div>

              <div className={`w-24 h-24 rounded-[2rem] border-2 transition-all duration-700 flex items-center justify-center overflow-hidden ${isScanning ? 'border-lime-500 bg-lime-500/5' : 'border-white/10'}`}>
                 <span className={`text-5xl transition-all duration-1000 ${isScanning ? 'scale-110 blur-0' : 'opacity-20 blur-[1px]'}`}>👆</span>
                 {isScanning && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lime-500/10 to-transparent animate-[scan-sweep_2s_ease-in-out_infinite]"></div>}
              </div>

              {isScanning && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-full overflow-hidden">
                  <div className="w-full h-1 bg-lime-400 shadow-[0_0_20px_#84cc16,0_0_10px_#fff] animate-[biometric-laser_3s_linear_infinite] absolute z-20"></div>
                  <div className="w-full h-12 bg-gradient-to-b from-lime-500/30 to-transparent animate-[biometric-laser_3s_linear_infinite] absolute z-10 opacity-40"></div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-16 text-center max-w-xs space-y-4">
            <h2 className="text-2xl font-black tracking-tight">{isScanning ? t('scanning') : t('scanInstructions')}</h2>
            <div className="h-6">
              <p className="text-[11px] font-black text-lime-500 uppercase tracking-widest animate-pulse">
                {isScanning ? dynamicMessage : 'Keep your phone steady'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress & Data Readout */}
        <div className="space-y-6 pb-10">
          {isScanning ? (
            <div className="bg-zinc-900/60 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/5 space-y-4 shadow-2xl">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-ping"></span>
                    <p className="text-[9px] font-black text-lime-500 uppercase tracking-[0.2em]">Live Telemetry</p>
                  </div>
                  <p className="text-2xl font-black">{progress}% <span className="text-xs text-zinc-500 font-bold">READY</span></p>
                </div>
                <div className="flex items-center gap-1">
                   {Array.from({length: 8}).map((_, i) => (
                     <div 
                      key={i} 
                      className={`w-1 h-3 rounded-full transition-all duration-300 ${progress > (i+1)*12.5 ? 'bg-lime-500' : 'bg-zinc-800'}`}
                      style={{ height: `${Math.sin(progress/10 + i) * 8 + 12}px` }}
                     ></div>
                   ))}
                </div>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-lime-600 via-lime-400 to-emerald-500 transition-all duration-100 ease-linear" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Privacy Confirmation (Visual Intent) */}
              <div className="flex flex-col items-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer group bg-white/5 px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                  <input 
                    type="checkbox" 
                    checked={hasConfirmedPrivacy}
                    onChange={(e) => setHasConfirmedPrivacy(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 text-lime-500 focus:ring-lime-500 bg-transparent"
                  />
                  <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">
                    {t('privacyConfirm')}
                  </span>
                </label>

                <button 
                  onClick={startScan}
                  disabled={status !== 'ready' || !hasConfirmedPrivacy}
                  className={`w-full group relative overflow-hidden flex items-center justify-center gap-4 py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-widest transition-all shadow-2xl ${
                    hasConfirmedPrivacy && status === 'ready'
                    ? 'bg-lime-500 text-white shadow-lime-500/40 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-zinc-800 text-zinc-500 opacity-60 grayscale cursor-not-allowed'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-inner">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                  {t('initiateVitalScan')}
                </button>
              </div>
              
              <button onClick={onBack} className="w-full text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em] py-2 hover:text-white transition-colors">Return Home</button>
            </div>
          )}
          
          <div className="flex flex-col items-center gap-2 opacity-40">
             <div className="flex items-center gap-2">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                <span className="text-[8px] font-black uppercase tracking-widest">Biometric Numeric Encryption Active</span>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes biometric-laser {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes scan-sweep {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default ScanScreen;
