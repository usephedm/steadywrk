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
    slug: 'jordan-bpo-revolution',
    title: "Jordan's BPO Revolution: Why US Companies Are Hiring Jordanian Talent in 2026",
    date: '2026-03-20',
    category: 'AI Careers' as BlogCategory,
    readTime: '15 min read',
    featured: false,
    excerpt:
      'The outsourcing narrative is changing. Mention BPO and most think India or Philippines. That picture is outdated — Jordan is why.',
    content:
      "The outsourcing industry has a narrative problem. Mention 'BPO' and most American companies think: India. Philippines. Call centers. Low-cost labor doing low-skilled work. That picture is outdated. And if you're still hiring based on it, you're leaving money on the table.\n\nJordan sits at a strategic crossroads — literally and figuratively. UTC+3 creates a natural overlap with both European mornings and US East Coast afternoons. Internet penetration exceeds 95%. The workforce is young, educated, and bilingual. Over 7,000 ICT graduates enter the market annually from universities like JUST, University of Jordan, and Princess Sumaya University.\n\nThe cost advantage is real but not the whole story. A senior AI engineer in Amman costs 60-70% less than their Bay Area equivalent — but the quality gap that existed five years ago has closed dramatically. Jordan's National AI Strategy 2023-2027 is actively training 15,000 individuals in AI skills. Companies like Mawdoo3, Estarta, and now STEADYWRK are building production AI systems from Amman that serve US clients.\n\nThe timezone advantage is underrated. When your Amman team starts at 9 AM local, it's 2 AM Eastern — but when your US team starts at 9 AM Eastern, your Amman team is available until 4 PM local. This creates a genuine 18-hour coverage window without anyone working nights. For dispatch operations, customer support, and AI monitoring, this is a structural advantage that no amount of automation can replicate.\n\nSTEADYWRK operates at this intersection. Our agents in Amman manage US commercial maintenance operations using AI-enhanced tooling — dispatching technicians, tracking work orders, and managing client relationships across 50 states. The combination of Jordanian operational talent and AI tooling produces results that traditional BPO models simply cannot match. Apply at steadywrk.app/careers.",
  },
  {
    slug: 'steadywrk-hiring-process',
    title: 'How STEADYWRK Hires: Our Transparent 7-Stage Process',
    date: '2026-03-17',
    category: 'Behind the Build' as BlogCategory,
    readTime: '14 min read',
    featured: false,
    excerpt:
      "Most hiring processes are broken. Here's exactly how STEADYWRK hires — every stage, every timeline, every decision point. No black boxes.",
    content:
      "Most hiring processes are broken. Candidates don't know what matters. Hiring managers make gut calls at stage two and then rationalize them for the next four weeks. Companies talk about hiring for 'culture fit' but actually mean 'people like us.' Candidates waste months in limbo wondering if they're still being considered.\n\nAt STEADYWRK, we think that's unacceptable. Here's exactly how we hire — transparently, respectfully, and fast. Our target is 14 days from application to offer.\n\nStage 1: Application (6-8 minutes). You fill out our multi-step form at steadywrk.app. Name, email, team preference, three short answers, and a role-specific micro-challenge. No account required. No CV parsing black box.\n\nStage 2: AI-Assisted Review (within 48 hours). Every application is read by a real person, assisted by AI screening that evaluates response quality, not keywords. We look for clarity of thought, relevant experience, and genuine interest.\n\nStage 3: Skills Assessment. A timed, role-specific challenge that mirrors actual work you'd do here. Dispatchers get a prioritization scenario. Engineers get a prompt engineering task. Designers get a UI critique. This IS the filter.\n\nStage 4: Video Interview. Three recorded questions, done asynchronously. Show us how you think and communicate. Female interviewer option available. Prayer-time-aware scheduling.\n\nStage 5: Live Interview (45 minutes). Structured conversation with the hiring manager. No trick questions. Scorecard-based evaluation across six dimensions: technical skill (30%), organizational ability (20%), communication (15%), growth mindset (15%), cultural alignment (10%), initiative (10%).\n\nStage 6: Team Meet. Casual 30-minute session with 2-3 team members. This is for mutual fit — we want you to evaluate us too.\n\nStage 7: Offer. Transparent compensation formula. Clear growth path. Decision in 72 hours after final interview. We respond to every applicant within 48 hours, every time. Apply at steadywrk.app/careers.",
  },
  {
    slug: 'ai-careers-jordan-2026',
    title: 'The Complete Guide to AI Careers in Jordan 2026',
    date: '2026-03-16',
    category: 'AI Careers' as BlogCategory,
    readTime: '18 min read',
    featured: true,
    excerpt:
      'Everything Jordanian graduates need to know about AI careers in 2026: salary ranges, skills in demand, and proven paths to landing your first role.',
    content:
      "The AI job market in Jordan is moving faster than most graduates realize. Twelve months ago, 'AI engineer' wasn't a real job category here. Today, companies across Amman are actively hiring. The gap between what's happening in the market and what most people think they know is massive.\n\nJordan's ICT sector is worth $3.11 billion and growing at nearly 16% per year. By 2031, it's projected to reach $6.52 billion. Yet youth unemployment sits at 41.72%, and 7,000 new ICT graduates enter the market annually without guaranteed pathways. This is the paradox.\n\nHere are the six AI career paths available in Jordan right now, with real salary data:\n\n1. AI/ML Engineer (800-1,500 JOD/month): Build and deploy models. Most in-demand locally. Companies: Mawdoo3, Estarta, STEADYWRK.\n\n2. Prompt Engineer (600-1,200 JOD/month): Design and optimize LLM interactions. Fastest-growing new role. No CS degree required — demonstrated skill matters more.\n\n3. Data Scientist (700-1,400 JOD/month): Analysis, experimentation, insight generation. Strong at banks, telecoms (Zain, Orange), and fintechs.\n\n4. AI BPO Agent (350-500 JOD/month): Handle business processes with AI-enhanced tooling. Training provided. Entry point for non-technical graduates who are sharp, organized, and bilingual.\n\n5. Frontend Developer with AI (700-1,200 JOD/month): Build AI-powered interfaces. Next.js, React, TypeScript. Every AI product needs a frontend.\n\n6. Digital Marketing Lead with AI (600-1,000 JOD/month): Run campaigns using AI tools for content generation, audience targeting, and performance optimization.\n\nThe salary jump from local to international remote is 3-5x. A Jordanian AI engineer earning 1,000 JOD locally can earn $3,000-5,000/month remotely for a US company. This is the career-defining strategic move.\n\nSTEADYWRK's IGNITE program (3 months), ORBIT fellowship (6 months), and APEX leadership track (12 months) are designed to bridge this gap. You work on production AI systems serving US clients from day one. No simulations. Apply at steadywrk.app/careers.",
  },
  {
    slug: 'hello-world',
    title: 'STEADYWRK Has Landed in Jordan',
    date: '2026-03-21',
    category: 'Behind the Build' as BlogCategory,
    readTime: '4 min read',
    featured: false,
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
    date: '2026-03-15',
    category: 'Behind the Build' as BlogCategory,
    readTime: '8 min read',
    featured: false,
    excerpt:
      'STEADYWRK\u2019s hiring process is built for human beings, not ATS filters. Here\u2019s exactly what to expect \u2014 every stage, every timeline, every decision point.',
    content:
      'Most hiring processes feel like sending your CV into a void. You apply, you wait, you hear nothing. At STEADYWRK, we think that\u2019s broken. Here\u2019s exactly how we hire \u2014 transparently, respectfully, and fast.\n\nWe hire on signal, not pedigree. There\u2019s no degree requirement and no GPA filter. We look for curiosity, craft, and commitment. We want people who want to build something meaningful, not people chasing job titles. When you apply, a real person reads your submission within 48 hours. That\u2019s not a goal \u2014 it\u2019s an SLA we hold ourselves to.\n\nOur process has five stages. Stage one is your application \u2014 six to eight minutes, no account required. Stage two is a portfolio or craft review, done asynchronously so you can show us work on your terms. Stage three is a real conversation with the hiring team \u2014 no quiz, no trick questions. Stage four is a paid trial project: compensated, scoped, and time-boxed. Stage five is the offer, built on a transparent compensation formula so there\u2019s no guessing.\n\nWhat we\u2019re actually looking for is not AI hype. We want people who can explain why a model works, debug when it doesn\u2019t, and communicate findings to a non-technical team. We actively recruit women into technical roles \u2014 over fifty percent of our pipeline is targeted at underrepresented candidates. If you\u2019ve been told \u201cyou\u2019re not ready yet\u201d by other employers, bring that story to us. We respond within 48 hours, every time. Applications are open at steadywrk.app/careers.',
  },
  {
    slug: 'women-building-ai-jordan',
    title: 'Women Building AI in Jordan: 12 Voices You Should Know',
    date: '2026-03-14',
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
    date: '2026-03-13',
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
    title:
      'AI Careers Guide for Jordanian Graduates \u2014 Every Role, Every Salary, Every Path (2026)',
    date: '2026-03-12',
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
    title:
      'Jordan\u2019s $3 Billion ICT Sector Is Growing Fast \u2014 So Why Can\u2019t Graduates Get Hired?',
    date: '2026-03-11',
    category: 'AI Careers' as BlogCategory,
    readTime: '11 min read',
    featured: false,
    excerpt:
      'Jordan\u2019s ICT market is growing at 16% CAGR toward $6.5B by 2031. Yet 41.72% of young people are unemployed. Here\u2019s the data behind the paradox.',
    content:
      'Jordan\u2019s tech sector is worth $3.11 billion and growing at nearly 16 percent per year. By 2031, it\u2019s projected to reach $6.52 billion. ICT employment has grown at a 19 percent compound annual rate over recent years. Yet youth unemployment sits at 41.72 percent, and 7,000 new ICT graduates enter the market annually without guaranteed pathways. This is the paradox at the heart of Jordan\u2019s technology economy.\n\nThe barriers are structural and interlinked. First, there\u2019s a skills mismatch: universities are training students on yesterday\u2019s stack while employers need engineers who can ship production AI systems today. Second, the \u201cone year of experience\u201d paradox means entry-level roles require experience, but meaningful internships remain rare. Third, brain drain is accelerating \u2014 an estimated 30 to 40 percent of Jordan\u2019s top tech talent emigrates for Gulf or Western salaries, deepening domestic shortages. Fourth, hiring in Jordan is heavily relationship-driven. Without network access, qualified candidates\u2019 applications simply disappear.\n\nThe government is responding. Jordan\u2019s AI Strategy 2023\u20132027 targets training 15,000 individuals, launching 50 new AI startups, and increasing AI research output by 30 percent. The Economic Modernization Vision aims to create one million new jobs and double female labor force participation. iPARK has enabled over $20 million in investment and 3,000 jobs. The ISSF fund puts $98 million behind startups and SMEs.\n\nBut policy alone won\u2019t close the gap. STEADYWRK exists because we\u2019re not waiting for the system to fix itself. We\u2019re building the bridge between Jordan\u2019s tech graduates and the employers who actually want them \u2014 with structured hiring, real projects, and a 14-day timeline from application to offer.',
  },
  {
    slug: 'remote-work-jordan-tech-professionals-guide',
    title: 'Working Remotely from Jordan for International Tech Companies: The 2026 Guide',
    date: '2026-03-10',
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
    date: '2026-03-09',
    category: 'AI Careers' as BlogCategory,
    readTime: '7 min read',
    featured: false,
    excerpt:
      'Jordan\u2019s REACH2025 plan set bold targets for the digital economy. Now, the National AI Strategy 2023\u20132027 carries the torch. Here\u2019s where Jordan stands.',
    content:
      'Jordan has been building toward a digital economy since 2000, when the original REACH Initiative laid the groundwork for what would become one of the Middle East\u2019s most ambitious technology strategies. Here\u2019s a concise history, the current state of play, and why the next three years represent the biggest window of opportunity for AI careers in Jordan.\n\nREACH2025 launched in 2016, building on 16 years of prior digital infrastructure investment. Its vision: \u201cJordan as a platform for digital innovation.\u201d Key targets included developing specialized ICT talent pipelines, digitizing healthcare, education, and finance, and establishing Jordan as a leader in Arabic digital content. The initiative was co-created by the Ministry of ICT, int@j, and the private sector with USAID support. Its principles have since been integrated into the broader Economic Modernization Vision 2023\u20132033.\n\nThe National AI Strategy 2023\u20132027 now carries the torch. It comprises 68 projects across five strategic objectives, with targets including training 15,000 individuals in AI skills, launching 50 new AI startups, and achieving a 30 percent increase in AI research output. Jordan is one of only 35 percent of countries globally to have both an AI strategy and an AI ethics charter \u2014 a distinction noted by Oxford Insights.\n\nFor your career, this means government contracts and procurement will increasingly require AI skills. iPARK, MoDEE, and ISSF are funding AI startups, creating a wave of new roles. Public sector AI deployments are generating demand for ML engineers, data analysts, and project managers with AI literacy. International companies are watching Jordan\u2019s strategy signals closely. STEADYWRK helps you position for these opportunities. Learn how at steadywrk.app.',
  },
  {
    slug: 'ai-salary-jordan-gulf-global-benchmark-2026',
    title: 'Jordan AI Salaries vs. the Gulf vs. Global Remote: The 2026 Benchmark Guide',
    date: '2026-03-08',
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
    date: '2026-03-07',
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
    title: 'Why We Built STEADYWRK in Amman',
    date: '2026-03-06',
    category: 'Behind the Build' as BlogCategory,
    readTime: '8 min read',
    featured: false,
    excerpt:
      '66% female youth unemployment. 7,000 tech graduates per year without a clear path. Jordan has the talent \u2014 what it needed was a platform. Here\u2019s why we built STEADYWRK in Amman.',
    content:
      'We built STEADYWRK in Amman because the problem is here. 66 percent of Jordanian women aged 15 to 24 are unemployed. Meanwhile, Jordan\u2019s ICT sector is growing at 16 percent per year toward $6.5 billion by 2031. The talent is real. The system is broken. We\u2019re fixing it.\n\nThe problem we saw is specific and measurable. Seven thousand ICT graduates enter Jordan\u2019s market each year, many without structured career pathways. Jordan\u2019s female labor force participation rate is 14 percent \u2014 the fourth lowest in the world. Over a third of university-educated Jordanian women are unemployed. The ICT sector actually leads on female inclusion at over 30 percent of its workforce, yet no one is building the pipeline deliberately.\n\nSTEADYWRK is not \u201cAI-enhanced.\u201d It\u2019s AI-native, meaning AI is the operating logic, not a feature. We use AI-matched talent placement instead of keyword-filtered CV screening. Our skill assessments are AI-augmented. Career paths are AI-personalized. Our content and platform are optimized for a world where AI models are increasingly the first touchpoint in career discovery.\n\nWhat we build falls into four categories: cohort-based career-launch programs connected directly to employers, a talent network bridging local AI companies with international remote employers, a content ecosystem including this blog plus salary guides and women-in-AI features, and a community rooted in Amman but globally connected.\n\nThis platform is for Jordanian CS, AI, and data science graduates. For women reentering the workforce after gaps. For engineers earning 300 JOD per month who know they\u2019re worth more. For anyone who\u2019s been told \u201cyou\u2019re not ready\u201d by a broken hiring process. The next cohort opens at steadywrk.app. Applications take ten minutes.',
  },
] as const;
