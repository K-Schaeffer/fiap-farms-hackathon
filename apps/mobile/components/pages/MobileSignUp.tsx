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

export interface MobileSignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface MobileSignUpProps {
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
  onLoginRedirect: () => void;
  error: string | null;
  isLoading: boolean;
}

export function MobileSignUp({
  onSignUp,
  onLoginRedirect,
  error,
  isLoading,
}: MobileSignUpProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showError, setShowError] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<MobileSignUpFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  React.useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  // Dismiss keyboard when component mounts to prevent layout issues
  React.useEffect(() => {
    Keyboard.dismiss();
  }, []);

  const onSubmit = async (data: MobileSignUpFormData) => {
    Keyboard.dismiss();
    await onSignUp(data.name, data.email, data.password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleLoginPress = () => {
    onLoginRedirect();
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
                Create Account
              </Text>
              <Text variant="bodyLarge" style={styles.subtitle}>
                Sign up to get started with FIAP Farms
              </Text>
            </View>

            <Card style={styles.card} mode="elevated">
              <Card.Content style={styles.cardContent}>
                <View style={styles.form}>
                  <Controller
                    control={control}
                    name="name"
                    rules={{
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: 'Name can only contain letters and spaces',
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label="Name"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        mode="outlined"
                        autoCapitalize="words"
                        error={!!errors.name}
                        style={styles.input}
                        disabled={isLoading}
                      />
                    )}
                  />
                  {errors.name && (
                    <Text variant="bodySmall" style={styles.errorText}>
                      {errors.name.message}
                    </Text>
                  )}

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
                        autoComplete="email"
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
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
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
                            onPress={togglePasswordVisibility}
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

                  <Controller
                    control={control}
                    name="confirmPassword"
                    rules={{
                      required: 'Please confirm your password',
                      validate: value =>
                        value === password || 'Passwords do not match',
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label="Confirm Password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        mode="outlined"
                        secureTextEntry={!showConfirmPassword}
                        error={!!errors.confirmPassword}
                        style={styles.input}
                        disabled={isLoading}
                        right={
                          <TextInput.Icon
                            icon={showConfirmPassword ? 'eye-off' : 'eye'}
                            onPress={toggleConfirmPasswordVisibility}
                          />
                        }
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <Text variant="bodySmall" style={styles.errorText}>
                      {errors.confirmPassword.message}
                    </Text>
                  )}

                  <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    style={styles.submitButton}
                    disabled={!isValid || isLoading}
                    loading={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </Button>

                  <View style={styles.loginContainer}>
                    <Text variant="bodyMedium" style={styles.loginText}>
                      Already have an account?
                    </Text>
                    <Button
                      mode="text"
                      onPress={handleLoginPress}
                      disabled={isLoading}
                      style={styles.loginButton}
                    >
                      Sign In
                    </Button>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={showError && !!error}
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#666',
  },
  loginButton: {
    marginLeft: 4,
  },
  snackbar: {
    backgroundColor: '#d32f2f',
  },
});
