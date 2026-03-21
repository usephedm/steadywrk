import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FAFAF8',
};

export const metadata: Metadata = {
  title: {
    default: 'STEADYWRK | Where Ambition Compounds',
    template: '%s | STEADYWRK',
  },
  description:
    'Jordan\'s AI-native career platform. Elite standards, rapid development, structured opportunity. AI Lab, BPO, Digital Marketing, and Facility Management. Apply now.',
  metadataBase: new URL('https://steadywrk.app'),
  keywords: [
    'AI jobs Jordan',
    'women in tech Jordan',
    'AI internship Amman',
    'best startups Jordan',
    'remote AI work Jordan',
    'career growth startups',
    'STEADYWRK',
    'AI BPO Jordan',
    'digital marketing jobs Amman',
    'prompt engineering career',
  ],
  authors: [{ name: 'STEADYWRK', url: 'https://steadywrk.app' }],
  creator: 'STEADYWRK',
  openGraph: {
    title: 'STEADYWRK | Where Ambition Compounds',
    description:
      'Jordan\'s AI-native career platform. Elite standards. Rapid development. Structured opportunity.',
    siteName: 'STEADYWRK',
    type: 'website',
    locale: 'en_US',
    url: 'https://steadywrk.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STEADYWRK | Where Ambition Compounds',
    description:
      'Jordan\'s AI-native career platform. Elite standards. Rapid development. Structured opportunity.',
    creator: '@steadywrk',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Cabinet Grotesk (display) + Satoshi (body) from Fontshare */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&f[]=satoshi@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        {/* JetBrains Mono for code/mono */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />

        {/* JSON-LD Organization — Brand Guidelines v2 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'STEADYWRK',
              legalName: 'Kayan Ventures Jordan LLC',
              url: 'https://steadywrk.app',
              logo: 'https://steadywrk.app/logo-orange.svg',
              description:
                'Jordan\'s AI-native career platform offering elite training, rapid development, and structured opportunity in AI, BPO, Digital Marketing, and Operations.',
              foundingDate: '2026',
              slogan: 'Where ambition compounds.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Building 15, King Hussein Business Park',
                addressLocality: 'Amman',
                addressCountry: 'JO',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'hello@steadywrk.app',
                contactType: 'recruitment',
              },
              sameAs: [
                'https://www.instagram.com/steadywrk',
                'https://www.linkedin.com/company/steadywrk',
                'https://www.tiktok.com/@steadywrk',
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
