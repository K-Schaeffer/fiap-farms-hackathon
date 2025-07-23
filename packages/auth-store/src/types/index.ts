import { User } from 'firebase/auth';

// Auth store
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface AuthStore extends AuthState, AuthActions {}

// Sale goals store
export type StoreSaleGoal = {
  type: 'sales';
  targetProfit: number;
};

export type StoreSale = {
  totalSaleProfit?: number;
  ownerId: string;
};

export interface SalesGoalState {
  activeSalesGoal: StoreSaleGoal | null;
  currentProfit: number;
  isSalesGoalAchieved: boolean;
  reset: () => void;
  initialize: (ownerId: string) => () => void;
}

// Production goals store
export type StoreProductionGoal = {
  type: 'production';
  targetYield: number;
};

export type StoreProductionItem = {
  yield?: number;
  ownerId: string;
  status: string;
};

export interface ProductionGoalState {
  activeProductionGoal: StoreProductionGoal | null;
  currentYield: number;
  isProductionGoalAchieved: boolean;
  reset: () => void;
  initialize: (ownerId: string) => () => void;
}
