import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'STEADYWRK terms of service — the rules and conditions governing your use of our platform.',
  alternates: {
    canonical: 'https://steadywrk.app/terms',
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <section className="py-20 md:py-28 px-6 bg-[#FAFAF8]">
          <div className="max-w-3xl mx-auto">
            <Breadcrumbs />

            <h1
              className="text-[clamp(2rem,1.2rem+2.5vw,3.5rem)] font-bold text-[#23211D] leading-[1.08] tracking-[-0.02em] mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Terms of Service
            </h1>
            <p className="text-[14px] text-[#6B6B66] mb-12">
              Last updated: March 21, 2026
            </p>

            <div className="space-y-10 text-[#23211D]" style={{ fontFamily: 'var(--font-body)' }}>
              <section>
                <h2
                  className="text-[20px] font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  1. Acceptance of Terms
                </h2>
                <p className="text-[16px] leading-relaxed text-[#6E695F]">
                  By accessing or using the STEADYWRK website at steadywrk.app and any related
                  services (collectively, the &ldquo;Platform&rdquo;), you agree to be bound by
                  these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms,
                  you must not use the Platform. STEADYWRK LLC (&ldquo;STEADYWRK,&rdquo;
                  &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) reserves the right to
                  update these Terms at any time. Continued use of the Platform after changes
                  constitutes acceptance of the revised Terms.
                </p>
              </section>

              <section>
                <h2
                  className="text-[20px] font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  2. Eligibility
                </h2>
                <p className="text-[16px] leading-relaxed text-[#6E695F]">
                  You must be at least 18 years of age to use the Platform. By using the Platform,
                  you represent and warrant that you are at least 18 years old and have the legal
                  capacity to enter into these Terms. If you are using the Platform on behalf of an
                  organization, you represent that you have the authority to bind that organization
                  to these Terms.
                </p>
              </section>

              <section>
                <h2
                  className="text-[20px] font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  3. Account Terms
                </h2>
                <p className="text-[16px] leading-relaxed text-[#6E695F]">
                  Certain features of the Platform may require you to create an account. You are
                  responsible for maintaining the confidentiality of your account credentials and for
                  all activities that occur under your account. You agree to provide accurate and
                  complete information when creating your account and to update your information as
                  needed. You must notify us immediately of any unauthorized use of your account.
                  STEADYWRK is not liable for any loss or damage arising from your failure to
                  maintain the security of your account.
                </p>
              </section>

              <section>
                <h2
                  className="text-[20px] font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  4. Acceptable Use
                </h2>
                <p className="text-[16px] leading-relaxed text-[#6E695F] mb-3">
                  You agree not to use the Platform to:
                </p>
                <ul className="space-y-2">
                  {[
                    'Submit false, misleading, or fraudulent information in applications or any other forms.',
                    'Violate any applicable local, national, or international law or regulation.',
                    'Infringe upon the intellectual property rights of STEADYWRK or any third party.',
                    'Attempt to gain unauthorized access to the Platform, other accounts, or any related systems or networks.',
                    'Transmit any viruses, malware, or other harmful code.',
                    'Use automated systems (bots, scrapers) to access or interact with the Platform without express written permission.',
                    'Harass, abuse, or threaten other users or STEADYWRK team members.',
                  ].map((item) => (
                    <li
                      key={item.slice(0, 30)}
                      className="flex items-start gap-3 text-[15px] text-[#6E695F] leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E58A0F] mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2
                  className="text-[20px] font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  5. Intellectual Property
                </h2>
                <p className="text-[16px] leading-relaxed text-[#6E695F]">
                  All content on the Platform, including but not limited to text, graphics, logos,
                  icons, images, audio, video, software, and the design and arrangement thereof, is
                  the property of STEADYWRK LLC or its licensors and is protected by copyright,
                  trademark, and other intellectual property laws. You may not reproduce, distribute,
                  modify, create derivative works of, publicly display, or otherwise exploit any
                  content on the Platform without our express written consent. Content you submit
                  (applications, assessments) remains your property, but you grant STEADYWRK a
                  non-exclusive license to use it for recruitment and platform improvement purposes.
                </p>
              </section>

              <section>
                <h2
                  className="text-[20px] font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  6. Application and Hiring
                </h2>
                <p className="text-[16px] leading-relaxed text-[#6E695F]">
                  Submitting an application through the Platform does not guarantee employment or
                  placement in any program. STEADYWRK reserves the right to accept or reject any
                  application at its sole discretion. All hiring decisions are made based on
                  qualifications, skills, and organizational needs. We are committed to fair and
                  transparent hiring practices as described in our public-facing process
                  documentation.
                </p>
              </section>

              <section>
                <h2
                  className="text-[20px] font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  7. Limitation of Liability
                </h2>
                <p className="text-[16px] leading-relaxed text-[#6E695F]">
                  To the maximum extent permitted by law, STEADYWRK LLC and its officers, directors,
                  employees, and agents shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages, or any loss of profits, data, goodwill, or
                  other intangible losses, resulting from your use of or inability to use the
                  Platform, even if we have been advised of the possibility of such damages. Our
                  total liability to you for any claims arising from your use of the Platform shall
                  not exceed the amount you have paid to us, if any, in the twelve months preceding
                  the claim.
                </p>
              </section>

              <section>
                <h2
                  className="text-[20px] font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  8. Disclaimer of Warranties
                </h2>
                <p className="text-[16px] leading-relaxed text-[#6E695F]">
                  The Platform is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
                  basis without warranties of any kind, either express or implied, including but not
                  limited to implied warranties of merchantability, fitness for a particular purpose,
                  and non-infringement. STEADYWRK does not warrant that the Platform will be
                  uninterrupted, error-free, or secure.
                </p>
              </section>

              <section>
                <h2
                  className="text-[20px] font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  9. Governing Law
                </h2>
                <p className="text-[16px] leading-relaxed text-[#6E695F]">
                  These Terms shall be governed by and construed in accordance with the laws of the
                  Hashemite Kingdom of Jordan. Any disputes arising from or relating to these Terms
                  or your use of the Platform shall be subject to the exclusive jurisdiction of the
                  courts of Amman, Jordan.
                </p>
              </section>

              <section>
                <h2
                  className="text-[20px] font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  10. Termination
                </h2>
                <p className="text-[16px] leading-relaxed text-[#6E695F]">
                  We may suspend or terminate your access to the Platform at any time, with or
                  without cause, and with or without notice. Upon termination, your right to use the
                  Platform will immediately cease. All provisions of these Terms that by their nature
                  should survive termination shall survive, including intellectual property
                  provisions, disclaimers, and limitations of liability.
                </p>
              </section>

              <section>
                <h2
                  className="text-[20px] font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  11. Contact
                </h2>
                <p className="text-[16px] leading-relaxed text-[#6E695F]">
                  For questions about these Terms of Service, contact us at:{' '}
                  <a
                    href="mailto:legal@steadywrk.app"
                    className="text-[#E58A0F] hover:text-[#CC7408] underline underline-offset-2"
                  >
                    legal@steadywrk.app
                  </a>
                </p>
                <p className="text-[16px] leading-relaxed text-[#6E695F] mt-2">
                  STEADYWRK LLC, Building 15, King Hussein Business Park, Amman, Jordan.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
