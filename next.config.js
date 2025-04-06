/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'placehold.co', 'placekitten.com', 'picsum.photos'],
    unoptimized: true,
  },
};

module.exports = nextConfig; 