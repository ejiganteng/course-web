/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '8000', 
        pathname: '/storage/**',
      },
      // Add your production domain here later
      // {
      //   protocol: 'https',
      //   hostname: 'yourdomain.com',
      //   pathname: '/storage/**',
      // },
    ],
    
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  
  reactStrictMode: true,
};

module.exports = nextConfig;