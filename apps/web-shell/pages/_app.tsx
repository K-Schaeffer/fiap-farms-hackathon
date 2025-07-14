import type { AppProps } from 'next/app';
import '../styles/global.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <h1>Web Shell</h1>
      <Component {...pageProps} />
    </div>
  );
}
