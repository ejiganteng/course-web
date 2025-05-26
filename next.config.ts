/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove react-pdf specific configurations
  experimental: {
    // Remove serverComponentsExternalPackages for react-pdf
  },
  
  webpack: (config: { resolve: { fallback: any; }; }, { isServer }: any) => {
    // Remove react-pdf specific webpack configs
    // Only keep basic configurations
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    return config;
  },
  
  images: {
    domains: ['localhost', '127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
  
  // Enable static optimization
  trailingSlash: false,
  
  // Better for production
  poweredByHeader: false,
  
  // React strict mode enabled for Next.js 15
  reactStrictMode: true,
};

module.exports = nextConfig;