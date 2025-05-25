/** @type {import('next').NextConfig} */
const nextConfig = {
  // Existing configuration...
  experimental: {
    serverComponentsExternalPackages: ['react-pdf'],
  },
  
  webpack: (config: { resolve: { alias: { canvas: boolean; encoding: boolean; }; fallback: any; }; }, { isServer }: any) => {
    // Handle react-pdf
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    // Handle PDF.js worker
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    return config;
  },
  
  // Allow external domains for images and files
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      // Add your production domain here
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      // Add production patterns here
    ],
  },
  
  // Handle static file serving
  async rewrites() {
    return [
      {
        source: '/storage/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/:path*`,
      },
    ];
  },
  
  // Disable strict mode if having issues with react-pdf
  reactStrictMode: false,
};

module.exports = nextConfig;