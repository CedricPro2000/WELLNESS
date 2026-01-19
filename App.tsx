
import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Language, AuthState } from './types';
import LandingPage from './screens/Landing';
import LoginPage from './screens/Auth/Login';
import SignupPage from './screens/Auth/Signup';
import Onboarding from './screens/Onboarding/Onboarding';
import Home from './screens/Home/Home';
import ScanScreen from './screens/Scan/ScanScreen';
import ResultsScreen from './screens/Scan/ResultsScreen';
import Profile from './screens/Profile/Profile';
import Settings from './screens/Profile/Settings';

// Contexts
interface AppContextType {
  auth: AuthState;
  login: (user: User) => void;
  signup: (user: User) => void;
  logout: () => void;
  completeOnboarding: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const App: React.FC = () => {
  const [view, setView] = useState<string>('landing');
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('wellness_lang') as Language) || 'en';
  });
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('wellness_theme') as 'light' | 'dark') || 'light';
  });
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('wellness_auth');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false, isOnboarded: false };
  });

  useEffect(() => {
    localStorage.setItem('wellness_auth', JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('wellness_theme', theme);
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('wellness_lang', lang);
  };

  const login = (user: User) => {
    setAuth({ ...auth, user, isAuthenticated: true });
    setView('home');
  };

  const signup = (user: User) => {
    setAuth({ ...auth, user, isAuthenticated: true, isOnboarded: false });
    setView('onboarding');
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false, isOnboarded: false });
    setView('landing');
  };

  const completeOnboarding = () => {
    setAuth({ ...auth, isOnboarded: true });
    setView('home');
  };

  // Route Protection Logic
  useEffect(() => {
    if (!auth.isAuthenticated && !['landing', 'login', 'signup'].includes(view)) {
      setView('landing');
    }
  }, [auth.isAuthenticated, view]);

  const renderView = () => {
    switch (view) {
      case 'landing': return <LandingPage onAction={(action) => setView(action)} />;
      case 'login': return <LoginPage onBack={() => setView('landing')} onLogin={login} />;
      case 'signup': return <SignupPage onBack={() => setView('landing')} onSignup={signup} />;
      case 'onboarding': return <Onboarding onComplete={completeOnboarding} />;
      case 'home': return <Home onNavigate={setView} />;
      case 'scan': return <ScanScreen onBack={() => setView('home')} onComplete={() => setView('results')} />;
      case 'results': return <ResultsScreen onBack={() => setView('home')} />;
      case 'profile': return <Profile onNavigate={setView} />;
      case 'settings': return <Settings onBack={() => setView('profile')} />;
      default: return <LandingPage onAction={(action) => setView(action)} />;
    }
  };

  return (
    <AppContext.Provider value={{ 
      auth, login, signup, logout, completeOnboarding, 
      language, setLanguage, theme, setTheme: setThemeState 
    }}>
      <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
        {renderView()}
      </div>
    </AppContext.Provider>
  );
};

export default App;
