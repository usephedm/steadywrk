import DashboardShell from '@/components/dashboard/dashboard-shell';
import { requireDashboardEmployee } from '@/lib/auth/dashboard-access';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { canAccessAdmin } = await requireDashboardEmployee();

  return <DashboardShell canAccessAdmin={canAccessAdmin}>{children}</DashboardShell>;
}
