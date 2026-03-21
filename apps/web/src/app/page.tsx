import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe,
  GraduationCap,
  Megaphone,
  MessageCircle,
  Rocket,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'STEADYWRK | Where Ambition Compounds',
  description:
    'Jordan\'s AI-native career platform. Apply. Train. Work. Elite standards, rapid development, structured opportunity for ambitious talent.',
};

/* ─── Data ─── */

const PROGRAMS = [
  {
    name: 'IGNITE',
    type: 'Internship',
    duration: '3 months',
    description: 'Immersive AI-native internship. Ship production work from week one.',
  },
  {
    name: 'ORBIT',
    type: 'Fellowship',
    duration: '6 months',
    description: 'Deep technical fellowship. Lead projects, mentor juniors, build systems.',
  },
  {
    name: 'APEX',
    type: 'Leadership Track',
    duration: '12 months',
    description: 'Strategic leadership. Architect solutions, drive teams, shape company direction.',
  },
];

const ROLES = [
  { title: 'AI Engineer', dept: 'AI Lab', type: 'Full-time', location: 'Amman / Remote' },
  { title: 'Frontend Developer', dept: 'Engineering', type: 'Full-time', location: 'Amman / Remote' },
  { title: 'Digital Marketing Lead', dept: 'Growth', type: 'Full-time', location: 'Amman' },
  { title: 'BPO Operations Manager', dept: 'Operations', type: 'Full-time', location: 'Amman' },
  { title: 'AI BPO Agent', dept: 'BPO', type: 'Contract', location: 'Remote' },
];

const VALUES = [
  {
    icon: Target,
    title: 'Elite Standards',
    desc: 'Hard to get into. Every hire is deliberate. Selection is transparent, structured, and fair.',
  },
  {
    icon: TrendingUp,
    title: 'Visible Growth',
    desc: 'Your trajectory is legible. Promotions, mentorship, and shipped work — not vague promises.',
  },
  {
    icon: Shield,
    title: 'Real Fairness',
    desc: 'Structured scorecards, same questions, transparent criteria. No "culture fit" guessing.',
  },
  {
    icon: Zap,
    title: 'Speed as Brand',
    desc: 'Fast hiring. Fast feedback. Fast growth. 14-day hiring target. Response within 48 hours.',
  },
];

const SERVICES = [
  { icon: Brain, title: 'AI Lab & Studio', desc: 'Custom AI agents, LLM integrations, autonomous workflow design.' },
  { icon: Building2, title: 'Facility Management', desc: 'End-to-end field service dispatch, maintenance, vendor management.' },
  { icon: Megaphone, title: 'Digital Marketing', desc: 'Data-driven SEO, content strategy, paid media, brand development.' },
  { icon: Sparkles, title: 'AI BPO', desc: 'AI-enhanced customer support, document processing, back-office automation.' },
];

const STATS = [
  { value: '48h', label: 'Response time' },
  { value: '14', label: 'Days to hire' },
  { value: '6', label: 'Open roles' },
  { value: '92.5%', label: 'Jordan online' },
];

/* ─── Page ─── */

export default function HomePage() {
  return (
    <>
      {/* ━━━ Navigation ━━━ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-xl border-b border-[var(--color-divider)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Orange mark SVG — brand guidelines primary */}
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M8 20L16 12L24 20" stroke="#E58A0F" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 14L16 6L24 14" stroke="#E58A0F" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-[var(--font-display)] font-bold text-[var(--color-graphite)] text-lg tracking-tight">
              STEADYWRK
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-fog)]">
            <a href="#roles" className="hover:text-[var(--color-graphite)] transition-colors duration-200">Careers</a>
            <a href="#programs" className="hover:text-[var(--color-graphite)] transition-colors duration-200">Programs</a>
            <a href="#services" className="hover:text-[var(--color-graphite)] transition-colors duration-200">Services</a>
            <a href="#about" className="hover:text-[var(--color-graphite)] transition-colors duration-200">About</a>
          </div>
          <a
            href="#apply"
            className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white px-6 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm"
          >
            Apply Now
          </a>
        </div>
      </nav>

      <main>
        {/* ━━━ 1. Hero ━━━ */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-6 section-light">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[var(--radius-full)] bg-[var(--color-brand-highlight)] text-[var(--color-brand)] text-sm font-medium mb-8">
              <Rocket className="w-4 h-4" />
              Now hiring in Amman, Jordan
            </div>
            <h1
              className="text-[clamp(2.5rem,1rem+4vw,5rem)] font-extrabold leading-[1.08] tracking-tight text-[var(--color-graphite)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Jordan&apos;s sharpest minds.
              <br />
              <span className="text-[var(--color-brand)]">One mission.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[var(--color-fog)] max-w-2xl mx-auto leading-relaxed">
              STEADYWRK is the AI-native career platform where ambitious talent trains with real tools,
              ships real work, and grows fast. Elite standards. Clear growth. Real opportunity.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#apply"
                className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white px-8 py-3.5 rounded-[var(--radius-md)] text-base font-medium transition-all duration-200 hover:scale-[1.02] shadow-md inline-flex items-center gap-2"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#programs"
                className="border-2 border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white px-8 py-3.5 rounded-[var(--radius-md)] text-base font-medium transition-all duration-200 inline-flex items-center gap-2"
              >
                See How Selection Works
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ━━━ 2. Stats bar ━━━ */}
        <section className="py-6 bg-[var(--color-deep-carbon)] border-y border-[var(--color-divider-dark)]">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  {s.value}
                </div>
                <div className="text-xs uppercase tracking-[0.1em] text-white/50 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ━━━ 3. Why STEADYWRK (EVP) ━━━ */}
        <section id="about" className="py-20 md:py-28 px-6 section-ivory">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-16">
              <p className="text-sm uppercase tracking-[0.1em] text-[var(--color-brand)] font-semibold mb-3">
                Why STEADYWRK
              </p>
              <h2 className="text-[clamp(2rem,1.2rem+2.5vw,3.5rem)] font-bold text-[var(--color-graphite)]" style={{ fontFamily: 'var(--font-display)' }}>
                Built for people who want their growth to compound.
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-8 border border-[rgba(0,0,0,0.06)] shadow-[var(--shadow-xs)] card-hover"
                >
                  <v.icon className="w-6 h-6 text-[var(--color-brand)] mb-4" strokeWidth={1.5} />
                  <h3 className="text-xl font-bold text-[var(--color-graphite)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {v.title}
                  </h3>
                  <p className="text-[var(--color-fog)] leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ 4. Open Roles ━━━ */}
        <section id="roles" className="py-20 md:py-28 px-6 section-light">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mb-12">
              <p className="text-sm uppercase tracking-[0.1em] text-[var(--color-brand)] font-semibold mb-3">
                Open Positions
              </p>
              <h2 className="text-[clamp(2rem,1.2rem+2.5vw,3.5rem)] font-bold text-[var(--color-graphite)]" style={{ fontFamily: 'var(--font-display)' }}>
                Join the team.
              </h2>
              <p className="mt-4 text-[var(--color-fog)] text-lg">
                We hire for discipline, craft, and curiosity. If you build things that work and care about the details — we want to talk.
              </p>
            </div>
            <div className="space-y-3">
              {ROLES.map((role) => (
                <a
                  key={role.title}
                  href="#apply"
                  className="flex items-center justify-between p-5 md:p-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[rgba(0,0,0,0.06)] shadow-[var(--shadow-xs)] card-hover group"
                >
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-graphite)] group-hover:text-[var(--color-brand)] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                      {role.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-sm text-[var(--color-fog)]">
                      <span className="uppercase text-xs tracking-[0.05em] font-medium text-[var(--color-text-muted)]">{role.dept}</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--color-text-faint)]" />
                      <span>{role.type}</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--color-text-faint)]" />
                      <span>{role.location}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[var(--color-text-faint)] group-hover:text-[var(--color-brand)] group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ 5. Programs ━━━ */}
        <section id="programs" className="py-20 md:py-28 px-6 section-dark">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-16">
              <p className="text-sm uppercase tracking-[0.1em] text-[var(--color-brand-light)] font-semibold mb-3">
                Career Programs
              </p>
              <h2 className="text-[clamp(2rem,1.2rem+2.5vw,3.5rem)] font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Three tracks. One mission.
              </h2>
              <p className="mt-4 text-white/60 text-lg">
                Every program builds real AI skills with real projects. No simulations. No theory-only. You ship production work.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {PROGRAMS.map((p, i) => (
                <div
                  key={p.name}
                  className="bg-[var(--color-dark-surface-2)] rounded-[var(--radius-lg)] p-8 border border-white/[0.06] relative overflow-hidden group card-hover"
                  style={{
                    borderLeft: i === 1 ? '4px solid var(--color-brand)' : undefined,
                  }}
                >
                  <div className="text-sm uppercase tracking-[0.1em] text-[var(--color-brand-light)] font-semibold mb-2">
                    {p.type} · {p.duration}
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                    {p.name}
                  </h3>
                  <p className="text-white/60 leading-relaxed">{p.description}</p>
                  <a
                    href="#apply"
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand-light)] hover:text-white transition-colors"
                  >
                    Apply for {p.name}
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ 6. Services ━━━ */}
        <section id="services" className="py-20 md:py-28 px-6 section-light">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-16">
              <p className="text-sm uppercase tracking-[0.1em] text-[var(--color-brand)] font-semibold mb-3">
                What We Build
              </p>
              <h2 className="text-[clamp(2rem,1.2rem+2.5vw,3.5rem)] font-bold text-[var(--color-graphite)]" style={{ fontFamily: 'var(--font-display)' }}>
                Four verticals. One platform.
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {SERVICES.map((s) => (
                <div
                  key={s.title}
                  className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-8 border border-[rgba(0,0,0,0.06)] shadow-[var(--shadow-xs)] card-hover"
                >
                  <s.icon className="w-6 h-6 text-[var(--color-brand)] mb-4" strokeWidth={1.5} />
                  <h3 className="text-xl font-bold text-[var(--color-graphite)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {s.title}
                  </h3>
                  <p className="text-[var(--color-fog)] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ 7. Founder / Credibility ━━━ */}
        <section className="py-20 md:py-28 px-6 section-ivory">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-[0.1em] text-[var(--color-brand)] font-semibold mb-3">
              Who We Are
            </p>
            <h2 className="text-[clamp(1.5rem,1.2rem+1.25vw,2.25rem)] font-bold text-[var(--color-graphite)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Kayan Ventures Jordan LLC
            </h2>
            <p className="text-[var(--color-fog)] text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              STEADYWRK is operated by Kayan Ventures, headquartered at King Hussein Business Park, Amman.
              US-incorporated, Jordan-operated. We serve US clients with Jordan&apos;s sharpest talent —
              building AI systems, managing operations, and executing digital strategy at the intersection
              of two markets.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-[var(--color-fog)]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[var(--color-brand)]" />
                <span>steadywrk.app</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--color-brand)]" />
                <span>KHBP, Amman</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--color-brand)]" />
                <span>Hiring Now</span>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ 8. Application CTA ━━━ */}
        <section id="apply" className="py-20 md:py-28 px-6 section-deep">
          <div className="max-w-2xl mx-auto text-center">
            <GraduationCap className="w-10 h-10 text-[var(--color-brand-light)] mx-auto mb-6" />
            <h2 className="text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Ready to apply?
            </h2>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              6–8 minutes. No account required. We review within 48 hours.
              If you&apos;re disciplined, bright, and hungry — this is where your curve bends upward.
            </p>
            <a
              href="https://wa.me/962790000000?text=I%20want%20to%20apply%20to%20STEADYWRK"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white px-10 py-4 rounded-[var(--radius-md)] text-lg font-semibold transition-all duration-200 hover:scale-[1.02] shadow-lg inline-flex items-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              Apply via WhatsApp
            </a>
            <p className="mt-4 text-white/30 text-sm">
              Or email <a href="mailto:hello@steadywrk.app" className="underline hover:text-white/50">hello@steadywrk.app</a>
            </p>
          </div>
        </section>
      </main>

      {/* ━━━ Footer ━━━ */}
      <footer className="py-12 px-6 bg-[var(--color-near-black)] border-t border-[var(--color-divider-dark)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M8 20L16 12L24 20" stroke="#E58A0F" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 14L16 6L24 14" stroke="#E58A0F" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-white/70 text-sm font-medium tracking-tight">STEADYWRK</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/30">
              <span>© 2026 Kayan Ventures Jordan LLC</span>
              <span>·</span>
              <span>Building 15, King Hussein Business Park, Amman</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ━━━ WhatsApp Float ━━━ */}
      <a
        href="https://wa.me/962790000000?text=Hi%20STEADYWRK!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BD5A] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
        style={{ animation: 'whatsapp-bounce 2s ease-in-out infinite' }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </>
  );
}
