/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  output: 'standalone',
  poweredByHeader: false,
};

module.exports = nextConfig; 