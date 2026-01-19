
import React, { useState, useEffect } from 'react';
import { useApp } from '../../App';
import { translations } from '../../i18n';
import { Logo } from '../../constants';
import { User } from '../../types';

interface LoginProps {
  onBack: () => void;
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginProps> = ({ onBack, onLogin }) => {
  const { language } = useApp();
  const t = (key: string) => translations[key]?.[language] || key;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'google' | 'apple' | 'biometric' | null>(null);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [googleFlow, setGoogleFlow] = useState<'idle' | 'picking' | 'verifying'>('idle');
  const [verificationStep, setVerificationStep] = useState(0);
  const [biometricStatus, setBiometricStatus] = useState<'idle' | 'scanning' | 'error'>('idle');

  const mockGoogleAccounts = [
    { name: 'John Doe', email: 'j.doe@gmail.com', img: 'https://picsum.photos/seed/jdoe/100/100' },
    { name: 'Wellness Explorer', email: 'health.africa@gmail.com', img: 'https://picsum.photos/seed/health/100/100' },
    { name: 'Use another account', email: '', img: '' }
  ];

  const verificationSteps = [
    "Connecting to Google Services...",
    "Selecting account profile...",
    "Verifying identity markers...",
    "Analyzing security tokens...",
    "Access granted"
  ];

  useEffect(() => {
    // Check if the device supports platform-based biometric authenticators
    const checkBiometrics = async () => {
      try {
        if (window.PublicKeyCredential && 
            await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
          setIsBiometricAvailable(true);
        } else {
          // For demo purposes on non-supported browsers, we can simulate availability 
          // but in a real production environment, we strictly adhere to device capability.
          // setIsBiometricAvailable(true); // Uncomment for forced demo testing
        }
      } catch (e) {
        setIsBiometricAvailable(false);
      }
    };
    checkBiometrics();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthMethod('email');
    setTimeout(() => {
      onLogin({ id: '1', email, name: email.split('@')[0] });
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleStart = () => {
    setAuthMethod('google');
    setGoogleFlow('picking');
  };

  const handleSelectAccount = (account: typeof mockGoogleAccounts[0]) => {
    if (!account.email) {
      setGoogleFlow('idle');
      setAuthMethod(null);
      return;
    }

    setGoogleFlow('verifying');
    setVerificationStep(0);
    
    const stepInterval = setInterval(() => {
      setVerificationStep(prev => {
        if (prev >= verificationSteps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => {
            onLogin({ 
              id: 'google_123', 
              email: account.email, 
              name: account.name 
            });
            setGoogleFlow('idle');
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
  };

  const handleSocialLogin = (provider: 'apple') => {
    setIsLoading(true);
    setAuthMethod(provider);
    setTimeout(() => {
      onLogin({ 
        id: 'apple_456', 
        email: `apple@wellness.com`, 
        name: 'Apple User' 
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    setAuthMethod('biometric');
    setBiometricStatus('scanning');
    
    try {
      // Simulate real biometric check latency
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success simulation
      onLogin({ 
        id: 'bio_user_789', 
        email: 'biometric@wellness.com', 
        name: 'Secure User' 
      });
      setBiometricStatus('idle');
    } catch (error) {
      console.error("Biometric authentication failed", error);
      setBiometricStatus('error');
      setTimeout(() => {
        setBiometricStatus('idle');
        setAuthMethod(null);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 max-w-md mx-auto relative">
      {/* Biometric Scanning Overlay */}
      {biometricStatus === 'scanning' && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[3rem] p-12 shadow-2xl border border-white/10 flex flex-col items-center text-center space-y-8 animate-in zoom-in duration-300">
            <div className="relative">
              <div className="w-32 h-32 bg-lime-500/10 rounded-full flex items-center justify-center relative">
                <svg className="text-lime-500 animate-pulse" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                {/* Scanning line animation */}
                <div className="absolute inset-0 border-2 border-lime-500/30 rounded-full animate-ping"></div>
                <div className="absolute inset-4 border-2 border-lime-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-black">Biometric Scan</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Please confirm your identity using Fingerprint or Face ID</p>
            </div>

            <button 
              onClick={() => { setBiometricStatus('idle'); setAuthMethod(null); setIsLoading(false); }}
              className="text-xs font-black text-zinc-400 uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              Cancel & Use Password
            </button>
          </div>
        </div>
      )}

      {/* Google Flow Overlays */}
      {googleFlow !== 'idle' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-2xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center animate-in zoom-in duration-300">
            {googleFlow === 'picking' ? (
              <div className="w-full space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="google" />
                  </div>
                  <h3 className="text-xl font-black">Sign in with Google</h3>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Select an account</p>
                </div>

                <div className="space-y-3">
                  {mockGoogleAccounts.map((acc, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSelectAccount(acc)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95 text-left"
                    >
                      {acc.img ? (
                        <img src={acc.img} className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-700" alt="acc" />
                      ) : (
                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-black text-zinc-900 dark:text-zinc-50 leading-none">{acc.name}</p>
                        {acc.email && <p className="text-[10px] font-bold text-zinc-400 mt-1">{acc.email}</p>}
                      </div>
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => setGoogleFlow('idle')}
                  className="w-full py-3 text-xs font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center text-center space-y-8">
                <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center shadow-inner relative overflow-hidden">
                   <img src="https://www.google.com/favicon.ico" className="w-10 h-10 z-10" alt="google" />
                   <div className="absolute inset-0 bg-gradient-to-tr from-lime-500/10 to-transparent"></div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-black">Google Sign In</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">Verifying Identity</p>
                </div>

                <div className="w-full space-y-4">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-1.5 h-1 items-end">
                       {verificationSteps.map((_, i) => (
                         <div key={i} className={`w-6 h-1 rounded-full transition-all duration-500 ${i <= verificationStep ? 'bg-lime-500 shadow-[0_0_8px_#84cc16]' : 'bg-zinc-100 dark:bg-zinc-800'}`}></div>
                       ))}
                    </div>
                    <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 animate-pulse">{verificationSteps[verificationStep]}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-zinc-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Session Active</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <Logo className="scale-75" />
        <div className="w-10" />
      </div>

      <h2 className="text-3xl font-extrabold mb-2">{t('login')}</h2>
      <p className="text-zinc-500 mb-8">Welcome back! Please enter your details.</p>

      {/* Conditional Biometric Login Option */}
      {isBiometricAvailable && (
        <button 
          onClick={handleBiometricLogin}
          disabled={isLoading}
          className="w-full mb-8 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-2xl shadow-zinc-500/20"
        >
          {isLoading && authMethod === 'biometric' ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-zinc-900/30 dark:border-t-zinc-900 rounded-full animate-spin"></div>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M12 8v4m0 4h.01"/>
            </svg>
          )}
          <span className="uppercase tracking-widest text-sm">Sign In with Biometrics</span>
        </button>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
          <input 
            type="email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-lime-500 transition-all font-medium"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Password</label>
          <input 
            type="password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-lime-500 transition-all font-medium"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-lime-500 focus:ring-lime-500" />
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Remember me</span>
          </label>
          <button type="button" className="text-lime-600 font-black hover:underline uppercase text-[10px] tracking-widest">Forgot password?</button>
        </div>

        <button 
          disabled={isLoading}
          className="w-full bg-lime-500 hover:bg-lime-600 disabled:opacity-50 text-white font-black py-5 rounded-2xl shadow-xl shadow-lime-500/20 transition-all flex items-center justify-center gap-3 active:scale-95 uppercase tracking-[0.2em] text-sm"
        >
          {isLoading && authMethod === 'email' && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
          {isLoading && authMethod === 'email' ? 'Verifying...' : t('login')}
        </button>
      </form>

      <div className="mt-12">
        <div className="relative flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800"></div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">or social login</span>
          <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleGoogleStart}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 py-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50 active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="google" />
            <span className="text-xs uppercase tracking-widest">Google</span>
          </button>
          <button 
            onClick={() => handleSocialLogin('apple')}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 py-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50 active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2.001-.156-3.99 1.096-4.01 1.096zm2.484-4.52c.897-1.09 1.507-2.61 1.338-4.13-1.312.052-2.903.87-3.831 1.961-.831.96-1.558 2.52-1.365 4.013 1.454.117 2.961-.754 3.858-1.844z"/>
            </svg>
            <span className="text-xs uppercase tracking-widest">Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
