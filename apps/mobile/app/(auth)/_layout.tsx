import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@fiap-farms/auth-store';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Don't navigate while loading

    if (isAuthenticated) {
      // Redirect authenticated users to protected area
      router.replace('/(protected)/');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
