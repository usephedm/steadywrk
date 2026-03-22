'use client';

import {
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  Play,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

const QUICK_ACTIONS = [
  { label: 'Start Shift', icon: Play, href: '/dashboard/tools', color: 'bg-[#E58A0F]' },
  {
    label: 'View Training',
    icon: GraduationCap,
    href: '/dashboard/training',
    color: 'bg-[#0F6B6F]',
  },
  { label: 'Check Schedule', icon: Calendar, href: '/dashboard/tools', color: 'bg-[#4D7A3A]' },
  { label: 'Leaderboard', icon: Trophy, href: '/dashboard/leaderboard', color: 'bg-[#A03D4A]' },
] as const;

const RECENT_ACTIVITY = [
  { text: 'Completed "Welcome Ritual" module', time: '2 hours ago', icon: CheckCircle2 },
  { text: 'Earned 50 points for first task', time: '4 hours ago', icon: Star },
  { text: 'Joined the March 2026 cohort', time: '1 day ago', icon: Zap },
  { text: 'Set up workspace and tools', time: '1 day ago', icon: CheckCircle2 },
  { text: 'Completed orientation video', time: '2 days ago', icon: GraduationCap },
] as const;

export default function DashboardPage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-dvh bg-[#FAFAF8]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome header */}
        <div className="mb-10">
          <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold text-[#23211D] tracking-tight">
            {greeting}, Team Member
          </h1>
          <p className="text-[#6B6B66] mt-2 text-sm">
            Here&apos;s your daily overview. Keep the streak going!
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Tasks Completed" value="12" icon={CheckCircle2} accent="#E58A0F" />
          <StatCard label="Streak Days" value="12" icon={Flame} accent="#A03D4A" />
          <StatCard label="Points Earned" value="1,950" icon={Star} accent="#E58A0F" />
          <StatCard label="Level" value="Contributor" icon={Trophy} accent="#0F6B6F" />
        </div>

        {/* Onboarding progress */}
        <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-[var(--font-display)] text-lg font-bold text-[#23211D]">
              30-Day Onboarding
            </h2>
            <span className="text-sm font-medium text-[#E58A0F]">40% complete</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#F5F5F3] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: '40%',
                background: 'linear-gradient(90deg, #E58A0F, #F5C563)',
              }}
            />
          </div>
          <p className="text-[#6B6B66] text-xs mt-2">
            Week 2 of 4 — First Contact phase. Keep building momentum!
          </p>
        </div>

        {/* Quick actions + Activity feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick actions */}
          <div>
            <h2 className="font-[var(--font-display)] text-lg font-bold text-[#23211D] mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="group flex flex-col items-center gap-3 rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-[180ms] ease-out hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] min-h-[44px]"
                  >
                    <div
                      className={`${action.color} p-3 rounded-xl text-white transition-transform duration-200 group-hover:scale-105`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium text-[#23211D]">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent activity feed */}
          <div>
            <h2 className="font-[var(--font-display)] text-lg font-bold text-[#23211D] mb-4">
              Recent Activity
            </h2>
            <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] divide-y divide-[#E5E5E2]">
              {RECENT_ACTIVITY.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.text} className="flex items-start gap-3 p-4">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-[#FFF4E6]">
                      <Icon className="h-4 w-4 text-[#E58A0F]" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#23211D]">{activity.text}</p>
                      <p className="text-xs text-[#B0B0AB] mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; color?: string }>;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-[180ms] ease-out hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${accent}15` }}>
          <Icon className="h-5 w-5" strokeWidth={1.5} color={accent} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#23211D] tracking-tight">{value}</p>
      <p className="text-xs text-[#6B6B66] mt-1">{label}</p>
    </div>
  );
}
