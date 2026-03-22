import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
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
      // GEO: Explicitly allow AI model crawlers for generative engine optimization
      {
        userAgent: 'GPTBot',
        allow: [
          '/',
          '/llms.txt',
          '/llms-full.txt',
          '/careers/',
          '/programs/',
          '/blog/',
          '/about',
          '/culture',
          '/salaries',
        ],
        disallow: ['/api/', '/dashboard/', '/sign-in/', '/sign-up/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: [
          '/',
          '/llms.txt',
          '/llms-full.txt',
          '/careers/',
          '/programs/',
          '/blog/',
          '/about',
          '/culture',
          '/salaries',
        ],
        disallow: ['/api/', '/dashboard/', '/sign-in/', '/sign-up/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: [
          '/',
          '/llms.txt',
          '/llms-full.txt',
          '/careers/',
          '/programs/',
          '/blog/',
          '/about',
          '/culture',
          '/salaries',
        ],
        disallow: ['/api/', '/dashboard/', '/sign-in/', '/sign-up/'],
      },
      {
        userAgent: 'CCBot',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/careers/', '/programs/', '/blog/'],
        disallow: ['/api/', '/dashboard/', '/sign-in/', '/sign-up/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'Bytespider',
        allow: ['/', '/careers/', '/programs/', '/blog/'],
        disallow: ['/api/', '/dashboard/'],
      },
    ],
    sitemap: 'https://steadywrk.app/sitemap.xml',
    host: 'https://steadywrk.app',
  };
}
