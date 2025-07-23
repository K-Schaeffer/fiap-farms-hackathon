import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Text, TextInput, Button, Card, Snackbar } from 'react-native-paper';

export interface MobileLoginFormData {
  email: string;
  password: string;
}

export interface MobileLoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUpRedirect: () => void;
  error: string | null;
  isLoading: boolean;
}

export function MobileLoginPage({
  onLogin,
  onSignUpRedirect,
  error,
  isLoading,
}: MobileLoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<MobileLoginFormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  const onSubmit = async (data: MobileLoginFormData) => {
    await onLogin(data.email, data.password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Welcome Back
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Sign in to your account
          </Text>

          <Card style={styles.card}>
            <Card.Content>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={!!errors.email}
                    style={styles.input}
                    disabled={isLoading}
                  />
                )}
              />
              {errors.email && (
                <Text variant="bodySmall" style={styles.errorText}>
                  {errors.email.message}
                </Text>
              )}

              <Controller
                control={control}
                name="password"
                rules={{
                  required: 'Password is required',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    secureTextEntry={!showPassword}
                    error={!!errors.password}
                    style={styles.input}
                    disabled={isLoading}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                  />
                )}
              />
              {errors.password && (
                <Text variant="bodySmall" style={styles.errorText}>
                  {errors.password.message}
                </Text>
              )}

              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                style={styles.loginButton}
                disabled={!isValid || isLoading}
                loading={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Button
                mode="text"
                onPress={onSignUpRedirect}
                style={styles.signUpButton}
                disabled={isLoading}
              >
                Don't have an account? Sign Up
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      <Snackbar
        visible={showError && !!error}
        onDismiss={() => {
          setShowError(false);
        }}
        duration={4000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 16,
    marginLeft: 12,
  },
  loginButton: {
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 8,
  },
  signUpButton: {
    marginBottom: 8,
  },
  snackbar: {
    backgroundColor: '#d32f2f',
  },
});
