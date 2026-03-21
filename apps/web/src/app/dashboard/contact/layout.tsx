import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Business Inquiries & Partnerships',
  description:
    'Get in touch with SteadyWrk for business inquiries, partnerships, and project discussions. Based in Amman, Jordan and the United States.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Contact SteadyWrk',
    description: 'Business inquiries, partnerships, and deals. Reach us.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
