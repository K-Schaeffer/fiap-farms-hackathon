import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@fiap-farms/shared-stores';
import { MobileLoginPage } from '../../components/MobileLoginPage';

export default function LoginScreen() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, clearError } = useAuth();
  const router = useRouter();

  // Clear any existing auth errors when component mounts or comes into focus
  React.useEffect(() => {
    clearError();
    setError(null);
  }, [clearError]);

  useFocusEffect(
    React.useCallback(() => {
      clearError();
      setError(null);
    }, [clearError])
  );

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      clearError(); // Clear any previous auth store errors
      setIsLoading(true);
      await signIn(email, password);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    setError(null);
    clearError(); // Clear errors when navigating
    Keyboard.dismiss(); // Dismiss keyboard before navigation
    // Small delay to ensure keyboard is fully dismissed
    setTimeout(() => {
      router.push('/(auth)/signup');
    }, 100);
  };

  return (
    <MobileLoginPage
      onLogin={handleLogin}
      onSignUpRedirect={handleSignUpRedirect}
      error={error}
      isLoading={isLoading}
    />
  );
}
