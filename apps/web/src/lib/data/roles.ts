export const ROLES = [
  {
    title: 'Operations Dispatcher',
    slug: 'operations-dispatcher',
    dept: 'Operations',
    type: 'Full-time',
    location: 'Amman',
    salary: '400\u2013700 JOD',
    featured: true,
    description:
      'Coordinate field service operations, manage dispatch workflows, and ensure service delivery across commercial properties. You\u2019ll be the nerve center of our facility management vertical.',
    requirements: [
      'Strong organizational and communication skills',
      'Ability to manage multiple priorities under pressure',
      'Fluency in English and Arabic',
      'Experience with scheduling or dispatch systems preferred',
    ],
  },
  {
    title: 'AI Engineer',
    slug: 'ai-engineer',
    dept: 'AI Lab',
    type: 'Full-time',
    location: 'Amman / Remote',
    salary: '800\u20131,500 JOD',
    featured: false,
    description:
      'Design and implement AI agent systems, LLM integrations, and autonomous workflows. You\u2019ll build the intelligence layer that powers our operations across all four verticals.',
    requirements: [
      'Experience with LLMs, prompt engineering, and RAG architectures',
      'Proficiency in Python and/or TypeScript',
      'Understanding of AI agent frameworks and tool-use patterns',
      'Strong problem-solving and system design skills',
    ],
  },
  {
    title: 'Frontend Developer',
    slug: 'frontend-developer',
    dept: 'Engineering',
    type: 'Full-time',
    location: 'Amman / Remote',
    salary: '700\u20131,200 JOD',
    featured: false,
    description:
      'Build performant, accessible web interfaces using Next.js, React, and TypeScript. You\u2019ll work on our public-facing platforms, internal tooling, and AI-powered dashboards.',
    requirements: [
      'Strong experience with React, Next.js, and TypeScript',
      'Eye for design and attention to UI/UX detail',
      'Understanding of web performance and accessibility',
      'Experience with Tailwind CSS and Framer Motion preferred',
    ],
  },
  {
    title: 'Digital Marketing Lead',
    slug: 'digital-marketing-lead',
    dept: 'Growth',
    type: 'Full-time',
    location: 'Amman',
    salary: '600\u20131,000 JOD',
    featured: false,
    description:
      'Plan and execute digital marketing campaigns across paid and organic channels. You\u2019ll drive brand awareness, candidate acquisition, and client growth through data-driven strategies.',
    requirements: [
      'Experience with SEO, SEM, and social media marketing',
      'Strong analytical skills and data-driven mindset',
      'Content creation and copywriting ability',
      'Experience with marketing automation tools',
    ],
  },
  {
    title: 'AI BPO Agent',
    slug: 'ai-bpo-agent',
    dept: 'BPO',
    type: 'Full-time',
    location: 'Amman',
    salary: '350\u2013500 JOD',
    featured: false,
    description:
      'Handle customer interactions and business processes using AI-enhanced tooling. Training provided. You\u2019ll work with cutting-edge AI systems to deliver exceptional service.',
    requirements: [
      'Excellent communication skills in English',
      'Attention to detail and process orientation',
      'Comfort with technology and learning new tools',
      'Customer service or BPO experience preferred',
    ],
  },
] as const;

export const DEPARTMENTS = ['All', 'Engineering', 'AI Lab', 'Growth', 'Operations', 'BPO'] as const;
