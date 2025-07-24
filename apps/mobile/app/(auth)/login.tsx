import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { MobileLogin } from '../../components';
import { useAuth } from '@fiap-farms/shared-stores';
import { Keyboard } from 'react-native';

export default function LoginScreen() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, clearError } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    clearError();
    setError(null);
  }, [clearError]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      clearError();
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
    clearError();
    Keyboard.dismiss();
    setTimeout(() => {
      router.push('/(auth)/signup');
    }, 100);
  };

  return (
    <MobileLogin
      onLogin={handleLogin}
      onSignUpRedirect={handleSignUpRedirect}
      error={error}
      isLoading={isLoading}
    />
  );
}
