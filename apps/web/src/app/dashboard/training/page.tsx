import { TrainingQuest, type TrainingSnapshot } from '@/components/dashboard/training-quest';
import { requireDashboardEmployee } from '@/lib/auth/dashboard-access';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(value);
}

function buildTrainingSnapshot(
  employee: Awaited<ReturnType<typeof requireDashboardEmployee>>['employee'],
) {
  const now = Date.now();
  const startMs = employee.startDate.getTime();
  const daysSinceStart = clamp(Math.floor((now - startMs) / (1000 * 60 * 60 * 24)) + 1, 1, 30);
  const currentWeek = clamp(Math.floor((daysSinceStart - 1) / 7) + 1, 1, 4);
  const overallPercent = clamp(Math.round((daysSinceStart / 30) * 100), 0, 100);

  return {
    name: employee.name,
    role: employee.role,
    department: employee.department,
    level: employee.level,
    points: employee.points,
    streakDays: employee.streakDays,
    badges: employee.badges ?? [],
    startDate: formatDate(employee.startDate),
    currentWeek,
    overallPercent,
    daysSinceStart,
  } satisfies TrainingSnapshot;
}

export default async function TrainingPage() {
  const { employee } = await requireDashboardEmployee();
  const snapshot = buildTrainingSnapshot(employee);

  return <TrainingQuest snapshot={snapshot} />;
}
