/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // Exclude React Native mobile app directories from Next.js compilation
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/carte-mobile/**', '**/carte-mobile-fresh/**', '**/node_modules/**'],
    };
    return config;
  },
  // Exclude from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    dirs: ['app', 'components', 'lib'], // Only lint Next.js directories
  },
}

module.exports = nextConfig