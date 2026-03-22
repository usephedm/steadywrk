import { getUpcomingInterviews } from '@/app/actions/interviews';
import { InterviewsClient } from './client';

export default async function InterviewsPage() {
  const interviews = await getUpcomingInterviews();

  return <InterviewsClient initialInterviews={interviews} />;
}
