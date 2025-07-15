import type { AppProps } from 'next/app';
import '@fiap-farms/web-ui/global.css';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppCacheProvider {...pageProps}>
      <Component {...pageProps} />
    </AppCacheProvider>
  );
}
