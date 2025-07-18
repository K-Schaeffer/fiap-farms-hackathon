import { NextFederationPlugin } from '@module-federation/nextjs-mf';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@mui/x-charts',
    '@mui/x-data-grid',
    '@mui/x-data-grid-pro',
    '@mui/x-date-pickers',
    '@mui/x-tree-view',
  ],
  webpack: config => {
    config.output.publicPath = '/_next/';
    config.plugins.push(
      new NextFederationPlugin({
        name: 'salesApp',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './Index': './pages/index.tsx',
        },
        shared: {
          '@fiap-farms/firebase': {
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
