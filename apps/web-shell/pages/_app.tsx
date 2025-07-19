import type { AppProps } from 'next/app';
import '@fiap-farms/web-ui/global.css';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { useAuthListener } from '@fiap-farms/auth-store';
import { AuthGuard } from '../components/AuthGuard';

export default function App({ Component, pageProps }: AppProps) {
  // Setup Firebase auth state listener at app level
  useAuthListener();

  return (
    <AppCacheProvider {...pageProps}>
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </AppCacheProvider>
  );
}
