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

export const BLOG_CATEGORIES = [
  'All',
  'AI Careers',
  'Women in Tech',
  'Growth Guides',
  'Behind the Build',
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_POSTS = [
  {
    slug: 'hello-world',
    title: 'STEADYWRK Has Landed in Jordan',
    date: '2026-03-21',
    category: 'Behind the Build' as BlogCategory,
    readTime: '4 min read',
    featured: true,
    excerpt:
      'We\u2019re a US company that just opened our Jordan office. Here\u2019s what we\u2019re building and why Amman is the right place to do it.',
    content:
      'STEADYWRK is officially operational in Jordan. We\u2019re a US-based company building a multi-vertical platform that spans AI development, facility management, digital marketing, and AI-powered BPO services.\n\nJordan offers a unique combination: a highly educated workforce, strategic timezone positioning between US and Asian markets, and a growing tech ecosystem. We\u2019re here to build, hire, and deliver.\n\nOur first wave of hiring is open. If you\u2019re a developer, marketer, operations coordinator, or AI enthusiast \u2014 we want to hear from you.',
  },
  {
    slug: 'ai-bpo',
    title: 'The Future of AI-Powered BPO',
    date: '2026-03-18',
    category: 'AI Careers' as BlogCategory,
    readTime: '5 min read',
    featured: false,
    excerpt:
      'Business process outsourcing is being transformed by AI. Here\u2019s how we\u2019re combining human judgment with machine efficiency.',
    content:
      'Traditional BPO is a volume game \u2014 more agents, more hours, more seats. AI BPO flips this model. Instead of scaling headcount, you scale intelligence.\n\nAt STEADYWRK, our BPO agents work alongside AI systems that handle document processing, data extraction, and routine customer inquiries. The human agent focuses on judgment calls, escalations, and relationship management.\n\nThe result: higher quality output, faster turnaround, and lower cost per transaction. We\u2019re not replacing people \u2014 we\u2019re giving them superpowers.',
  },
  {
    slug: 'how-we-hire-at-steadywrk',
    title: 'How We Hire at STEADYWRK: No Black Boxes, No Guessing Games',
    date: '2026-04-01',
    category: 'Behind the Build' as BlogCategory,
    readTime: '8 min read',
    featured: false,
    excerpt:
      'STEADYWRK\u2019s hiring process is built for human beings, not ATS filters. Here\u2019s exactly what to expect \u2014 every stage, every timeline, every decision point.',
    content:
      'Most hiring processes feel like sending your CV into a void. You apply, you wait, you hear nothing. At STEADYWRK, we think that\u2019s broken. Here\u2019s exactly how we hire \u2014 transparently, respectfully, and fast.\n\nWe hire on signal, not pedigree. There\u2019s no degree requirement and no GPA filter. We look for curiosity, craft, and commitment. We want people who want to build something meaningful, not people chasing job titles. When you apply, a real person reads your submission within 48 hours. That\u2019s not a goal \u2014 it\u2019s an SLA we hold ourselves to.\n\nOur process has five stages. Stage one is your application \u2014 six to eight minutes, no account required. Stage two is a portfolio or craft review, done asynchronously so you can show us work on your terms. Stage three is a real conversation with the hiring team \u2014 no quiz, no trick questions. Stage four is a paid trial project: compensated, scoped, and time-boxed. Stage five is the offer, built on a transparent compensation formula so there\u2019s no guessing.\n\nWhat we\u2019re actually looking for is not AI hype. We want people who can explain why a model works, debug when it doesn\u2019t, and communicate findings to a non-technical team. We actively recruit women into technical roles \u2014 over fifty percent of our pipeline is targeted at underrepresented candidates. If you\u2019ve been told "you\u2019re not ready yet" by other employers, bring that story to us. We respond within 48 hours, every time. Applications are open at steadywrk.app/careers.',
  },
  {
    slug: 'women-building-ai-jordan',
    title: 'Women Building AI in Jordan: 12 Voices You Should Know',
    date: '2026-04-08',
    category: 'Women in Tech' as BlogCategory,
    readTime: '12 min read',
    featured: false,
    excerpt:
      'Meet 12 women building AI products, research, and infrastructure from Amman \u2014 and what they say about working in tech in Jordan in 2026.',
    content:
      'Jordan\u2019s female youth unemployment rate stands at 66 percent \u2014 one of the highest in the world. Yet inside Jordan\u2019s technology sector, the story looks different. Women make up over 30 percent of the ICT workforce, and they\u2019re building some of the most consequential AI systems in the region. The stories of who\u2019s doing the work \u2014 and how \u2014 are rarely told. Until now.\n\nThe numbers paint a paradox. Jordan\u2019s female labor force participation rate sits at just 14 percent, with a government target of 28 percent by 2033. Structural barriers \u2014 childcare access, transportation infrastructure, cultural friction \u2014 keep millions of qualified women out of the formal workforce. Yet the tech sector is outperforming every other industry on female inclusion, driven by remote work flexibility, meritocratic hiring, and a pipeline of university graduates that is 40 to 50 percent women in ICT fields.\n\nThis article profiles twelve women building AI in Jordan: machine learning engineers at companies like Mawdoo3 and Estarta, data scientists at Jordanian fintechs, researchers at the University of Jordan, and members of STEADYWRK\u2019s own team. Their work spans Arabic NLP, computer vision, recommendation systems, and autonomous agents.\n\nWhat they share in common is this: each navigated a system that wasn\u2019t designed for them and built something remarkable anyway. Their insights on mentorship, salary negotiation, technical credibility, and career strategy offer a practical roadmap for the next generation of women entering Jordan\u2019s AI workforce. If you\u2019re a woman building AI in Jordan and want to be featured or connected with our network, apply at steadywrk.app.',
  },
  {
    slug: 'first-90-days-ai-company-jordan',
    title: 'Your First 90 Days at an AI Company: What No One Tells Jordanian Graduates',
    date: '2026-04-15',
    category: 'Growth Guides' as BlogCategory,
    readTime: '10 min read',
    featured: false,
    excerpt:
      'The first 90 days make or break a tech career. Here\u2019s a week-by-week playbook built for Jordanian graduates joining AI companies \u2014 locally or remotely.',
    content:
      'You got the offer. Now what? Most onboarding advice assumes you\u2019re joining a US company in a US city. Here\u2019s what actually applies when you\u2019re starting in Amman \u2014 or working remotely for an international team from Jordan.\n\nDays one through fourteen are about orientation and listening. Don\u2019t try to optimize anything yet. Observe how the team actually communicates \u2014 is it Slack, Notion, email, or some combination? Map who makes which decisions, because it\u2019s not always what the org chart says. Learn the product deeply before you touch the model. Most Jordanian graduates skip this step and go straight to writing code. That\u2019s a mistake.\n\nDays fifteen through thirty are about your first contribution. Find a small, high-visibility task and complete it end to end. Write your first internal document \u2014 even a short one establishes your presence. Ask for feedback explicitly. Many Jordanian workplaces don\u2019t give unsolicited feedback, so you need to create the habit early.\n\nDays thirty-one through sixty are about showing your mental model. Present a small experiment, even if it fails. Document your learnings publicly within the team. Start connecting with cross-functional stakeholders. If you\u2019re remote, over-communicate \u2014 visibility requires deliberate effort when no one can see you at your desk.\n\nDays sixty-one through ninety are about ownership. Propose one improvement to an existing process. Set three-month OKRs with your manager. Start building your external presence through LinkedIn posts, conference attendance, and the int@j community. STEADYWRK\u2019s 90-day onboarding track is built into every career-launch program. See what\u2019s included at steadywrk.app.',
  },
  {
    slug: 'ai-careers-guide-jordan-graduates-2026',
    title: 'AI Careers Guide for Jordanian Graduates \u2014 Every Role, Every Salary, Every Path (2026)',
    date: '2026-04-22',
    category: 'AI Careers' as BlogCategory,
    readTime: '15 min read',
    featured: false,
    excerpt:
      'The definitive AI career guide for graduates from Jordan\u2019s universities. Every role explained, salary ranges benchmarked, companies named.',
    content:
      'Seven thousand ICT graduates enter Jordan\u2019s job market every year. Most have strong technical foundations from universities like JUST, the University of Jordan, and Princess Sumaya University. Very few have a clear map of which AI roles are actually hiring, what they pay, and how to land one within six months of graduation. This guide exists to change that.\n\nThe AI role taxonomy in Jordan breaks down into six categories. Machine Learning Engineers build and deploy models \u2014 they\u2019re the most in-demand locally. Data Scientists focus on analysis, experimentation, and insight generation. AI and NLP Engineers are especially relevant given Jordan\u2019s strength in Arabic AI, with companies like Mawdoo3 and regional content platforms leading demand. Data Engineers build pipelines and infrastructure \u2014 often the gateway role for fresh graduates. AI Product Managers bridge business and technical functions and represent the fastest-growing role in Jordan\u2019s startup scene. AI Researchers are rarer but present at KHBP-based companies and university labs.\n\nSalary benchmarks tell the real story. A fresh graduate in an AI role can expect 300 to 700 JOD per month locally. Mid-level engineers with two to three years of experience earn 800 to 1,500 JOD. Senior roles with five-plus years command 1,500 to 3,000 JOD. International remote positions, however, often pay three to five times local rates in USD \u2014 making remote-first positioning a career-defining strategy.\n\nCompanies actively hiring AI talent in Jordan include Mawdoo3, Zain, Estarta, Orange Jordan, and Luminus locally, with Microsoft, Amazon, and regional AI startups offering remote opportunities. STEADYWRK offers a structured six-month career-launch program for AI graduates. Apply at steadywrk.app.',
  },
  {
    slug: 'jordan-ict-sector-graduate-employment-gap',
    title: 'Jordan\u2019s $3 Billion ICT Sector Is Growing Fast \u2014 So Why Can\u2019t Graduates Get Hired?',
    date: '2026-04-29',
    category: 'AI Careers' as BlogCategory,
    readTime: '11 min read',
    featured: false,
    excerpt:
      'Jordan\u2019s ICT market is growing at 16% CAGR toward $6.5B by 2031. Yet 41.72% of young people are unemployed. Here\u2019s the data behind the paradox.',
    content:
      'Jordan\u2019s tech sector is worth $3.11 billion and growing at nearly 16 percent per year. By 2031, it\u2019s projected to reach $6.52 billion. ICT employment has grown at a 19 percent compound annual rate over recent years. Yet youth unemployment sits at 41.72 percent, and 7,000 new ICT graduates enter the market annually without guaranteed pathways. This is the paradox at the heart of Jordan\u2019s technology economy.\n\nThe barriers are structural and interlinked. First, there\u2019s a skills mismatch: universities are training students on yesterday\u2019s stack while employers need engineers who can ship production AI systems today. Second, the "one year of experience" paradox means entry-level roles require experience, but meaningful internships remain rare. Third, brain drain is accelerating \u2014 an estimated 30 to 40 percent of Jordan\u2019s top tech talent emigrates for Gulf or Western salaries, deepening domestic shortages. Fourth, hiring in Jordan is heavily relationship-driven. Without network access, qualified candidates\u2019 applications simply disappear.\n\nThe government is responding. Jordan\u2019s AI Strategy 2023\u20132027 targets training 15,000 individuals, launching 50 new AI startups, and increasing AI research output by 30 percent. The Economic Modernization Vision aims to create one million new jobs and double female labor force participation. iPARK has enabled over $20 million in investment and 3,000 jobs. The ISSF fund puts $98 million behind startups and SMEs.\n\nBut policy alone won\u2019t close the gap. STEADYWRK exists because we\u2019re not waiting for the system to fix itself. We\u2019re building the bridge between Jordan\u2019s tech graduates and the employers who actually want them \u2014 with structured hiring, real projects, and a 14-day timeline from application to offer.',
  },
  {
    slug: 'remote-work-jordan-tech-professionals-guide',
    title: 'Working Remotely from Jordan for International Tech Companies: The 2026 Guide',
    date: '2026-05-06',
    category: 'Growth Guides' as BlogCategory,
    readTime: '9 min read',
    featured: false,
    excerpt:
      'Jordan\u2019s 95.6% internet penetration and 160 Mbps broadband make it one of the best remote-work bases in MENA. Here\u2019s how to find, land, and succeed in international remote tech roles from Amman.',
    content:
      'Jordan has 95.6 percent individual internet penetration, fixed broadband speeds exceeding 160 Mbps, 97.5 percent smartphone household ownership, and a highly educated bilingual Arabic-English workforce. It is arguably the best-positioned MENA country for international remote tech work. If you\u2019re a Jordanian engineer, data scientist, or technical professional, remote work isn\u2019t just an option \u2014 it\u2019s a career multiplier.\n\nThe infrastructure case is compelling. Amman offers multiple coworking spaces including WeWork at King Hussein Business Park, the ZAIN Accelerator, and Orange Digital Village. Jordan\u2019s UTC+3 timezone creates a strategic overlap: you cover European mornings and US East Coast afternoons, making you accessible to employers across two major markets simultaneously.\n\nThe roles most available remotely include software engineering, ML engineering, data science, technical writing, UX and UI design, DevOps and cloud infrastructure, and content AI. According to Robert Half\u2019s Q4 2025 data, 11 percent of US tech positions are fully remote and 24 percent are hybrid \u2014 and international remote hiring continues to expand.\n\nThe legal and tax reality matters. Jordan\u2019s income tax structure applies to locally-earned income. Working for a foreign company from Jordan is permitted, but structuring payment correctly is essential. Most remote Jordanian professionals use platforms like Deel or Wise for USD payments alongside a local bank account.\n\nThe salary jump is the key incentive. A typical Jordanian AI role pays around $14,000 per year locally. The same skills in an international remote role command two to five times that amount. STEADYWRK places graduates in international remote roles. Start your path at steadywrk.app.',
  },
  {
    slug: 'jordan-digital-economy-reach2025-ai-strategy',
    title: 'Jordan\u2019s Digital Economy at a Crossroads: From REACH2025 to the AI Strategy Era',
    date: '2026-05-13',
    category: 'AI Careers' as BlogCategory,
    readTime: '7 min read',
    featured: false,
    excerpt:
      'Jordan\u2019s REACH2025 plan set bold targets for the digital economy. Now, the National AI Strategy 2023\u20132027 carries the torch. Here\u2019s where Jordan stands.',
    content:
      'Jordan has been building toward a digital economy since 2000, when the original REACH Initiative laid the groundwork for what would become one of the Middle East\u2019s most ambitious technology strategies. Here\u2019s a concise history, the current state of play, and why the next three years represent the biggest window of opportunity for AI careers in Jordan.\n\nREACH2025 launched in 2016, building on 16 years of prior digital infrastructure investment. Its vision: "Jordan as a platform for digital innovation." Key targets included developing specialized ICT talent pipelines, digitizing healthcare, education, and finance, and establishing Jordan as a leader in Arabic digital content. The initiative was co-created by the Ministry of ICT, int@j, and the private sector with USAID support. Its principles have since been integrated into the broader Economic Modernization Vision 2023\u20132033.\n\nThe National AI Strategy 2023\u20132027 now carries the torch. It comprises 68 projects across five strategic objectives, with targets including training 15,000 individuals in AI skills, launching 50 new AI startups, and achieving a 30 percent increase in AI research output. Jordan is one of only 35 percent of countries globally to have both an AI strategy and an AI ethics charter \u2014 a distinction noted by Oxford Insights.\n\nFor your career, this means government contracts and procurement will increasingly require AI skills. iPARK, MoDEE, and ISSF are funding AI startups, creating a wave of new roles. Public sector AI deployments are generating demand for ML engineers, data analysts, and project managers with AI literacy. International companies are watching Jordan\u2019s strategy signals closely. STEADYWRK helps you position for these opportunities. Learn how at steadywrk.app.',
  },
  {
    slug: 'ai-salary-jordan-gulf-global-benchmark-2026',
    title: 'Jordan AI Salaries vs. the Gulf vs. Global Remote: The 2026 Benchmark Guide',
    date: '2026-05-20',
    category: 'Growth Guides' as BlogCategory,
    readTime: '13 min read',
    featured: false,
    excerpt:
      'A Jordanian ML engineer earns ~$14K/year locally. The same role at a US remote company pays $97\u2013155K. Here\u2019s the full salary benchmark \u2014 and a realistic path to closing the gap.',
    content:
      'Jordan produces 7,000 tech graduates a year. The best ones earn $14,000 locally. The same skills, in a remote role for a US or European company, are worth five to ten times more. Here\u2019s the data \u2014 and a realistic strategy for closing the gap.\n\nThe Jordan salary reality is sobering. According to Levels.fyi data for Amman, the median software engineer compensation is around 9,900 JOD per year, roughly $13,950. AI engineer averages sit at approximately $31,900 per year according to Jobicy. Fresh graduates in AI and ML roles typically earn 300 to 700 JOD per month. The highest local compensation, at companies like Careem, reaches around 50,414 JOD annually.\n\nThe Gulf benchmark explains the brain drain. UAE-based AI engineers earn $60,000 to $90,000 or more per year, tax-free. Saudi Arabia offers $50,000 to $80,000. The three-to-five-times salary uplift, combined with rapid economic development, makes the Gulf the default destination for ambitious Jordanian engineers.\n\nThe global remote benchmark reveals the real opportunity. A mid-level US AI engineer earns approximately $97,675 per year. Western European seniors command $80,000 to $106,900. Eastern European engineers \u2014 a comparable talent tier to Jordan \u2014 earn $52,650 to $75,900. The key insight: Jordan is significantly underpriced for its skill level relative to Eastern Europe.\n\nThe path to closing the gap has four steps. First, position yourself remote-first with an English-language portfolio, active GitHub, and optimized LinkedIn. Second, target EU and UK tech companies that value timezone overlap and diversity goals. Third, leverage Jordan\u2019s unique advantage in Arabic AI and NLP. Fourth, join platforms that bridge local talent to global employers. STEADYWRK connects Jordanian AI engineers with international employers. See opportunities at steadywrk.app.',
  },
  {
    slug: 'jordan-startup-ecosystem-ai-ipark-oasis500',
    title: 'Inside Jordan\u2019s Startup Ecosystem: iPARK, Oasis500, KHBP, and Where AI Is Growing',
    date: '2026-05-27',
    category: 'Behind the Build' as BlogCategory,
    readTime: '10 min read',
    featured: false,
    excerpt:
      'Jordan\u2019s startup ecosystem ranks 5th in the Middle East. Here\u2019s a complete map of incubators, accelerators, funding sources, and where the AI opportunities are in 2026.',
    content:
      'Jordan\u2019s startup ecosystem ranks fifth in the Middle East according to StartupBlink. It\u2019s been punching above its weight since Maktoob\u2019s $85 million Yahoo acquisition in 2009 signaled that world-class companies could be built from Amman. Here\u2019s the complete map of where AI opportunities are growing in 2026.\n\nThe institutional backbone is strong. iPARK, operated by the Royal Scientific Society, has incubated over 300 startups, enabled more than $20 million in investment, generated 3,000 jobs, and maintains 25 percent female founders. Oasis500 has backed 169 startups with a cumulative portfolio value of $200 million, writing checks from $30,000 to $350,000. King Hussein Business Park houses over 300 companies and 10,000 workers, with Phase 2 expansion projected to add 20,000 more jobs. The ISSF deploys a $98 million fund targeting startups and SMEs.\n\nAI growth is concentrated in five sectors. Arabic NLP remains Jordan\u2019s signature strength, led by Mawdoo3 and emerging companies in the Qalam.ai space. EdTech AI is thriving through platforms like Abwaab and Jo Academy. FinTech AI is expanding via the Arab Bank AB Accelerator and AHLI FINTECH programs. AgriFoodTech AI is emerging, with companies like HypoFarm in the 2025 EBRD cohort. Smart cities and government AI deployments are multiplying, with MoDEE piloting traffic management and targeting 25 public AI projects.\n\nGetting into this ecosystem requires deliberate action. Apply to iPARK\u2019s incubation program, which is free and equity-light. Attend the annual Jordan Startup Expo. Join the int@j tech community and the StartupsJo.com directory. Or apply through STEADYWRK\u2019s employer network, which operates inside this ecosystem. Find your role at steadywrk.app.',
  },
  {
    slug: 'building-steadywrk-why-amman-ai-career-platform',
    title: 'Why We Built STEADYWRK: An AI-Native Career Platform, Born in Amman, Built for the World',
    date: '2026-06-03',
    category: 'Behind the Build' as BlogCategory,
    readTime: '8 min read',
    featured: false,
    excerpt:
      '66% female youth unemployment. 7,000 tech graduates per year without a clear path. Jordan has the talent \u2014 what it needed was a platform. Here\u2019s why we built STEADYWRK in Amman.',
    content:
      'We built STEADYWRK in Amman because the problem is here. 66 percent of Jordanian women aged 15 to 24 are unemployed. Meanwhile, Jordan\u2019s ICT sector is growing at 16 percent per year toward $6.5 billion by 2031. The talent is real. The system is broken. We\u2019re fixing it.\n\nThe problem we saw is specific and measurable. Seven thousand ICT graduates enter Jordan\u2019s market each year, many without structured career pathways. Jordan\u2019s female labor force participation rate is 14 percent \u2014 the fourth lowest in the world. Over a third of university-educated Jordanian women are unemployed. The ICT sector actually leads on female inclusion at over 30 percent of its workforce, yet no one is building the pipeline deliberately.\n\nSTEADYWRK is not "AI-enhanced." It\u2019s AI-native, meaning AI is the operating logic, not a feature. We use AI-matched talent placement instead of keyword-filtered CV screening. Our skill assessments are AI-augmented. Career paths are AI-personalized. Our content and platform are optimized for a world where AI models are increasingly the first touchpoint in career discovery.\n\nWhat we build falls into four categories: cohort-based career-launch programs connected directly to employers, a talent network bridging local AI companies with international remote employers, a content ecosystem including this blog plus salary guides and women-in-AI features, and a community rooted in Amman but globally connected.\n\nThis platform is for Jordanian CS, AI, and data science graduates. For women reentering the workforce after gaps. For engineers earning 300 JOD per month who know they\u2019re worth more. For anyone who\u2019s been told "you\u2019re not ready" by a broken hiring process. The next cohort opens at steadywrk.app. Applications take ten minutes.',
  },
] as const;

export type CandidateStatus = 'applied' | 'screening' | 'assessment' | 'interview' | 'offer' | 'rejected';

export const PIPELINE_CANDIDATES = [
  { id: '1', name: 'Lina Al-Masri', role: 'AI Engineer', appliedDate: '2026-03-18', status: 'interview' as CandidateStatus, score: 92, scores: { technical: 95, organizational: 88, communication: 90, growth: 94, cultural: 91, initiative: 89 } },
  { id: '2', name: 'Omar Khalil', role: 'Frontend Developer', appliedDate: '2026-03-19', status: 'assessment' as CandidateStatus, score: 85, scores: { technical: 88, organizational: 82, communication: 86, growth: 80, cultural: 85, initiative: 84 } },
  { id: '3', name: 'Rania Haddad', role: 'Operations Dispatcher', appliedDate: '2026-03-17', status: 'offer' as CandidateStatus, score: 88, scores: { technical: 78, organizational: 95, communication: 92, growth: 86, cultural: 90, initiative: 88 } },
  { id: '4', name: 'Tariq Nasser', role: 'Digital Marketing Lead', appliedDate: '2026-03-20', status: 'screening' as CandidateStatus, score: 76, scores: { technical: 72, organizational: 80, communication: 78, growth: 74, cultural: 76, initiative: 73 } },
  { id: '5', name: 'Sara Mansour', role: 'AI BPO Agent', appliedDate: '2026-03-15', status: 'applied' as CandidateStatus, score: 70, scores: { technical: 65, organizational: 75, communication: 72, growth: 70, cultural: 74, initiative: 68 } },
  { id: '6', name: 'Yazan Qasim', role: 'AI Engineer', appliedDate: '2026-03-16', status: 'rejected' as CandidateStatus, score: 55, scores: { technical: 50, organizational: 58, communication: 60, growth: 52, cultural: 56, initiative: 54 } },
  { id: '7', name: 'Nour Abed', role: 'Frontend Developer', appliedDate: '2026-03-14', status: 'interview' as CandidateStatus, score: 90, scores: { technical: 92, organizational: 86, communication: 91, growth: 88, cultural: 92, initiative: 90 } },
  { id: '8', name: 'Faris Jarrar', role: 'Operations Dispatcher', appliedDate: '2026-03-19', status: 'applied' as CandidateStatus, score: 68, scores: { technical: 62, organizational: 74, communication: 70, growth: 66, cultural: 72, initiative: 64 } },
  { id: '9', name: 'Dana Khoury', role: 'AI BPO Agent', appliedDate: '2026-03-20', status: 'screening' as CandidateStatus, score: 74, scores: { technical: 68, organizational: 78, communication: 80, growth: 72, cultural: 76, initiative: 70 } },
  { id: '10', name: 'Kareem Saleh', role: 'Digital Marketing Lead', appliedDate: '2026-03-13', status: 'assessment' as CandidateStatus, score: 82, scores: { technical: 80, organizational: 84, communication: 85, growth: 78, cultural: 82, initiative: 80 } },
  { id: '11', name: 'Hala Dajani', role: 'AI Engineer', appliedDate: '2026-03-21', status: 'applied' as CandidateStatus, score: 78, scores: { technical: 82, organizational: 76, communication: 74, growth: 80, cultural: 78, initiative: 76 } },
  { id: '12', name: 'Sami Issa', role: 'Frontend Developer', appliedDate: '2026-03-12', status: 'offer' as CandidateStatus, score: 94, scores: { technical: 96, organizational: 90, communication: 93, growth: 95, cultural: 94, initiative: 92 } },
] as const;

export type EmployeeLevel = 'Explorer' | 'Contributor' | 'Builder' | 'Leader';

export const LEADERBOARD_DATA = [
  { id: '1', name: 'Rania Haddad', points: 2450, streak: 18, level: 'Builder' as EmployeeLevel, badges: ['Launched', 'First Build', 'Orbital'], isCurrentUser: false },
  { id: '2', name: 'Nour Abed', points: 2280, streak: 22, level: 'Builder' as EmployeeLevel, badges: ['Launched', 'First Build', 'Orbital', 'Steady'], isCurrentUser: false },
  { id: '3', name: 'You', points: 1950, streak: 12, level: 'Contributor' as EmployeeLevel, badges: ['Launched', 'First Build'], isCurrentUser: true },
  { id: '4', name: 'Lina Al-Masri', points: 1820, streak: 15, level: 'Contributor' as EmployeeLevel, badges: ['Launched', 'First Build', 'Orbital'], isCurrentUser: false },
  { id: '5', name: 'Omar Khalil', points: 1650, streak: 9, level: 'Contributor' as EmployeeLevel, badges: ['Launched', 'First Build'], isCurrentUser: false },
  { id: '6', name: 'Sara Mansour', points: 1420, streak: 7, level: 'Explorer' as EmployeeLevel, badges: ['Launched'], isCurrentUser: false },
  { id: '7', name: 'Tariq Nasser', points: 1180, streak: 5, level: 'Explorer' as EmployeeLevel, badges: ['Launched'], isCurrentUser: false },
  { id: '8', name: 'Dana Khoury', points: 980, streak: 3, level: 'Explorer' as EmployeeLevel, badges: [], isCurrentUser: false },
  { id: '9', name: 'Faris Jarrar', points: 850, streak: 4, level: 'Explorer' as EmployeeLevel, badges: ['Launched'], isCurrentUser: false },
  { id: '10', name: 'Hala Dajani', points: 720, streak: 2, level: 'Explorer' as EmployeeLevel, badges: [], isCurrentUser: false },
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
