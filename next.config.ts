import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

// ✅ Yeh line next-intl config file ko connect karegi
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
    ignoreBuildErrors: true,
  },
};

// ✅ Export wrapped config
export default withNextIntl(nextConfig);
