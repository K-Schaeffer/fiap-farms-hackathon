import { useEffect } from 'react';
import { setupAuthListener, useAuthStore } from '../stores/authStore';

// Hook for using the auth store - returns complete auth state and actions
export const useAuth = () => {
  return useAuthStore();
};

// Hook for setting up auth listener
export const useAuthListener = () => {
  useEffect(() => {
    const unsubscribe = setupAuthListener();
    return () => unsubscribe();
  }, []);
};
