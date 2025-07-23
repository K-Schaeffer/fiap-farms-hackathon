import React, { useState } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@fiap-farms/shared-stores';
import { MobileSignUpPage } from '../../components/MobileSignUpPage';

export default function SignUpScreen() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, clearError } = useAuth();
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

  const handleSignUp = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      setError(null);
      clearError(); // Clear any previous auth store errors
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
    clearError(); // Clear errors when navigating
    router.push('/(auth)/login');
  };

  return (
    <MobileSignUpPage
      onSignUp={handleSignUp}
      onLoginRedirect={handleLoginRedirect}
      error={error}
      isLoading={isLoading}
    />
  );
}
