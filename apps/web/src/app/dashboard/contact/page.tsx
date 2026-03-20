'use client';

import { AnimatedTitle } from '@/components/ui/animated-title';
import { WhatsAppFloat } from '@/components/ui/whatsapp-float';
import { COMPANY } from '@/lib/data';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formStatus === 'loading') return;
    setFormStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setFormStatus(res.ok ? 'success' : 'error');
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <WhatsAppFloat />

      {/* Header */}
      <div className="mb-12">
        <AnimatedTitle
          text="Get in Touch"
          className="text-4xl sm:text-5xl font-bold tracking-tighter text-white"
        />
        <motion.p
          className="text-white/40 text-sm tracking-[0.2em] uppercase font-mono mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Business inquiries, partnerships, and deals
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

      {/* Contact form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ease }}
        className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 relative overflow-hidden"
      >
        {/* Glow behind form */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(245,158,11,0.05), transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {formStatus === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 space-y-3 relative"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-amber-500 text-4xl"
            >
              &#10003;
            </motion.div>
            <p className="text-white/50 text-sm">
              Message received. We&apos;ll get back to you shortly.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 relative">
            <div>
              <label htmlFor="contact-company" className="sr-only">
                Company Name
              </label>
              <input
                id="contact-company"
                type="text"
                placeholder="Company Name (optional)"
                inputMode="text"
                autoComplete="organization"
                value={formData.company}
                onChange={(e) => setFormData((f) => ({ ...f, company: e.target.value }))}
                className="glow-input w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 min-h-[44px] text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-300 font-mono"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="contact-name"
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
                <label htmlFor="contact-email" className="sr-only">
                  Email
                </label>
                <input
                  id="contact-email"
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
            <div>
              <label htmlFor="contact-subject" className="sr-only">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                placeholder="Subject *"
                required
                inputMode="text"
                value={formData.subject}
                onChange={(e) => setFormData((f) => ({ ...f, subject: e.target.value }))}
                className="glow-input w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 min-h-[44px] text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-300 font-mono"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="sr-only">
                Message
              </label>
              <textarea
                id="contact-message"
                placeholder="Message *"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                className="glow-input w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 min-h-[44px] text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-300 font-mono resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={formStatus === 'loading'}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 min-h-[44px] rounded-lg text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] disabled:opacity-50 flex items-center gap-2"
              data-interactive
            >
              {formStatus === 'loading' ? (
                'Sending...'
              ) : (
                <>
                  Send Message
                  <Send className="h-4 w-4" />
                </>
              )}
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

      {/* Direct contact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 flex flex-col sm:flex-row gap-6 justify-center text-center"
      >
        <div className="flex items-center justify-center gap-2 text-white/30 text-sm hover:text-amber-500/60 transition-colors">
          <Mail className="h-4 w-4" />
          <span className="font-mono">{COMPANY.email}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-white/30 text-sm">
          <MapPin className="h-4 w-4" />
          <span className="font-mono">Amman, Jordan · United States</span>
        </div>
      </motion.div>
    </div>
  );
}
