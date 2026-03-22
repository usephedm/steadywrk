import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/_next/', '/dashboard/', '/sign-in/', '/sign-up/', '/apply/'],
      },
    ],
    sitemap: 'https://steadywrk.app/sitemap.xml',
    host: 'steadywrk.app',
  };
}
