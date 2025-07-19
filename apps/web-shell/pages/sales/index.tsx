import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AppNavbar, Header, SideMenu } from '@fiap-farms/web-ui';
import { useAuth } from '@fiap-farms/auth-store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { CircularProgress, Container } from '@mui/material';

const SalesApp = dynamic(() => import('salesApp/Index'), {
  ssr: false,
});

export default function ShellView() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu />
      <AppNavbar />
      <Box component="main">
        <Stack
          spacing={2}
          sx={{
            alignItems: 'center',
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Header />
          <SalesApp />
        </Stack>
      </Box>
    </Box>
  );
}
