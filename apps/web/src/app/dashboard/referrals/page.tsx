import { getReferralStats } from '@/app/actions/dashboard';
import { ReferralsClient } from './client';

export default async function ReferralsPage() {
  const stats = await getReferralStats();

  return <ReferralsClient initialStats={stats} />;
}
