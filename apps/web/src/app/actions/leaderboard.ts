'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { desc } from 'drizzle-orm';
import { employees } from '../../../../../packages/db/src/schema';

export async function getLeaderboardData() {
  const { userId } = await auth();

  if (!db) {
    return [];
  }

  try {
    const records = await db
      .select({
        id: employees.id,
        clerkUserId: employees.clerkUserId,
        name: employees.name,
        points: employees.points,
        streakDays: employees.streakDays,
        level: employees.level,
        badges: employees.badges,
      })
      .from(employees)
      .orderBy(desc(employees.points));

    return records.map((record) => ({
      id: record.id,
      name: record.name,
      points: record.points,
      streak: record.streakDays,
      level: record.level,
      badges: record.badges || [],
      isCurrentUser: record.clerkUserId === userId,
    }));
  } catch (error) {
    console.error('Failed to fetch leaderboard data:', error);
    return [];
  }
}
