
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
};

export default nextConfig;
