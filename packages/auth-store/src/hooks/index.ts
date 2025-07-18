import { useEffect } from 'react';
import { useAuthStore, setupAuthListener } from '../stores/authStore';
import type { AuthStore } from '../types';

// Hook for using the default auth store - returns complete auth state and actions
export const useAuth = (): AuthStore => {
  return useAuthStore();
};

// Hook for setting up auth listener
export const useAuthListener = () => {
  useEffect(() => {
    const unsubscribe = setupAuthListener(useAuthStore);
    return () => unsubscribe();
  }, []);
};
