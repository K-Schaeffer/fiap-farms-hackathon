import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirebaseAuth } from '@fiap-farms/firebase-config';
import { AuthStore } from '../types';

export const createAuthStore = () => {
  console.log('Creating new auth store');
  const auth = getFirebaseAuth();

  return create<AuthStore>()(
    subscribeWithSelector(set => ({
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

      signUp: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const userCredential = await createUserWithEmailAndPassword(
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
    }))
  );
};

// Default store instance
export const useAuthStore = createAuthStore();

// Auth state listener setup
export const setupAuthListener = (
  store: ReturnType<typeof createAuthStore>
) => {
  const auth = getFirebaseAuth();

  return onAuthStateChanged(auth, user => {
    store.getState().setUser(user);
  });
};
