import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Join STEADYWRK. Open roles in AI, engineering, operations, and marketing in Amman, Jordan. Apply in 3 minutes.',
  alternates: { canonical: '/careers' },
  openGraph: {
    title: 'Careers at STEADYWRK | AI & Tech Jobs in Jordan',
    description: 'Open roles in AI, engineering, operations, and marketing. Amman, Jordan.',
    url: 'https://steadywrk.app/careers',
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
