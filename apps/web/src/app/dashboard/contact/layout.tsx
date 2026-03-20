import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact SteadyWrk | Business Inquiries',
  description:
    'Get in touch with SteadyWrk for business inquiries, partnerships, and deals. Based in Amman, Jordan and the United States.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
