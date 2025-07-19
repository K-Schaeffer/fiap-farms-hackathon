import { Container, Paper, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@fiap-farms/auth-store';

export default function Web() {
  // Get auth state from the store
  const { user } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          color="success.main"
        >
          Welcome, {user?.email}! You&apos;re logged in.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Link href="/sales" passHref>
            <Button variant="contained" color="primary">
              Go to Sales
            </Button>
          </Link>
          <Link href="/products" passHref>
            <Button variant="contained" color="secondary">
              Go to Products
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
