import { hasAdminAccess } from '@/lib/auth/roles';
import { currentUser } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

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
  const user = await currentUser();

  if (!user || !hasAdminAccess(user.publicMetadata)) {
    notFound();
  }

  return children;
}
