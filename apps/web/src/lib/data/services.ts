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

export const TECH = [
  'Next.js 16',
  'React 19',
  'TypeScript',
  'Tailwind v4',
  'Supabase',
  'Railway',
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
