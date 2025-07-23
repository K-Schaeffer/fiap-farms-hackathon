import { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { useAuth } from '@fiap-farms/shared-stores';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading, signOut, user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isLoading) return; // Don't navigate while loading

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err: unknown) {
      console.error('Logout failed:', err);
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Don't render protected content if user is not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text variant="headlineSmall" style={styles.welcomeText}>
          Hi, {user.displayName}
        </Text>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          disabled={isLoading}
        >
          Logout
        </Button>
      </View>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Sales',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="products"
          options={{
            title: 'Products',
            headerShown: false,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  welcomeText: {
    flex: 1,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginLeft: 16,
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});
