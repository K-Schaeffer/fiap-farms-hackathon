import { useForm } from 'react-hook-form';
import {
  Container,
  Paper,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
  Link,
} from '@mui/material';
import { TextFieldElement } from 'react-hook-form-mui';

interface LoginFormData {
  email: string;
  password: string;
}

interface WebLoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUpRedirect: () => void;
  error: string | null;
  isLoading: boolean;
}

export function WebLoginPage({
  onLogin,
  onSignUpRedirect,
  error,
  isLoading,
}: WebLoginPageProps) {
  const { control, handleSubmit } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await onLogin(data.email, data.password);
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
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
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
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Don&apos;t have an account?{' '}
              <Link
                component="button"
                type="button"
                onClick={onSignUpRedirect}
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
