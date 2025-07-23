import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirebaseAuth } from '@fiap-farms/firebase';
import { AuthStore } from '../types';

const auth = getFirebaseAuth();

export const useAuthStore = create<AuthStore>(set => ({
  // State
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  // Actions
  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({
        user: userCredential.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: (error as Error).message,
        isLoading: false,
        user: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  signUp: async (name: string, email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      set({
        user: userCredential.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: (error as Error).message,
        isLoading: false,
        user: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      await firebaseSignOut(auth);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: (error as Error).message,
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  setUser: (user: User | null) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setError: (error: string | null) => set({ error }),
}));

// Auth state listener setup
export const setupAuthListener = () => {
  return onAuthStateChanged(auth, user => {
    useAuthStore.getState().setUser(user);
  });
};
