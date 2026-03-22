import { getLeaderboardData } from '@/app/actions/leaderboard';
import { LeaderboardClient, type LeaderboardUser } from './client';

export default async function LeaderboardPage() {
  const leaderboardData = await getLeaderboardData();

  return <LeaderboardClient initialData={leaderboardData as LeaderboardUser[]} />;
}
