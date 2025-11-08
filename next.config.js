/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  webpack: (config) => {
    // Ignore React Native mobile app directories during build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules', '**/carte-mobile/**', '**/carte-mobile-fresh/**'],
    };
    return config;
  },
}

module.exports = nextConfig