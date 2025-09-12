/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    // Server actions are stable in Next.js 14+, no longer needed
  },
  
  
  // Domain configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    domains: ['localhost', 'talentix.co.uk', 'www.talentix.co.uk'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'talentix.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'www.talentix.co.uk',
      },
    ],
  },

  // Environment variables
  env: {
    SITE_URL: process.env.SITE_URL || 'https://talentix.co.uk',
    SITE_NAME: 'Talentix',
  },
};

module.exports = nextConfig;
