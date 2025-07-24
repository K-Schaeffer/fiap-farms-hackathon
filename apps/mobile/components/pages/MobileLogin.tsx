import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Text, TextInput, Button, Card, Snackbar } from 'react-native-paper';

export interface MobileLoginFormData {
  email: string;
  password: string;
}

export interface MobileLoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUpRedirect: () => void;
  error: string | null;
  isLoading: boolean;
}

export function MobileLogin({
  onLogin,
  onSignUpRedirect,
  error,
  isLoading,
}: MobileLoginProps) {
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
    Keyboard.dismiss();
    await onLogin(data.email, data.password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUpPress = () => {
    onSignUpRedirect();
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text variant="headlineLarge" style={styles.title}>
                Welcome Back
              </Text>
              <Text variant="bodyLarge" style={styles.subtitle}>
                Sign in to your FIAP Farms account
              </Text>
            </View>

            <Card style={styles.card} mode="elevated">
              <Card.Content style={styles.cardContent}>
                <View style={styles.form}>
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
                        onBlur={onBlur}
                        onChangeText={onChange}
                        mode="outlined"
                        error={!!errors.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
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
                        onBlur={onBlur}
                        onChangeText={onChange}
                        mode="outlined"
                        error={!!errors.password}
                        secureTextEntry={!showPassword}
                        right={
                          <TextInput.Icon
                            icon={showPassword ? 'eye-off' : 'eye'}
                            onPress={togglePasswordVisibility}
                          />
                        }
                        style={styles.input}
                        disabled={isLoading}
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
                    style={styles.submitButton}
                    loading={isLoading}
                    disabled={!isValid || isLoading}
                  >
                    Sign In
                  </Button>

                  <View style={styles.signUpContainer}>
                    <Text variant="bodyMedium" style={styles.signUpText}>
                      Don't have an account?
                    </Text>
                    <Button
                      mode="text"
                      onPress={handleSignUpPress}
                      disabled={isLoading}
                      style={styles.signUpButton}
                    >
                      Sign Up
                    </Button>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        duration={4000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </>
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
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
  },
  cardContent: {
    padding: 24,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#d32f2f',
    marginTop: -12,
    marginBottom: 4,
  },
  submitButton: {
    marginTop: 8,
    paddingVertical: 4,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signUpText: {
    color: '#666',
  },
  signUpButton: {
    marginLeft: 4,
  },
  snackbar: {
    backgroundColor: '#d32f2f',
  },
});
