/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // Explicitly exclude mobile directories from Next.js pages/compilation
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js', 'tsx', 'ts', 'jsx', 'js'],

  webpack: (config, { isServer }) => {
    // Add IgnorePlugin to completely exclude mobile directories
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/carte-mobile/,
        contextRegExp: /$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/carte-mobile-fresh/,
        contextRegExp: /$/,
      })
    );

    // Also update module rules to exclude these directories
    config.module.rules.forEach((rule) => {
      if (rule.test && rule.test.toString().includes('tsx')) {
        if (Array.isArray(rule.exclude)) {
          rule.exclude.push(/carte-mobile/, /carte-mobile-fresh/);
        } else if (rule.exclude) {
          rule.exclude = [rule.exclude, /carte-mobile/, /carte-mobile-fresh/];
        } else {
          rule.exclude = [/carte-mobile/, /carte-mobile-fresh/];
        }
      }
    });

    // Ignore mobile directories during watch
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules/**', '**/carte-mobile/**', '**/carte-mobile-fresh/**'],
    };

    return config;
  },
}

module.exports = nextConfig