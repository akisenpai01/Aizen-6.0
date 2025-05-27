
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Required for Capacitor static export
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Required for static export if using next/image with default loader
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media-hosting.imagekit.io',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent Node.js core modules from being bundled on the client
      config.resolve.fallback = {
        ...config.resolve.fallback, // Spread existing fallbacks if any
        fs: false,
        tls: false,
        net: false,
        child_process: false,
        http2: false, // Add http2
        // You might need to add other Node.js core modules here if they cause issues
      };
    }
    return config;
  },
};

export default nextConfig;
