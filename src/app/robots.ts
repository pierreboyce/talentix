import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/account/',
          '/settings/',
          '/auth/',
          '/mobile-coming-soon',
          '/mobile-coming-soon-disabled',
          '/admin/',
          '/oauth-setup/',
          '/clear-storage/',
          '/subscription-demo/',
          '/dashboard-debug/',
          '/cancel-subscription/',
          '/reset-password/',
          '/mobile-dashboard/',
          '/mobile-test/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/account/',
          '/settings/',
          '/auth/',
          '/mobile-coming-soon',
          '/admin/',
        ],
      },
    ],
    sitemap: 'https://talentix.co.uk/sitemap.xml',
  }
}


