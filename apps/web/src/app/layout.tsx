import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
};

export const metadata: Metadata = {
  title: {
    default: 'SteadyWrk | AI-Powered Field Services & Digital Marketing Platform',
    template: '%s | SteadyWrk',
  },
  description:
    'SteadyWrk is an AI-human bridge platform for field service dispatch, digital marketing, AI BPO, and facility management. US company, now in Amman, Jordan. Apply to join.',
  metadataBase: new URL('https://steadywrk.app'),
  keywords: [
    'AI field services',
    'digital marketing agency Jordan',
    'AI BPO services',
    'facility management Amman',
    'subcontracting platform',
    'AI dispatch platform',
    'SteadyWrk',
    'remote work Jordan',
    'AI-powered marketing',
    'field service dispatch software',
  ],
  authors: [{ name: 'SteadyWrk', url: 'https://steadywrk.app' }],
  creator: 'SteadyWrk LLC',
  publisher: 'SteadyWrk LLC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://steadywrk.app',
  },
  openGraph: {
    title: 'SteadyWrk | AI-Powered Field Services & Digital Marketing',
    description:
      'AI Lab, Facility Management, Digital Marketing, and AI BPO. US company, now in Jordan. Apply. Train. Work.',
    siteName: 'SteadyWrk',
    type: 'website',
    locale: 'en_US',
    url: 'https://steadywrk.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SteadyWrk | AI-Powered Field Services & Digital Marketing',
    description:
      'AI Lab, Facility Management, Digital Marketing, and AI BPO. US company, now in Jordan.',
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
  verification: {
    google: 'PENDING_VERIFICATION_CODE',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        {/* #1: Ahrefs Web Analytics */}
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="xlEN572+HO98vWtLtHolWQ"
          async
        />

        {/* Preload critical assets */}
        <link rel="preload" href="/logo.webp" as="image" type="image/webp" />

        {/* #2: DNS prefetch + preconnect for third-party speed */}
        <link rel="dns-prefetch" href="https://analytics.ahrefs.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* #3: PWA manifest */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-full flex flex-col bg-black">
        {children}
        <Analytics />
        <SpeedInsights />
        {/* JSON-LD Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'SteadyWrk',
              legalName: 'SteadyWrk LLC',
              url: 'https://steadywrk.app',
              logo: 'https://steadywrk.app/logo.webp',
              description:
                'AI-human bridge platform for field service dispatch, digital marketing, AI BPO, and facility management.',
              foundingDate: '2026',
              sameAs: ['https://www.linkedin.com/company/steadywrk', 'https://x.com/steadywrk'],
              address: [
                {
                  '@type': 'PostalAddress',
                  addressLocality: 'Amman',
                  addressCountry: 'JO',
                },
                {
                  '@type': 'PostalAddress',
                  addressCountry: 'US',
                },
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'hello@steadywrk.app',
                contactType: 'sales',
              },
              knowsAbout: [
                'Artificial Intelligence',
                'Field Service Management',
                'Digital Marketing',
                'Business Process Outsourcing',
                'Facility Management',
              ],
            }),
          }}
        />
        {/* JSON-LD WebSite with SearchAction for sitelinks searchbox */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'SteadyWrk',
              url: 'https://steadywrk.app',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://steadywrk.app/dashboard?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* JSON-LD BreadcrumbList for rich SERP breadcrumbs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://steadywrk.app',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Hub',
                  item: 'https://steadywrk.app/dashboard',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Services',
                  item: 'https://steadywrk.app/dashboard/services',
                },
                {
                  '@type': 'ListItem',
                  position: 4,
                  name: 'Careers',
                  item: 'https://steadywrk.app/dashboard/hiring',
                },
                {
                  '@type': 'ListItem',
                  position: 5,
                  name: 'Blog',
                  item: 'https://steadywrk.app/dashboard/blog',
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
