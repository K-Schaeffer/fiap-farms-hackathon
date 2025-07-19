import type { AppProps } from 'next/app';
import '@fiap-farms/web-ui/global.css';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { useAuthListener } from '@fiap-farms/auth-store';
import { AuthGuard } from '../components/AuthGuard';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { WebAppNavbar, WebHeader, WebSideMenu } from '@fiap-farms/web-ui';
import { usePublicRoute } from '../hooks/usePublicRoute';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <WebSideMenu />
      <WebAppNavbar />
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
          <WebHeader />
          {children}
        </Stack>
      </Box>
    </Box>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  useAuthListener();
  const { isPublic } = usePublicRoute();

  return (
    <AppCacheProvider {...pageProps}>
      {isPublic ? (
        <Component {...pageProps} />
      ) : (
        <AuthGuard>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </AuthGuard>
      )}
    </AppCacheProvider>
  );
}
