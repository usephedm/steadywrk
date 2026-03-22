import { requireDashboardAdmin } from '@/lib/auth/dashboard-access';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Careers — We're Hiring AI Engineers, Marketers & Operations",
  description:
    'Join SteadyWrk — open positions in Engineering, AI Lab, Marketing, Operations, and BPO. Remote-friendly and Amman, Jordan-based roles available now.',
  robots: { index: false, follow: false },
  openGraph: {
    title: "We're Hiring | SteadyWrk Careers",
    description: 'Open positions in AI, marketing, operations, and BPO. Join the team.',
  },
};

export default async function HiringLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardAdmin();
  return children;
}
