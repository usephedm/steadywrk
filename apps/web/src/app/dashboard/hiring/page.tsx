'use client';

import { AnimatedTitle } from '@/components/ui/animated-title';
import { TiltCard } from '@/components/ui/tilt-card';
import { DEPARTMENTS, ROLES } from '@/lib/data';
import { motion } from 'framer-motion';
import { Building2, Clock, MapPin } from 'lucide-react';
import { useRef, useState } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

export default function HiringPage() {
  const [activeDept, setActiveDept] = useState('All');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    resumeUrl: '',
    message: '',
  });
  const formRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeDept === 'All' ? ROLES : ROLES.filter((p) => p.dept === activeDept);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formStatus === 'loading') return;
    setFormStatus('loading');
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setFormStatus(res.ok ? 'success' : 'error');
    } catch {
      setFormStatus('error');
    }
  };

  const scrollToForm = (positionTitle: string) => {
    setFormData((f) => ({ ...f, position: positionTitle }));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <AnimatedTitle
          text="Yes, We are hiring"
          className="text-4xl sm:text-5xl font-bold tracking-tighter text-white"
        />
        <motion.p
          className="text-white/40 text-sm tracking-[0.2em] uppercase font-mono mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Join the team
        </motion.p>
        <motion.div
          className="w-20 h-px mt-6"
          style={{
            background: 'linear-gradient(90deg, rgba(245,158,11,0.5), transparent)',
          }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>

      {/* Department filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveDept(dept)}
            className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 border ${
              activeDept === dept
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                : 'bg-white/[0.03] border-white/[0.08] text-white/40 hover:text-white/60 hover:border-white/[0.15]'
            }`}
            data-interactive
          >
            {dept}
          </button>
        ))}
      </motion.div>

      {/* Job cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {filtered.map((position, i) => (
          <motion.div
            key={position.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease }}
          >
            <TiltCard
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-3 hover:border-amber-500/15 transition-colors h-full"
              tiltAmount={3}
            >
              <h3 className="text-lg font-semibold text-white">{position.title}</h3>
              <div className="flex flex-wrap gap-3 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {position.dept}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {position.type}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {position.location}
                </span>
              </div>
              <p className="text-white/35 text-sm leading-relaxed">{position.description}</p>
              <button
                onClick={() => scrollToForm(position.title)}
                className="text-amber-500/70 text-xs font-mono tracking-wider uppercase hover:text-amber-500 transition-colors min-h-[44px] flex items-center"
                data-interactive
              >
                Apply →
              </button>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      {/* Application form */}
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, ease }}
        id="apply"
        className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 relative overflow-hidden"
      >
        {/* Subtle glow behind form */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(245,158,11,0.06), transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <h2 className="text-2xl font-bold text-white mb-6 relative">Apply</h2>

        {formStatus === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 space-y-3 relative"
          >
            <div className="text-amber-500 text-4xl">&#10003;</div>
            <p className="text-white/50 text-sm">Application received. We&apos;ll be in touch.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="apply-name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="apply-name"
                  type="text"
                  placeholder="Full Name *"
                  required
                  inputMode="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                  className="glow-input w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 min-h-[44px] text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-300 font-mono"
                />
              </div>
              <div>
                <label htmlFor="apply-email" className="sr-only">
                  Email
                </label>
                <input
                  id="apply-email"
                  type="email"
                  placeholder="Email *"
                  required
                  inputMode="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                  className="glow-input w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 min-h-[44px] text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-300 font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="apply-position" className="sr-only">
                  Position
                </label>
                <select
                  id="apply-position"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData((f) => ({ ...f, position: e.target.value }))}
                  className="glow-input w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 min-h-[44px] text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-300 font-mono"
                >
                  <option value="" className="bg-black text-white/40">
                    Select Position *
                  </option>
                  {ROLES.map((p) => (
                    <option key={p.slug} value={p.title} className="bg-black">
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="apply-resume" className="sr-only">
                  Resume URL
                </label>
                <input
                  id="apply-resume"
                  type="url"
                  placeholder="Resume URL (LinkedIn, PDF link)"
                  inputMode="url"
                  value={formData.resumeUrl}
                  onChange={(e) => setFormData((f) => ({ ...f, resumeUrl: e.target.value }))}
                  className="glow-input w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 min-h-[44px] text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-300 font-mono"
                />
              </div>
            </div>
            <div>
              <label htmlFor="apply-message" className="sr-only">
                Cover message
              </label>
              <textarea
                id="apply-message"
                placeholder="Cover message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                className="glow-input w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 min-h-[44px] text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-300 font-mono resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={formStatus === 'loading'}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 min-h-[44px] rounded-lg text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] disabled:opacity-50"
              data-interactive
            >
              {formStatus === 'loading' ? 'Submitting...' : 'Submit Application'}
            </button>
            {formStatus === 'error' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400/60 text-xs"
                role="alert"
                aria-live="polite"
              >
                Something went wrong. Try again.
              </motion.p>
            )}
          </form>
        )}
      </motion.div>

      {/* JSON-LD JobPosting structured data */}
      {ROLES.map((pos) => (
        <script
          key={pos.slug}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'JobPosting',
              title: pos.title,
              description: pos.description,
              employmentType: pos.type === 'Full-time' ? 'FULL_TIME' : 'CONTRACTOR',
              jobLocation: {
                '@type': 'Place',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: pos.location.includes('Jordan') ? 'Amman' : undefined,
                  addressCountry: pos.location.includes('Jordan') ? 'JO' : 'US',
                },
              },
              hiringOrganization: {
                '@type': 'Organization',
                name: 'SteadyWrk',
                sameAs: 'https://steadywrk.app',
              },
              datePosted: '2026-03-21',
            }),
          }}
        />
      ))}
    </div>
  );
}
