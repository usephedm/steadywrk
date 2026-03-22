import { db, schema } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

function hasEmployeeAdminRole(role: string | null | undefined): boolean {
  if (!role) return false;

  const normalizedRole = role.trim().toLowerCase();
  return ['admin', 'founder', 'owner'].includes(normalizedRole);
}

export async function getDashboardAccess() {
  const user = await currentUser();

  if (!user || !db) {
    return { user, employee: null, canAccessAdmin: false } as const;
  }

  const [employee] = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.clerkUserId, user.id))
    .limit(1);

  const canAccessAdmin = !!employee && hasEmployeeAdminRole(employee.role);

  return { user, employee: employee ?? null, canAccessAdmin } as const;
}

export async function requireDashboardEmployee() {
  const access = await getDashboardAccess();

  if (!access.user || !access.employee) {
    notFound();
  }

  return access;
}

export async function requireDashboardAdmin() {
  const access = await requireDashboardEmployee();

  if (!access.canAccessAdmin) {
    notFound();
  }

  return access;
}
