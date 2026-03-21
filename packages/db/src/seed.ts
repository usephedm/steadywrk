import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { jobListings } from './schema';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

const jobs = [
  {
    title: 'Operations Dispatcher',
    slug: 'operations-dispatcher',
    department: 'Operations',
    type: 'full-time' as const,
    location: 'Amman',
    salaryRange: '400–700 JOD',
    description:
      "Coordinate field service operations, manage dispatch workflows, and ensure service delivery across commercial properties. You'll be the nerve center of our facility management vertical.",
    requirements: [
      'Strong organizational and communication skills',
      'Ability to manage multiple priorities under pressure',
      'Fluency in English and Arabic',
      'Experience with scheduling or dispatch systems preferred',
    ],
    featured: true,
    status: 'open' as const,
  },
  {
    title: 'AI Engineer',
    slug: 'ai-engineer',
    department: 'AI Lab',
    type: 'full-time' as const,
    location: 'Amman / Remote',
    salaryRange: '800–1,500 JOD',
    description:
      "Design and implement AI agent systems, LLM integrations, and autonomous workflows. You'll build the intelligence layer that powers our operations across all four verticals.",
    requirements: [
      'Experience with LLMs, prompt engineering, and RAG architectures',
      'Proficiency in Python and/or TypeScript',
      'Understanding of AI agent frameworks and tool-use patterns',
      'Strong problem-solving and system design skills',
    ],
    featured: false,
    status: 'open' as const,
  },
  {
    title: 'Frontend Developer',
    slug: 'frontend-developer',
    department: 'Engineering',
    type: 'full-time' as const,
    location: 'Amman / Remote',
    salaryRange: '700–1,200 JOD',
    description:
      "Build performant, accessible web interfaces using Next.js, React, and TypeScript. You'll work on our public-facing platforms, internal tooling, and AI-powered dashboards.",
    requirements: [
      'Strong experience with React, Next.js, and TypeScript',
      'Eye for design and attention to UI/UX detail',
      'Understanding of web performance and accessibility',
      'Experience with Tailwind CSS and Framer Motion preferred',
    ],
    featured: false,
    status: 'open' as const,
  },
  {
    title: 'Digital Marketing Lead',
    slug: 'digital-marketing-lead',
    department: 'Growth',
    type: 'full-time' as const,
    location: 'Amman',
    salaryRange: '600–1,000 JOD',
    description:
      "Plan and execute digital marketing campaigns across paid and organic channels. You'll drive brand awareness, candidate acquisition, and client growth through data-driven strategies.",
    requirements: [
      'Experience with SEO, SEM, and social media marketing',
      'Strong analytical skills and data-driven mindset',
      'Content creation and copywriting ability',
      'Experience with marketing automation tools',
    ],
    featured: false,
    status: 'open' as const,
  },
  {
    title: 'AI BPO Agent',
    slug: 'ai-bpo-agent',
    department: 'BPO',
    type: 'full-time' as const,
    location: 'Amman',
    salaryRange: '350–500 JOD',
    description:
      "Handle customer interactions and business processes using AI-enhanced tooling. Training provided. You'll work with cutting-edge AI systems to deliver exceptional service.",
    requirements: [
      'Excellent communication skills in English',
      'Attention to detail and process orientation',
      'Comfort with technology and learning new tools',
      'Customer service or BPO experience preferred',
    ],
    featured: false,
    status: 'open' as const,
  },
];

async function seed() {
  console.log('Seeding job listings...');

  for (const job of jobs) {
    await db
      .insert(jobListings)
      .values(job)
      .onConflictDoNothing({ target: jobListings.slug });
    console.log(`  ✓ ${job.title}`);
  }

  console.log('Done! Seeded', jobs.length, 'job listings.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
