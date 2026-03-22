'use client';

import { LanguageToggle } from '@/components/ui/language-toggle';

export function PrivacyContent() {
  return (
    <LanguageToggle>
      {(lang) =>
        lang === 'en' ? (
          <div className="space-y-10 text-[#23211D]" style={{ fontFamily: 'var(--font-body)' }}>
            <section>
              <h2
                className="text-[20px] font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                1. Introduction
              </h2>
              <p className="text-[16px] leading-relaxed text-[#6E695F]">
                STEADYWRK LLC (&ldquo;STEADYWRK,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or
                &ldquo;us&rdquo;) is committed to protecting your personal data. This Privacy Policy
                explains how we collect, use, store, and share your information when you use our
                website at steadywrk.app and related services. We comply with Jordan&rsquo;s
                Personal Data Protection Law No. 24 of 2023 (PDPL) and applicable international data
                protection standards.
              </p>
            </section>

            <section>
              <h2
                className="text-[20px] font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                2. Data We Collect
              </h2>
              <p className="text-[16px] leading-relaxed text-[#6E695F] mb-3">
                We collect the following categories of personal data:
              </p>
              <ul className="space-y-2">
                {[
                  'Application data: name, email address, phone number, CV, portfolio URLs, assessment responses, and other information you provide when applying for roles or programs.',
                  'Analytics data: anonymized usage data including pages visited, time spent, browser type, device information, and referral source. Collected via PostHog and Ahrefs.',
                  'Contact data: name and email address when you reach out via our contact form or WhatsApp.',
                  'Authentication data: email address and basic profile information when you create an account via Clerk.',
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
                3. How We Use Your Data
              </h2>
              <ul className="space-y-2">
                {[
                  'Hiring evaluation: reviewing applications, conducting assessments, and making hiring decisions.',
                  'Platform improvement: analyzing usage patterns to improve our website, content, and user experience.',
                  'Communication: responding to inquiries, sending application status updates, and sharing relevant career opportunities.',
                  'Legal compliance: fulfilling our obligations under Jordanian law, including the PDPL.',
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
                4. Data Retention
              </h2>
              <p className="text-[16px] leading-relaxed text-[#6E695F]">
                Application data is retained for a maximum of 12 months from the date of submission,
                after which it is automatically deleted unless you are hired or provide explicit
                consent to retain your information for future opportunities. Analytics data is
                anonymized and aggregated, and does not contain personally identifiable information.
                You may request deletion of your data at any time by contacting us at{' '}
                <a
                  href="mailto:privacy@steadywrk.app"
                  className="text-[#E58A0F] hover:text-[#CC7408] underline underline-offset-2"
                >
                  privacy@steadywrk.app
                </a>
                .
              </p>
            </section>

            <section>
              <h2
                className="text-[20px] font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                5. Data Sharing
              </h2>
              <p className="text-[16px] leading-relaxed text-[#6E695F]">
                We do not sell your personal data. We may share your data with: hiring managers
                within STEADYWRK for recruitment purposes; service providers who assist with our
                operations (hosting, analytics, authentication), subject to appropriate data
                processing agreements; and legal authorities when required by law. All third-party
                service providers are contractually bound to handle your data in compliance with
                applicable data protection regulations.
              </p>
            </section>

            <section>
              <h2
                className="text-[20px] font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                6. Your Rights Under PDPL
              </h2>
              <p className="text-[16px] leading-relaxed text-[#6E695F] mb-3">
                Under Jordan&rsquo;s Personal Data Protection Law No. 24 of 2023, you have the right
                to:
              </p>
              <ul className="space-y-2">
                {[
                  'Access your personal data that we hold.',
                  'Request correction of inaccurate or incomplete data.',
                  'Request deletion of your personal data.',
                  'Withdraw consent for data processing at any time.',
                  'Object to processing of your data for specific purposes.',
                  'Request a copy of your data in a portable format.',
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
                7. Security
              </h2>
              <p className="text-[16px] leading-relaxed text-[#6E695F]">
                We implement appropriate technical and organizational measures to protect your
                personal data against unauthorized access, alteration, disclosure, or destruction.
                This includes encryption in transit (TLS), secure hosting infrastructure, and access
                controls limiting data access to authorized personnel only.
              </p>
            </section>

            <section>
              <h2
                className="text-[20px] font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                8. Contact
              </h2>
              <p className="text-[16px] leading-relaxed text-[#6E695F]">
                For privacy-related inquiries, data access requests, or to exercise your rights
                under the PDPL, contact us at:{' '}
                <a
                  href="mailto:privacy@steadywrk.app"
                  className="text-[#E58A0F] hover:text-[#CC7408] underline underline-offset-2"
                >
                  privacy@steadywrk.app
                </a>
              </p>
              <p className="text-[16px] leading-relaxed text-[#6E695F] mt-2">
                STEADYWRK LLC, Building 15, King Hussein Business Park, Amman, Jordan.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-10 text-[#23211D]" style={{ fontFamily: 'var(--font-body)' }}>
            <section>
              <h2
                className="text-[20px] font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                1. المقدمة
              </h2>
              <p className="text-[16px] leading-relaxed text-[#6E695F]">
                شركة STEADYWRK ملتزمة بحماية خصوصيتك. تشرح سياسة الخصوصية هذه كيفية جمع واستخدام
                وتخزين ومشاركة معلوماتك عند استخدام موقعنا steadywrk.app والخدمات ذات الصلة. نلتزم
                بقانون حماية البيانات الشخصية الأردني رقم 24 لسنة 2023.
              </p>
            </section>

            <section>
              <h2
                className="text-[20px] font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                2. البيانات التي نجمعها
              </h2>
              <p className="text-[16px] leading-relaxed text-[#6E695F] mb-3">
                نجمع الفئات التالية من البيانات الشخصية:
              </p>
              <ul className="space-y-2">
                {[
                  'بيانات التطبيق: الاسم، البريد الإلكتروني، رقم الهاتف، السيرة الذاتية.',
                  'بيانات التحليل: بيانات الاستخدام المجهولة.',
                  'بيانات الاتصال: عند التواصل عبر نموذج الاتصال.',
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
                3. كيف نستخدم بياناتك
              </h2>
              <ul className="space-y-2">
                {['تقييم التوظيف.', 'تحسين الخدمات.', 'الامتثال القانوني.', 'منع الاحتيال.'].map(
                  (item) => (
                    <li
                      key={item.slice(0, 30)}
                      className="flex items-start gap-3 text-[15px] text-[#6E695F] leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E58A0F] mt-2 shrink-0" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </section>

            <section>
              <h2
                className="text-[20px] font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                4. الاحتفاظ بالبيانات
              </h2>
              <p className="text-[16px] leading-relaxed text-[#6E695F]">
                نحتفظ ببيانات المتقدمين لمدة 12 شهراً ثم يتم حذفها تلقائياً. بيانات الموظفين تُحتفظ
                طوال فترة العمل. يمكنك طلب حذف بياناتك في أي وقت عبر التواصل معنا على{' '}
                <a
                  href="mailto:privacy@steadywrk.app"
                  className="text-[#E58A0F] hover:text-[#CC7408] underline underline-offset-2"
                >
                  privacy@steadywrk.app
                </a>
                .
              </p>
            </section>

            <section>
              <h2
                className="text-[20px] font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                5. أطراف ثالثة
              </h2>
              <p className="text-[16px] leading-relaxed text-[#6E695F]">
                لا نبيع بياناتك الشخصية. نشارك بياناتك مع مقدمي خدمات موثوقين: Clerk للمصادقة، Neon
                لقواعد البيانات، Resend للبريد الإلكتروني، PostHog للتحليلات. جميع مقدمي الخدمات
                ملزمون تعاقدياً بالتعامل مع بياناتك وفقاً للوائح حماية البيانات المعمول بها.
              </p>
            </section>

            <section>
              <h2
                className="text-[20px] font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                6. حقوقك
              </h2>
              <p className="text-[16px] leading-relaxed text-[#6E695F] mb-3">
                بموجب قانون حماية البيانات الشخصية الأردني رقم 24 لسنة 2023، لديك الحق في:
              </p>
              <ul className="space-y-2">
                {[
                  'الوصول إلى بياناتك الشخصية.',
                  'تصحيح البيانات غير الدقيقة أو غير المكتملة.',
                  'حذف بياناتك الشخصية.',
                  'نقل بياناتك.',
                  'الاعتراض على معالجة بياناتك.',
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
              <p className="text-[16px] leading-relaxed text-[#6E695F] mt-3">
                تواصل معنا عبر{' '}
                <a
                  href="mailto:privacy@steadywrk.app"
                  className="text-[#E58A0F] hover:text-[#CC7408] underline underline-offset-2"
                >
                  privacy@steadywrk.app
                </a>
              </p>
            </section>

            <section>
              <h2
                className="text-[20px] font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                7. الأمان
              </h2>
              <p className="text-[16px] leading-relaxed text-[#6E695F]">
                نطبق إجراءات أمان تقنية وإدارية لحماية بياناتك الشخصية ضد الوصول غير المصرح به أو
                التعديل أو الإفصاح أو التدمير.
              </p>
            </section>

            <section>
              <h2
                className="text-[20px] font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                8. التواصل
              </h2>
              <p className="text-[16px] leading-relaxed text-[#6E695F]">
                لأي استفسارات حول الخصوصية أو طلبات الوصول إلى البيانات أو لممارسة حقوقك، تواصل معنا
                على:{' '}
                <a
                  href="mailto:privacy@steadywrk.app"
                  className="text-[#E58A0F] hover:text-[#CC7408] underline underline-offset-2"
                >
                  privacy@steadywrk.app
                </a>
              </p>
              <p className="text-[16px] leading-relaxed text-[#6E695F] mt-2">
                شركة STEADYWRK ذ.م.م، مبنى 15، مجمع الملك حسين للأعمال، عمّان، الأردن.
              </p>
            </section>
          </div>
        )
      }
    </LanguageToggle>
  );
}
