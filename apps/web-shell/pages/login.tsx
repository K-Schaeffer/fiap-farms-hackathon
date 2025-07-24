import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@fiap-farms/shared-stores';
import { WebLogin } from '@fiap-farms/web-ui';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await signIn(email, password);
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    router.push('/signup');
  };

  return (
    <WebLogin
      onLogin={handleLogin}
      onSignUpRedirect={handleSignUpRedirect}
      error={error}
      isLoading={isLoading}
    />
  );
}
