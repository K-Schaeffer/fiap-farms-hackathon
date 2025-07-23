import { Typography, Box, Button } from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@fiap-farms/auth-store';
import { useState } from 'react';

export default function Root() {
  const { isAuthenticated, signIn, signOut, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 2,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom color="success">
        Welcome to Sales App
      </Typography>
      {isAuthenticated ? (
        <>
          <Typography
            variant="h6"
            component="h1"
            gutterBottom
            color="textPrimary"
          >
            Logged in as <b>{user?.email}</b>
          </Typography>
          <Box
            sx={{
              mt: 3,
              mb: 3,
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
            }}
          >
            <Link href="/new" passHref>
              <Button variant="contained" color="primary">
                Go to New Sale
              </Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button variant="contained" color="secondary">
                Go to Dashboard
              </Button>
            </Link>
            <Button
              variant="contained"
              color="warning"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </Box>
        </>
      ) : (
        <Box>
          <Typography
            variant="body1"
            color="warning.main"
            sx={{ mt: 2, mb: 2, maxWidth: 500, textAlign: 'center' }}
          >
            {`This app is for internal testing only.`}
            <br />
            {`To test authentication, notification and integration, please use the shell app.`}
            <br />
            {`Account creation is also only available in the shell app.`}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Login
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                padding: '8px',
                fontSize: '16px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                padding: '8px',
                fontSize: '16px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              disabled={isLoading}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
