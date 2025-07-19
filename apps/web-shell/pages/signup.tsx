import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@fiap-farms/auth-store';
import { WebSignUpPage } from '@fiap-farms/web-ui';

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignUp = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      setError(null);
      setIsLoading(true);
      await signUp(name, email, password);
      router.push('/');
    } catch (err) {
      console.error('Sign up error:', err);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <WebSignUpPage
      onSignUp={handleSignUp}
      onLoginRedirect={handleLoginRedirect}
      error={error}
      isLoading={isLoading}
    />
  );
}
