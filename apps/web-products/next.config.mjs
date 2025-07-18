import { NextFederationPlugin } from '@module-federation/nextjs-mf';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.output.publicPath = '/_next/';
    config.plugins.push(
      new NextFederationPlugin({
        name: 'productsApp',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './Index': './pages/index.tsx',
        },
        shared: {
          '@fiap-farms/firebase-config': {
            singleton: true,
            eager: false,
          },
          '@fiap-farms/auth-store': {
            singleton: true,
            eager: false,
          },
        },
      })
    );
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
