import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  MD3LightTheme,
  PaperProvider,
  TextInput,
  Button,
  Card,
  Text,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '@fiap-farms/auth-store';
import { MobileMainGrid } from '../components/MobileMainGrid';

const theme = {
  ...MD3LightTheme,
};

export default function Homepage() {
  // Get auth state and actions from the store
  const { isLoading, isAuthenticated, error, signIn, clearError, signOut } =
    useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return;
    }

    clearError();

    try {
      await signIn(email, password);
    } catch (err: unknown) {
      // Error is already handled by the auth store
      console.error('Login failed:', err);
      setShowError(true);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err: unknown) {
      console.error('Logout failed:', err);
    }
  };

  // Show error when auth store error changes
  React.useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  if (isAuthenticated) {
    return (
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text variant="headlineSmall" style={styles.welcomeText}>
                Welcome to FIAP Farms!
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
            <MobileMainGrid />
          </View>
          <StatusBar style="auto" />
        </SafeAreaView>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.loginContainer}>
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleLarge" style={styles.title}>
                  Login
                </Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                  Sign in to access your account
                </Text>

                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  disabled={isLoading}
                />

                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  mode="outlined"
                  secureTextEntry
                  style={styles.input}
                  disabled={isLoading}
                />

                <Button
                  mode="contained"
                  onPress={handleLogin}
                  style={styles.button}
                  disabled={isLoading}
                  contentStyle={styles.buttonContent}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>

        <Snackbar
          visible={showError && !!error}
          onDismiss={() => setShowError(false)}
          duration={4000}
          action={{
            label: 'Dismiss',
            onPress: () => setShowError(false),
          }}
        >
          {error}
        </Snackbar>

        <StatusBar style="auto" />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    padding: 16,
    margin: 16,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
