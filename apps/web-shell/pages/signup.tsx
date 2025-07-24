import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@fiap-farms/shared-stores';
import { WebSignUp } from '@fiap-farms/web-ui';

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
    <WebSignUp
      onSignUp={handleSignUp}
      onLoginRedirect={handleLoginRedirect}
      error={error}
      isLoading={isLoading}
    />
  );
}
