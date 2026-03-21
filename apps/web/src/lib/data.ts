export const COMPANY = {
  name: 'STEADYWRK',
  legal: 'STEADYWRK LLC',
  locations: ['United States', 'Jordan'],
  founded: 2026,
  tagline: 'Where ambition compounds.',
  email: 'hello@steadywrk.app',
  address: 'Building 15, King Hussein Business Park, Amman, Jordan',
  url: 'https://steadywrk.app',
} as const;

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

export const PROGRAMS = [
  {
    name: 'IGNITE',
    slug: 'ignite',
    type: 'Internship',
    duration: '3 months',
    desc: 'Ship production work from week one. Real AI projects, real deadlines, real mentorship.',
    longDesc:
      'IGNITE is our internship program for ambitious students and recent graduates. You\u2019ll be embedded in a real team, working on production systems that serve US clients. No coffee runs. No busywork. You ship code, run campaigns, or manage operations from day one.',
    outcomes: [
      'Production-deployed projects for your portfolio',
      'Mentorship from senior engineers and leaders',
      'Potential conversion to full-time ORBIT fellowship',
      'Network of peers in Jordan\u2019s AI ecosystem',
    ],
  },
  {
    name: 'ORBIT',
    slug: 'orbit',
    type: 'Fellowship',
    duration: '6 months',
    desc: 'Lead projects. Mentor juniors. Build the systems that power our operations.',
    longDesc:
      'ORBIT is a fellowship for early-career professionals ready to accelerate. You\u2019ll lead projects, mentor IGNITE interns, and build systems across our four verticals. This is the bridge between individual contributor and team lead.',
    outcomes: [
      'Project leadership experience across verticals',
      'Mentorship skills and team management exposure',
      'Clear path to APEX leadership track',
      'Shipped work serving Fortune 500 clients',
    ],
  },
  {
    name: 'APEX',
    slug: 'apex',
    type: 'Leadership',
    duration: '12 months',
    desc: 'Architect solutions. Drive teams. Shape the company\u2019s technical direction.',
    longDesc:
      'APEX is our leadership accelerator for experienced professionals. You\u2019ll architect solutions, drive cross-functional teams, and shape STEADYWRK\u2019s technical direction. This track produces the leaders who scale the company.',
    outcomes: [
      'C-suite and board exposure',
      'Cross-functional leadership experience',
      'Equity participation opportunity',
      'Industry recognition and speaking opportunities',
    ],
  },
] as const;

export const SERVICES = [
  {
    id: 'ai-lab',
    title: 'AI Lab & Studio',
    icon: 'Brain',
    description:
      'Research, development, and deployment of AI agent systems. From custom LLM integrations to autonomous workflows \u2014 we build the intelligence layer that powers modern operations.',
    features: [
      'Custom AI agent development',
      'LLM integration & fine-tuning',
      'Autonomous workflow design',
      'MCP server architecture',
    ],
  },
  {
    id: 'facility',
    title: 'Facility Management',
    icon: 'Building2',
    description:
      'End-to-end field service operations. Dispatch coordination, subcontractor management, and maintenance execution across commercial and residential properties.',
    features: [
      'Dispatch coordination',
      'Preventive maintenance programs',
      'Vendor management',
      '24/7 emergency response',
    ],
  },
  {
    id: 'marketing',
    title: 'Digital Marketing',
    icon: 'Megaphone',
    description:
      'Data-driven campaigns, SEO, content strategy, and brand development. We combine AI tooling with human creativity to deliver measurable growth.',
    features: [
      'SEO & content strategy',
      'Paid media management',
      'Brand development',
      'Analytics & reporting',
    ],
  },
  {
    id: 'bpo',
    title: 'AI BPO',
    icon: 'Bot',
    description:
      'AI-powered business process outsourcing. Customer support, data processing, document handling, and back-office operations enhanced by intelligent automation.',
    features: [
      'AI-enhanced customer support',
      'Document processing & extraction',
      'Data entry & validation',
      'Back-office automation',
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
    href: '/dashboard/contact',
    icon: 'Mail',
    colors: [
      [180, 150, 80],
      [245, 158, 11],
    ] as number[][],
  },
] as const;

export const BLOG_POSTS = [
  {
    slug: 'hello-world',
    title: 'STEADYWRK Has Landed in Jordan',
    date: '2026-03-21',
    excerpt:
      'We\u2019re a US company that just opened our Jordan office. Here\u2019s what we\u2019re building and why Amman is the right place to do it.',
    content:
      'STEADYWRK is officially operational in Jordan. We\u2019re a US-based company building a multi-vertical platform that spans AI development, facility management, digital marketing, and AI-powered BPO services.\n\nJordan offers a unique combination: a highly educated workforce, strategic timezone positioning between US and Asian markets, and a growing tech ecosystem. We\u2019re here to build, hire, and deliver.\n\nOur first wave of hiring is open. If you\u2019re a developer, marketer, operations coordinator, or AI enthusiast \u2014 we want to hear from you.',
  },
  {
    slug: 'ai-bpo',
    title: 'The Future of AI-Powered BPO',
    date: '2026-03-18',
    excerpt:
      'Business process outsourcing is being transformed by AI. Here\u2019s how we\u2019re combining human judgment with machine efficiency.',
    content:
      'Traditional BPO is a volume game \u2014 more agents, more hours, more seats. AI BPO flips this model. Instead of scaling headcount, you scale intelligence.\n\nAt STEADYWRK, our BPO agents work alongside AI systems that handle document processing, data extraction, and routine customer inquiries. The human agent focuses on judgment calls, escalations, and relationship management.\n\nThe result: higher quality output, faster turnaround, and lower cost per transaction. We\u2019re not replacing people \u2014 we\u2019re giving them superpowers.',
  },
] as const;

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

export const DEPARTMENTS = ['All', 'Engineering', 'AI Lab', 'Growth', 'Operations', 'BPO'] as const;

export const TECH = [
  'Next.js 16',
  'React 19',
  'TypeScript',
  'Tailwind v4',
  'Neon Postgres',
  'Vercel',
  'Cloudflare Workers',
  'Claude API',
  'OpenAI',
  'Drizzle ORM',
  'PostHog',
  'Resend',
  'Cal.com',
  'Clerk Auth',
  'Framer Motion',
] as const;
