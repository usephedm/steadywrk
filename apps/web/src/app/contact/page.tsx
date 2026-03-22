'use client';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { WhatsAppFloat } from '@/components/ui/whatsapp-float';
import { COMPANY } from '@/lib/constants';
import { Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

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
    <>
      <Navbar />
      <main id="main-content" className="min-h-dvh bg-[#FAFAF8] pt-16">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <WhatsAppFloat />

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold text-[#23211D] tracking-tight">
              Get in Touch
            </h1>
            <p className="text-[#6B6B66] mt-2 text-sm">
              Business inquiries, partnerships, and deals.
            </p>
          </div>

          {/* Contact form */}
          <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {formStatus === 'success' ? (
              <div className="text-center py-12 space-y-3">
                <div className="text-[#E58A0F] text-4xl">&#10003;</div>
                <p className="text-[#6B6B66] text-sm">
                  Message received. We&apos;ll get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
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
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E2] rounded-lg px-4 py-3 min-h-[44px] text-sm text-[#23211D] placeholder:text-[#B0B0AB] focus:outline-none focus:border-[#E58A0F] focus:ring-2 focus:ring-[#E58A0F]/10 transition-all"
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
                      className="w-full bg-[#F5F5F3] border border-[#E5E5E2] rounded-lg px-4 py-3 min-h-[44px] text-sm text-[#23211D] placeholder:text-[#B0B0AB] focus:outline-none focus:border-[#E58A0F] focus:ring-2 focus:ring-[#E58A0F]/10 transition-all"
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
                      className="w-full bg-[#F5F5F3] border border-[#E5E5E2] rounded-lg px-4 py-3 min-h-[44px] text-sm text-[#23211D] placeholder:text-[#B0B0AB] focus:outline-none focus:border-[#E58A0F] focus:ring-2 focus:ring-[#E58A0F]/10 transition-all"
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
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E2] rounded-lg px-4 py-3 min-h-[44px] text-sm text-[#23211D] placeholder:text-[#B0B0AB] focus:outline-none focus:border-[#E58A0F] focus:ring-2 focus:ring-[#E58A0F]/10 transition-all"
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
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E2] rounded-lg px-4 py-3 min-h-[44px] text-sm text-[#23211D] placeholder:text-[#B0B0AB] focus:outline-none focus:border-[#E58A0F] focus:ring-2 focus:ring-[#E58A0F]/10 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="bg-[#E58A0F] hover:bg-[#CC7408] text-white font-medium px-8 py-3 min-h-[44px] rounded-lg text-sm transition-all duration-[180ms] disabled:opacity-50 flex items-center gap-2"
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
                  <p className="text-[#A03D4A] text-xs" role="alert" aria-live="polite">
                    Something went wrong. Try again.
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Direct contact */}
          <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center text-center">
            <div className="flex items-center justify-center gap-2 text-[#6B6B66] text-sm hover:text-[#E58A0F] transition-colors">
              <Mail className="h-4 w-4" />
              <span>{COMPANY.email}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#6B6B66] text-sm">
              <MapPin className="h-4 w-4" />
              <span>Amman, Jordan &middot; United States</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
