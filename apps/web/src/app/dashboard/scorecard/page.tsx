import { getAssessment } from '@/app/actions/dashboard';
import { ScorecardClient } from './client';

export default async function ScorecardPage() {
  const assessment = await getAssessment();

  return <ScorecardClient assessment={assessment} />;
}
