import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { MobileSignUp } from '../../components';
import { useAuth } from '@fiap-farms/shared-stores';
import { Keyboard } from 'react-native';

export default function SignUpScreen() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, clearError } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    clearError();
    setError(null);
  }, [clearError]);
  // Clear any existing auth errors when component mounts or comes into focus

  const handleSignUp = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      setError(null);
      clearError();
      setIsLoading(true);
      await signUp(name, email, password);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    setError(null);
    clearError();
    Keyboard.dismiss();
    setTimeout(() => {
      router.push('/(auth)/login');
    }, 100);
  };

  return (
    <MobileSignUp
      onSignUp={handleSignUp}
      onLoginRedirect={handleLoginRedirect}
      error={error}
      isLoading={isLoading}
    />
  );
}
