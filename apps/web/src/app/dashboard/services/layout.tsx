import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services — AI Lab, Facility Management, Marketing & BPO',
  description:
    'SteadyWrk delivers AI Lab & Studio, Facility Management, Digital Marketing, and AI BPO services. US company operating in Amman, Jordan.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Our Services | SteadyWrk',
    description: 'AI Lab, Facility Management, Digital Marketing, and AI BPO. What we build.',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
