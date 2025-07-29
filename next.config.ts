import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

// ✅ next-intl config connect
const withNextIntl = createNextIntlPlugin('./next-intl.config.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ TS errors ignore karega
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Yeh line ESLint errors ignore karegi
  },
};

// ✅ Export wrapped config
export default withNextIntl(nextConfig);
