'use server';

import { auth } from '@clerk/nextjs/server';

export async function getReferralStats() {
  const { userId } = await auth();

  if (!userId) {
    return {
      totalReferrals: 0,
      successfulHires: 0,
      bountyEarned: 0,
      vouchCode: null,
    };
  }

  // Currently mapping the Clerk User ID to the DB applicant
  // In a full implementation, you'd find the Applicant ID based on the Clerk email

  return {
    totalReferrals: 0,
    successfulHires: 0,
    bountyEarned: 0,
    vouchCode: `VOUCH-${userId.substring(0, 6).toUpperCase()}`,
  };
}

export async function getAssessment() {
  const { userId } = await auth();

  if (!userId) {
    return {
      applicantId: null,
      score: 0,
      role: 'Applicant',
      percentile: 'Top 50%',
    };
  }

  return {
    applicantId: userId, // Using Clerk ID for now
    score: 92,
    role: 'AI Engineer',
    percentile: 'Top 1%',
  };
}
