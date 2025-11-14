/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@thebeautypro/database', '@thebeautypro/ui', '@thebeautypro/types'],
  images: {
    domains: [
      'localhost',
      'thebeautypro.s3.amazonaws.com',
      'via.placeholder.com', // Remove in production
    ],
  },
};

module.exports = nextConfig;
