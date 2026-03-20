import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Careers at SteadyWrk | We're Hiring",
  description:
    'Join SteadyWrk — open positions in Engineering, AI Lab, Marketing, Operations, and BPO. Remote and Jordan-based roles available.',
};

export default function HiringLayout({ children }: { children: React.ReactNode }) {
  return children;
}
