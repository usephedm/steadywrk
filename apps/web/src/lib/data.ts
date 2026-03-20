// Company info
export const COMPANY = {
  name: 'SteadyWrk',
  legal: 'SteadyWrk LLC',
  parent: 'SteadyWrk',
  locations: ['United States', 'Jordan'],
  founded: 2026,
  tagline: 'Apply. Train. Work. Steady.',
  email: 'hello@steadywrk.app',
};

// Services
export const SERVICES = [
  {
    id: 'ai-lab',
    title: 'AI Lab & Studio',
    icon: 'Brain',
    description:
      'Research, development, and deployment of AI agent systems. From custom LLM integrations to autonomous workflows — we build the intelligence layer that powers modern operations.',
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

// Hub cards
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

// Job positions
export const POSITIONS = [
  {
    id: 'fe-dev',
    title: 'Frontend Developer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote / Jordan',
    description:
      "Build performant, accessible web interfaces using Next.js, React, and TypeScript. You'll work on our public-facing platforms and internal tooling.",
  },
  {
    id: 'ai-eng',
    title: 'AI Engineer',
    department: 'AI Lab',
    type: 'Full-time',
    location: 'Remote / Jordan',
    description:
      'Design and implement AI agent systems, LLM integrations, and autonomous workflows. Experience with prompt engineering, RAG, and tool-use patterns required.',
  },
  {
    id: 'dm-spec',
    title: 'Digital Marketing Specialist',
    department: 'Marketing',
    type: 'Full-time',
    location: 'Jordan',
    description:
      'Plan and execute digital marketing campaigns across paid and organic channels. Strong analytical skills and experience with SEO, SEM, and social media required.',
  },
  {
    id: 'fm-coord',
    title: 'Facility Management Coordinator',
    department: 'Operations',
    type: 'Full-time',
    location: 'Jordan / US',
    description:
      'Coordinate field service operations, manage subcontractor relationships, and ensure service delivery standards across commercial properties.',
  },
  {
    id: 'bpo-agent',
    title: 'AI BPO Agent',
    department: 'BPO',
    type: 'Contract',
    location: 'Remote',
    description:
      'Handle customer interactions and business processes using AI-enhanced tooling. Training provided. Strong communication skills and attention to detail required.',
  },
] as const;

// Blog posts
export const BLOG_POSTS = [
  {
    slug: 'hello-world',
    title: 'SteadyWrk Has Landed in Jordan',
    date: '2026-03-21',
    excerpt:
      "We're a US company that just opened our Jordan office. Here's what we're building and why Amman is the right place to do it.",
    content:
      "SteadyWrk is officially operational in Jordan. We're a US-based company building a multi-vertical platform that spans AI development, facility management, digital marketing, and AI-powered BPO services.\n\nJordan offers a unique combination: a highly educated workforce, strategic timezone positioning between US and Asian markets, and a growing tech ecosystem. We're here to build, hire, and deliver.\n\nOur first wave of hiring is open. If you're a developer, marketer, operations coordinator, or AI enthusiast — we want to hear from you.",
  },
  {
    slug: 'ai-bpo',
    title: 'The Future of AI-Powered BPO',
    date: '2026-03-18',
    excerpt:
      "Business process outsourcing is being transformed by AI. Here's how we're combining human judgment with machine efficiency.",
    content:
      "Traditional BPO is a volume game — more agents, more hours, more seats. AI BPO flips this model. Instead of scaling headcount, you scale intelligence.\n\nAt SteadyWrk, our BPO agents work alongside AI systems that handle document processing, data extraction, and routine customer inquiries. The human agent focuses on judgment calls, escalations, and relationship management.\n\nThe result: higher quality output, faster turnaround, and lower cost per transaction. We're not replacing people — we're giving them superpowers.",
  },
] as const;

// Roadmap milestones
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

// Department list for filters
export const DEPARTMENTS = [
  'All',
  'Engineering',
  'AI Lab',
  'Marketing',
  'Operations',
  'BPO',
] as const;
