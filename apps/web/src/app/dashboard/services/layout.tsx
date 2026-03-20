import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services | AI Lab, Facility Management, Marketing, BPO — SteadyWrk',
  description:
    'SteadyWrk offers AI Lab & Studio, Facility Management, Digital Marketing, and AI BPO services. US company, now operating in Jordan.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
