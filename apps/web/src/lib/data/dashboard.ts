/**
 * Dashboard seed data — used for UI layout until Supabase integration is complete.
 * TODO(STE-DB): Replace all exports with Supabase queries via server actions.
 * These are structural placeholders for the authenticated dashboard experience.
 */

export type CandidateStatus =
  | 'applied'
  | 'screening'
  | 'assessment'
  | 'interview'
  | 'offer'
  | 'rejected';

export type EmployeeLevel = 'Explorer' | 'Contributor' | 'Builder' | 'Leader';

export const ROADMAP = [
  {
    quarter: 'Q1 2026',
    title: 'Launch',
    items: ['Platform live', 'First hires in Jordan', 'Core services operational'],
  },
  {
    quarter: 'Q2 2026',
    title: 'Scale',
    items: [
      'AI Lab first projects delivered',
      'BPO team fully onboarded',
      'Client acquisition pipeline active',
    ],
  },
  {
    quarter: 'Q3 2026',
    title: 'Expand',
    items: [
      'US operations active',
      'Facility management contracts signed',
      'Marketing client portfolio growing',
    ],
  },
  {
    quarter: 'Q4 2026',
    title: 'Steady',
    items: [
      'Full service delivery across all verticals',
      'MCP platform layer launched',
      'Series readiness',
    ],
  },
] as const;

export const HUB_CARDS = [
  {
    title: 'Steady...W-hat?',
    subtitle: '1.0 Roadmap 2026',
    href: '/dashboard/roadmap',
    icon: 'Map',
    colors: [[245, 158, 11]] as number[][],
  },
  {
    title: 'Yes, We are hiring',
    subtitle: 'Join the team',
    href: '/dashboard/hiring',
    icon: 'Users',
    colors: [
      [245, 158, 11],
      [255, 200, 50],
    ] as number[][],
  },
  {
    title: 'Blog',
    subtitle: 'Thoughts & updates',
    href: '/dashboard/blog',
    icon: 'Newspaper',
    colors: [[200, 130, 10]] as number[][],
  },
  {
    title: 'Our Services',
    subtitle: 'What we build',
    href: '/dashboard/services',
    icon: 'Layers',
    colors: [
      [245, 158, 11],
      [220, 100, 10],
    ] as number[][],
  },
  {
    title: 'Get in Touch',
    subtitle: 'Business inquiries',
    href: '/contact',
    icon: 'Mail',
    colors: [
      [180, 150, 80],
      [245, 158, 11],
    ] as number[][],
  },
] as const;
