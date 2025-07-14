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
      })
    );
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
