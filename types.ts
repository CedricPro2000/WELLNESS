
export type Language = 'en' | 'rw' | 'fr' | 'sw';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  country?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
}

export interface ScanResult {
  score: number;
  nutrition: string;
  hydration: string;
  localFoods: string[];
  status: 'Good' | 'Attention' | 'Poor';
}

export interface Lesson {
  id: string;
  title: string;
  category: 'nutrition' | 'hydration' | 'lifestyle';
  why: string;
  steps: string[];
  icon: string;
  swap?: {
    from: string;
    to: string;
    benefit: string;
  };
}

export type GoalFrequency = 'daily' | 'weekly' | 'monthly';
export type GoalCategory = 'scan' | 'hydrate' | 'nutrition';

export interface UserGoal {
  id: string;
  title: string;
  category: GoalCategory;
  frequency: GoalFrequency;
  target: number;
  current: number;
  streak: number;
  lastUpdated: string;
  reminderTime?: string;
}

export interface Translation {
  [key: string]: {
    [lang in Language]: string;
  };
}
