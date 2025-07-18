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
import { getFirebase } from '@fiap-farms/firebase-config';
import {
  // @ts-expect-error missing type from Firebase React Native
  getReactNativePersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import MainGrid from '../components/MainGrid';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const theme = {
  ...MD3LightTheme,
};

export default function Native() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setShowError(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const firebase = getFirebase(
        getReactNativePersistence(ReactNativeAsyncStorage)
      );
      await signInWithEmailAndPassword(firebase.auth, email, password);
      setIsLoggedIn(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <MainGrid />
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
                  disabled={loading}
                />

                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  mode="outlined"
                  secureTextEntry
                  style={styles.input}
                  disabled={loading}
                />

                <Button
                  mode="contained"
                  onPress={handleLogin}
                  style={styles.button}
                  disabled={loading}
                  contentStyle={styles.buttonContent}
                >
                  {loading ? (
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
          visible={showError}
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
