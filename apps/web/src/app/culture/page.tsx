import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Target, TrendingUp, Shield, Zap, Heart, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Culture',
  description:
    'Built for women who build. Elite standards, visible growth, real fairness, and speed as brand. Discover the values that drive STEADYWRK.',
};

const VALUES = [
  {
    icon: Target,
    title: 'Elite Standards',
    desc: 'Hard to get into. Every hire is deliberate. Structured scorecards, transparent criteria, same questions for everyone.',
  },
  {
    icon: TrendingUp,
    title: 'Visible Growth',
    desc: 'Promotions, mentorship, shipped work. Your trajectory is legible and accelerating — not a vague promise.',
  },
  {
    icon: Shield,
    title: 'Real Fairness',
    desc: 'No "culture fit" guessing games. We respond within 48 hours. Constructive feedback at every stage. Always.',
  },
  {
    icon: Zap,
    title: 'Speed as Brand',
    desc: 'Fast hiring. Fast feedback. Fast growth. 14-day hiring target. The name promises momentum — we deliver it.',
  },
  {
    icon: Heart,
    title: 'Built for Women Who Build',
    desc: 'Not a diversity checkbox. Women in actual technical, strategic, and leadership contexts — naturally, not tokenized.',
  },
  {
    icon: Lightbulb,
    title: 'AI-Native from Day One',
    desc: 'You don\u2019t observe AI — you build with it. Every vertical runs on AI systems you help create and improve.',
  },
];

export default function CulturePage() {
  return (
    <>
      <Navbar />

      <main className="pt-16">
        <section className="py-20 md:py-28 px-6 bg-[#FAFAF8]">
          <div className="max-w-3xl mx-auto">
            <nav className="text-[13px] text-[#B0B0AB] mb-8">
              <Link href="/" className="hover:text-[#6E695F] transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-[#23211D]">Culture</span>
            </nav>
            <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4">Our Culture</p>
            <h1 className="text-[clamp(2.5rem,1rem+4vw,4rem)] font-bold text-[#23211D] leading-[1.08] tracking-[-0.03em] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Precision warmth.
            </h1>
            <p className="text-[#6E695F] text-[17px] leading-relaxed">
              Technologically elite but humanly breathable. We hire deliberately, grow visibly,
              and move fast — because ambitious people shouldn&rsquo;t wait.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 px-6 bg-[#F7F4EE]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-[clamp(1.5rem,1.2rem+1.25vw,2.25rem)] font-bold text-[#23211D] mb-10" style={{ fontFamily: 'var(--font-display)' }}>
              What We Stand For
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="bg-white rounded-xl p-6 border border-[rgba(0,0,0,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] card-hover"
                >
                  <v.icon className="w-5 h-5 text-[#E58A0F] mb-4" strokeWidth={1.5} />
                  <h3 className="text-[16px] font-bold text-[#23211D] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{v.title}</h3>
                  <p className="text-[#6E695F] text-[14px] leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Onboarding */}
        <section className="py-16 md:py-24 px-6 bg-[#FAFAF8]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[clamp(1.5rem,1.2rem+1.25vw,2.25rem)] font-bold text-[#23211D] mb-5" style={{ fontFamily: 'var(--font-display)' }}>
              Your First 30 Days
            </h2>
            <p className="text-[#6E695F] text-[16px] leading-relaxed mb-10">
              We don&rsquo;t do orientation slideshows. Your first month is a quest line with real milestones, real badges, and real momentum.
            </p>

            <div className="space-y-6">
              {[
                { week: 'Week 1', title: 'Launch Sequence', items: ['Welcome ritual', 'Buddy pairing', 'Orientation Orbit modules'], badge: 'Launched' },
                { week: 'Week 2', title: 'First Contact', items: ['Shadow a lead', 'Ship first deliverable', 'Set 30/60/90 goals'], badge: 'First Build' },
                { week: 'Week 3', title: 'Into Orbit', items: ['Own a task', 'Demo day', 'Slack contributions'], badge: 'Orbital' },
                { week: 'Week 4', title: 'Steady State', items: ['Project review', 'Peer feedback', 'Reflection post'], badge: 'Steady' },
              ].map((q) => (
                <div key={q.week} className="bg-white rounded-xl p-6 border border-[rgba(0,0,0,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#E58A0F]">{q.week}</span>
                      <h3 className="text-[17px] font-bold text-[#23211D]" style={{ fontFamily: 'var(--font-display)' }}>{q.title}</h3>
                    </div>
                    <span className="badge-achievement text-[10px]">{q.badge}</span>
                  </div>
                  <ul className="space-y-1">
                    {q.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-[14px] text-[#6E695F]">
                        <span className="w-1 h-1 rounded-full bg-[#E58A0F]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 px-6 bg-[#F7F4EE]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-[clamp(1.5rem,1.2rem+1.25vw,2.25rem)] font-bold text-[#23211D] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              This is where your curve bends upward.
            </h2>
            <p className="text-[#6E695F] text-[16px] mb-8">
              If you&rsquo;re disciplined, bright, and hungry — we&rsquo;re hiring.
            </p>
            <Link
              href="/apply/operations-dispatcher"
              className="inline-flex items-center gap-2.5 bg-[#E58A0F] hover:bg-[#CC7408] text-white font-medium text-[15px] px-8 py-3.5 rounded-lg transition-colors duration-[180ms]"
            >
              Start your application
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
