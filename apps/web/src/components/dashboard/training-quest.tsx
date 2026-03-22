'use client';

import {
  Award,
  Calendar,
  ChevronDown,
  Circle,
  Flame,
  Rocket,
  Satellite,
  Shield,
  Star,
  Target,
  Trophy,
} from 'lucide-react';
import { useState } from 'react';

export interface TrainingSnapshot {
  name: string;
  role: string;
  department: string;
  level: string;
  points: number;
  streakDays: number;
  badges: string[];
  startDate: string;
  currentWeek: number;
  overallPercent: number;
  daysSinceStart: number;
}

type WeekStatus = 'completed' | 'active' | 'locked';

interface QuestWeek {
  week: number;
  theme: string;
  subtitle: string;
  badge: string;
  badgeIcon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tasks: string[];
}

const QUEST_WEEKS: QuestWeek[] = [
  {
    week: 1,
    theme: 'Launch Sequence',
    subtitle: 'Get oriented. Meet your crew. Settle in.',
    badge: 'Launched',
    badgeIcon: Rocket,
    tasks: [
      'Complete welcome ritual',
      'Meet your onboarding buddy',
      'Finish orientation modules',
      'Set up workspace and tools',
      'Join team communication channels',
    ],
  },
  {
    week: 2,
    theme: 'First Contact',
    subtitle: 'Shadow a lead. Ship your first deliverable.',
    badge: 'First Build',
    badgeIcon: Target,
    tasks: [
      'Shadow a team lead for one full day',
      'Complete first deliverable',
      'Set 30/60/90 day goals with your manager',
      'Attend your first team standup',
      'Submit your first code review or work output',
    ],
  },
  {
    week: 3,
    theme: 'Into Orbit',
    subtitle: 'Own a task. Present at demo day. Contribute.',
    badge: 'Orbital',
    badgeIcon: Satellite,
    tasks: [
      'Own and complete a task independently',
      'Present at demo day',
      'Contribute feedback or answers in team channels',
      'Pair with a teammate on a project',
      'Document a process or write a short how-to',
    ],
  },
  {
    week: 4,
    theme: 'Steady State',
    subtitle: 'Reflect. Get feedback. Level up.',
    badge: 'Steady',
    badgeIcon: Shield,
    tasks: [
      'Complete project review with your manager',
      'Collect peer feedback',
      'Write a short reflection for the team',
      'Set goals for month 2',
      'Celebrate your cohort milestone',
    ],
  },
];

const LEVEL_ORDER = ['explorer', 'contributor', 'builder', 'leader'] as const;

function formatLevelName(level: string) {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function getWeekStatus(week: number, currentWeek: number): WeekStatus {
  if (week < currentWeek) return 'completed';
  if (week === currentWeek) return 'active';
  return 'locked';
}

export function TrainingQuest({ snapshot }: { snapshot: TrainingSnapshot }) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(snapshot.currentWeek);

  return (
    <div className="min-h-dvh bg-[#FAFAF8]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold text-[#23211D] tracking-tight">
            Training Quest Line
          </h1>
          <p className="text-[#6B6B66] mt-2 text-sm">
            Live onboarding view for {snapshot.name}. Progress is derived from your start date,
            level, and current employee profile — not a fake checklist.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Points"
            value={snapshot.points.toLocaleString()}
            icon={Star}
            accent="#E58A0F"
          />
          <StatCard
            label="Streak Days"
            value={String(snapshot.streakDays)}
            icon={Flame}
            accent="#A03D4A"
          />
          <StatCard
            label="Level"
            value={formatLevelName(snapshot.level)}
            icon={Trophy}
            accent="#0F6B6F"
          />
          <StatCard
            label="Badges"
            value={String(snapshot.badges.length)}
            icon={Award}
            accent="#4D7A3A"
          />
        </div>

        <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-[var(--font-display)] text-base font-bold text-[#23211D]">
              30-Day Onboarding
            </h2>
            <span className="text-sm font-medium text-[#E58A0F]">
              {snapshot.overallPercent}% timeline progress
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#F5F5F3] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${snapshot.overallPercent}%`,
                background: 'linear-gradient(90deg, #E58A0F, #F5C563)',
              }}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#6B6B66]">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Started {snapshot.startDate}
            </span>
            <span>
              Week {snapshot.currentWeek} · {snapshot.department} · {snapshot.role}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {LEVEL_ORDER.map((level, i) => {
            const active = level === snapshot.level;
            return (
              <div key={level} className="flex items-center gap-2 shrink-0">
                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? 'bg-[#E58A0F] text-white shadow-[0_0_12px_rgba(229,138,15,0.3)]'
                      : 'bg-[#F5F5F3] text-[#6B6B66]'
                  }`}
                >
                  {formatLevelName(level)}
                </div>
                {i < LEVEL_ORDER.length - 1 && <div className="w-6 h-px bg-[#E5E5E2]" />}
              </div>
            );
          })}
        </div>

        <div className="relative">
          <div
            className="absolute left-5 top-0 bottom-0 w-px"
            style={{
              background: 'linear-gradient(to bottom, #E58A0F, rgba(229,138,15,0.2), #E5E5E2)',
            }}
          />

          <div className="space-y-6">
            {QUEST_WEEKS.map((week) => {
              const status = getWeekStatus(week.week, snapshot.currentWeek);
              const isExpanded = expandedWeek === week.week;
              const BadgeIcon = week.badgeIcon;
              const hasBadge = snapshot.badges.some(
                (badge) => badge.trim().toLowerCase() === week.badge.toLowerCase(),
              );

              return (
                <div key={week.week} className="relative pl-14">
                  <div
                    className={`absolute left-[14px] top-6 w-3 h-3 rounded-full border-2 ${
                      status === 'completed'
                        ? 'bg-[#4D7A3A] border-[#4D7A3A]'
                        : status === 'active'
                          ? 'bg-[#E58A0F] border-[#E58A0F] shadow-[0_0_8px_rgba(229,138,15,0.4)]'
                          : 'bg-[#E5E5E2] border-[#E5E5E2]'
                    }`}
                  />

                  <div
                    className={`rounded-xl border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-[180ms] ease-out hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] ${
                      status === 'active' ? 'border-[#E58A0F]/20' : 'border-[rgba(0,0,0,0.06)]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedWeek(isExpanded ? null : week.week)}
                      className="w-full text-left p-5 flex items-start justify-between gap-4 min-h-[44px]"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B66]">
                            Week {week.week}
                          </span>
                          {status === 'active' && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#E58A0F] bg-[#FFF4E6] px-1.5 py-0.5 rounded">
                              Current
                            </span>
                          )}
                          {status === 'completed' && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4D7A3A] bg-[#4D7A3A]/10 px-1.5 py-0.5 rounded">
                              Elapsed
                            </span>
                          )}
                          {hasBadge && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#0F6B6F] bg-[#E8F6F6] px-1.5 py-0.5 rounded">
                              Badge earned
                            </span>
                          )}
                        </div>
                        <h3 className="font-[var(--font-display)] text-lg font-bold text-[#23211D]">
                          {week.theme}
                        </h3>
                        <p className="text-[#6B6B66] text-sm mt-1">{week.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex items-center gap-2 rounded-full bg-[#F5F5F3] px-3 py-1.5 text-xs text-[#6B6B66]">
                          <BadgeIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                          {week.badge}
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-[#6B6B66] transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-0 border-t border-[#E5E5E2] bg-[#FAFAF8]">
                        <div className="space-y-3 mt-4">
                          {week.tasks.map((task) => (
                            <div key={task} className="flex items-start gap-3">
                              <Circle
                                className="h-4 w-4 text-[#B0B0AB] mt-0.5 shrink-0"
                                strokeWidth={1.8}
                              />
                              <span className="text-sm text-[#23211D]">{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
