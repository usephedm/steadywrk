import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/dashboard/', '/sign-in/', '/sign-up/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
      {
        userAgent: 'AhrefsBot',
        allow: '/',
      },
    ],
    sitemap: 'https://steadywrk.app/sitemap.xml',
    host: 'https://steadywrk.app',
  };
}
