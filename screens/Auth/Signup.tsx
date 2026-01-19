
import React, { useState } from 'react';
import { useApp } from '../../App';
import { translations } from '../../i18n';
import { Logo, PHONE_CODES } from '../../constants';
import { User } from '../../types';

interface SignupProps {
  onBack: () => void;
  onSignup: (user: User) => void;
}

const SignupPage: React.FC<SignupProps> = ({ onBack, onSignup }) => {
  const { language } = useApp();
  const t = (key: string) => translations[key]?.[language] || key;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneCode: '+250',
    phone: '',
    password: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'google' | 'apple' | null>(null);
  const [googleFlow, setGoogleFlow] = useState<'idle' | 'picking' | 'verifying'>('idle');
  const [verificationStep, setVerificationStep] = useState(0);

  const mockGoogleAccounts = [
    { name: 'John Doe', email: 'j.doe@gmail.com', img: 'https://picsum.photos/seed/jdoe/100/100' },
    { name: 'Wellness Explorer', email: 'health.africa@gmail.com', img: 'https://picsum.photos/seed/health/100/100' },
    { name: 'Use another account', email: '', img: '' }
  ];

  const verificationSteps = [
    "Connecting to Google Services...",
    "Securing identity tokens...",
    "Verifying device integrity...",
    "Finalizing encrypted session...",
    "Signup complete"
  ];

  const isFormValid = 
    formData.name.trim() !== '' && 
    formData.email.trim() !== '' && 
    formData.phone.trim() !== '' && 
    formData.password.trim().length >= 6 && 
    formData.acceptTerms;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsLoading(true);
    setAuthMethod('email');
    setTimeout(() => {
      onSignup({ id: '2', email: formData.email, name: formData.name });
      setIsLoading(false);
    }, 1500);
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
            onSignup({ 
              id: 'google_verified_123', 
              email: account.email, 
              name: account.name 
            });
            setGoogleFlow('idle');
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
  };

  const handleSocialSignup = (provider: 'apple') => {
    setIsLoading(true);
    setAuthMethod(provider);
    setTimeout(() => {
      onSignup({ 
        id: 'apple_new', 
        email: `new_apple@wellness.com`, 
        name: 'Apple Explorer' 
      });
      setIsLoading(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 max-w-md mx-auto overflow-y-auto relative">
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
                  <h3 className="text-xl font-black">Choose an account</h3>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">to continue to Wellness</p>
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
                  <h3 className="text-xl font-black">Verification</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">Secure Cloud Handshake</p>
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
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">SSL Protective Flow</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <Logo className="scale-75" />
        <div className="w-10" />
      </div>

      <h2 className="text-3xl font-extrabold mb-2">Create Account</h2>
      <p className="text-zinc-500 mb-8">Join the wellness movement in Africa today.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Full Name</label>
          <input 
            type="text" required
            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-lime-500 font-bold transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Phone Number</label>
          <div className="flex gap-2">
            <select 
              value={formData.phoneCode}
              onChange={(e) => setFormData({...formData, phoneCode: e.target.value})}
              className="bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl px-3 py-4 focus:ring-2 focus:ring-lime-500 text-sm font-bold cursor-pointer"
            >
              {PHONE_CODES.map(pc => <option key={pc.code} value={pc.code}>{pc.code}</option>)}
            </select>
            <input 
              type="tel" required
              value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="flex-1 bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-lime-500 font-bold transition-all"
              placeholder="788 123 456"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Email</label>
          <input 
            type="email" required
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-lime-500 font-bold transition-all"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} required
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-lime-500 font-bold transition-all"
              placeholder="Min. 6 characters"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-lime-600 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {showPassword ? (
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"/>
                ) : (
                  <>
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer py-2">
          <input 
            type="checkbox" required
            checked={formData.acceptTerms} onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
            className="mt-1 w-5 h-5 rounded border-zinc-300 text-lime-500 focus:ring-lime-500 transition-all cursor-pointer" 
          />
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            I agree to the <button type="button" className="text-lime-600 font-bold underline">Terms of Service</button> and <button type="button" className="text-lime-600 font-bold underline">Privacy Policy</button>.
          </span>
        </label>

        <button 
          disabled={isLoading || !isFormValid}
          className={`w-full py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 font-black text-lg uppercase tracking-widest ${
            isFormValid 
            ? 'bg-lime-500 hover:bg-lime-600 text-white shadow-lime-500/20 active:scale-95' 
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
          }`}
        >
          {isLoading && authMethod === 'email' && <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>}
          {isLoading && authMethod === 'email' ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="relative flex items-center gap-4 my-10">
        <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800"></div>
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">or continue with</span>
        <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800"></div>
      </div>

      {/* Social Options at Bottom */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={handleGoogleStart}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 py-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50 active:scale-95"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="google" />
          Google
        </button>
        <button 
          onClick={() => handleSocialSignup('apple')}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 py-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50 active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2.001-.156-3.99 1.096-4.01 1.096zm2.484-4.52c.897-1.09 1.507-2.61 1.338-4.13-1.312.052-2.903.87-3.831 1.961-.831.96-1.558 2.52-1.365 4.013 1.454.117 2.961-.754 3.858-1.844z"/>
          </svg>
          Apple
        </button>
      </div>

      <div className="text-center mt-12">
        <p className="text-sm text-zinc-500">
          Already have an account? <button onClick={onBack} className="text-lime-600 font-bold hover:underline">Sign In</button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
