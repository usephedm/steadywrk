import { ClientGlobals } from '@/components/ui/client-globals';
import { PostHogProvider } from '@/lib/posthog';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import type { ReactNode } from 'react';
import './globals.css';

const cabinetGrotesk = localFont({
  src: '../fonts/CabinetGrotesk-Variable.woff2',
  variable: '--font-display',
  display: 'swap',
  weight: '100 900',
});

const satoshi = localFont({
  src: '../fonts/Satoshi-Variable.woff2',
  variable: '--font-body',
  display: 'swap',
  weight: '300 900',
});

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
    'AI-native career-launch platform for Jordan\u2019s most ambitious talent. Ship production AI systems from week one. 14-day hiring. Real mentorship. Real growth.',
  metadataBase: new URL('https://steadywrk.app'),
  keywords: [
    'AI jobs Jordan',
    'AI careers Amman',
    'women in tech Jordan',
    'AI internships Jordan',
    'best startups Jordan',
    'remote AI work Jordan',
    'prompt engineering career',
    'STEADYWRK',
    'AI-native career platform',
    'tech jobs MENA',
  ],
  authors: [{ name: 'STEADYWRK', url: 'https://steadywrk.app' }],
  creator: 'STEADYWRK LLC',
  publisher: 'STEADYWRK LLC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://steadywrk.app',
  },
  openGraph: {
    title: 'STEADYWRK | Where Ambition Compounds',
    description:
      'AI-native career-launch platform. Ship production AI systems from week one. 14-day hiring. Amman, Jordan.',
    siteName: 'STEADYWRK',
    type: 'website',
    locale: 'en_US',
    url: 'https://steadywrk.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STEADYWRK | Where Ambition Compounds',
    description:
      'AI-native career-launch platform for Jordan\u2019s most ambitious talent. Ship production AI from week one.',
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
  category: 'technology',
};

const shouldBypassClerk = process.env.PLAYWRIGHT_BYPASS_AUTH === '1';

function renderProviders(children: ReactNode) {
  if (shouldBypassClerk) {
    return <PostHogProvider>{children}</PostHogProvider>;
  }

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#E58A0F',
          fontFamily: 'Satoshi, system-ui, sans-serif',
        },
      }}
    >
      <PostHogProvider>{children}</PostHogProvider>
    </ClerkProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cabinetGrotesk.variable} ${satoshi.variable} h-full antialiased`}>
      <head>
        {/* Ahrefs Web Analytics */}
        {/* Preload critical assets */}
        <link rel="preload" href="/logo.webp" as="image" type="image/webp" />
        <link
          rel="preload"
          href="/brand/steadywrk-ai-work.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />

        {/* DNS prefetch + preconnect for third-party speed */}
        <link rel="preconnect" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://analytics.ahrefs.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://analytics.ahrefs.com" />
        <link rel="preconnect" href="https://us.i.posthog.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://us.i.posthog.com" />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/logo.webp" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFAF8]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#E58A0F] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        {renderProviders(children)}
        <ClientGlobals />
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="xlEN572+HO98vWtLtHolWQ"
          strategy="afterInteractive"
        />
        {/* JSON-LD Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'STEADYWRK',
              legalName: 'STEADYWRK LLC',
              url: 'https://steadywrk.app',
              logo: 'https://steadywrk.app/logo.webp',
              description:
                'AI-native career-launch platform for Jordan\u2019s most ambitious talent. We bridge the gap between education and elite work through structured hiring, real AI projects, and mentorship.',
              foundingDate: '2026',
              sameAs: ['https://instagram.com/swrk.jo'],
              address: [
                {
                  '@type': 'PostalAddress',
                  streetAddress: 'Building 15, King Hussein Business Park',
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
                contactType: 'recruitment',
              },
              knowsAbout: [
                'Artificial Intelligence',
                'Career Development',
                'AI Agent Systems',
                'Field Service Management',
                'Digital Marketing',
                'Business Process Outsourcing',
              ],
            }),
          }}
        />
        {/* JSON-LD WebSite with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'STEADYWRK',
              url: 'https://steadywrk.app',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://steadywrk.app/careers?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* JSON-LD BreadcrumbList */}
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
                  name: 'Careers',
                  item: 'https://steadywrk.app/careers',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Programs',
                  item: 'https://steadywrk.app/programs',
                },
                {
                  '@type': 'ListItem',
                  position: 4,
                  name: 'About',
                  item: 'https://steadywrk.app/about',
                },
                {
                  '@type': 'ListItem',
                  position: 5,
                  name: 'Culture',
                  item: 'https://steadywrk.app/culture',
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
