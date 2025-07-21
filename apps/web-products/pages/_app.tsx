import type { AppProps } from 'next/app';
import '@fiap-farms/web-ui/global.css';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Products App</title>
      </Head>
      <AppCacheProvider {...pageProps}>
        <Component {...pageProps} />
      </AppCacheProvider>
    </>
  );
}
