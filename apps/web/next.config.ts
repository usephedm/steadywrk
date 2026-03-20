import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [100, 75],
  },
};

export default nextConfig;
