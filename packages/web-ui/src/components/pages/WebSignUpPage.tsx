import { useForm } from 'react-hook-form';
import {
  Paper,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
  Link,
} from '@mui/material';
import { TextFieldElement } from 'react-hook-form-mui';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface WebSignUpPageProps {
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
  onLoginRedirect: () => void;
  error: string | null;
  isLoading: boolean;
}

export function WebSignUpPage({
  onSignUp,
  onLoginRedirect,
  error,
  isLoading,
}: WebSignUpPageProps) {
  const { control, handleSubmit, watch } = useForm<SignUpFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: SignUpFormData) => {
    await onSignUp(data.name, data.email, data.password);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        widtht: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sign Up
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextFieldElement
            name="name"
            control={control}
            fullWidth
            label="Name"
            type="text"
            margin="normal"
            disabled={isLoading}
            rules={{
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters long',
              },
              pattern: {
                value: /^[a-zA-Z\s]+$/,
                message: 'Name can only contain letters and spaces',
              },
            }}
          />

          <TextFieldElement
            name="email"
            control={control}
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            disabled={isLoading}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address',
              },
            }}
          />

          <TextFieldElement
            name="password"
            control={control}
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            disabled={isLoading}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
            }}
          />

          <TextFieldElement
            name="confirmPassword"
            control={control}
            fullWidth
            label="Confirm Password"
            type="password"
            margin="normal"
            disabled={isLoading}
            rules={{
              required: 'Please confirm your password',
              validate: (value: string) =>
                value === password || 'Passwords do not match',
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link
                component="button"
                type="button"
                onClick={onLoginRedirect}
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
