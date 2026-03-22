'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { LanguageToggle } from '@/components/ui/language-toggle';

const CONTENT = {
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: March 21, 2026',
    sections: [
      {
        title: '1. Introduction',
        content: 'STEADYWRK LLC ("STEADYWRK," "we," "our," or "us") is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and share your information when you use our website at steadywrk.app and related services. We comply with Jordan\'s Personal Data Protection Law No. 24 of 2023 (PDPL) and applicable international data protection standards.',
      },
      {
        title: '2. Data We Collect',
        content: 'We collect the following categories of personal data:',
        list: [
          'Application data: name, email address, phone number, CV, portfolio URLs, assessment responses, and other information you provide when applying for roles or programs.',
          'Analytics data: anonymized usage data including pages visited, time spent, browser type, device information, and referral source. Collected via PostHog, Vercel Analytics, and Ahrefs.',
          'Contact data: name and email address when you reach out via our contact form or WhatsApp.',
          'Authentication data: email address and basic profile information when you create an account via Clerk.',
        ],
      },
      {
        title: '3. How We Use Your Data',
        list: [
          'Hiring evaluation: reviewing applications, conducting assessments, and making hiring decisions.',
          'Platform improvement: analyzing usage patterns to improve our website, content, and user experience.',
          'Communication: responding to inquiries, sending application status updates, and sharing relevant career opportunities.',
          'Legal compliance: fulfilling our obligations under Jordanian law, including the PDPL.',
        ],
      },
      {
        title: '4. Data Retention',
        content: 'Application data is retained for a maximum of 12 months from the date of submission, after which it is automatically deleted unless you are hired or provide explicit consent to retain your information for future opportunities. Analytics data is anonymized and aggregated, and does not contain personally identifiable information. You may request deletion of your data at any time by contacting us at privacy@steadywrk.app.',
      },
      {
        title: '5. Data Sharing',
        content: 'We do not sell your personal data. We may share your data with: hiring managers within STEADYWRK for recruitment purposes; service providers who assist with our operations (hosting, analytics, authentication), subject to appropriate data processing agreements; and legal authorities when required by law. All third-party service providers are contractually bound to handle your data in compliance with applicable data protection regulations.',
      },
      {
        title: '6. Your Rights Under PDPL',
        content: 'Under Jordan\'s Personal Data Protection Law No. 24 of 2023, you have the right to:',
        list: [
          'Access your personal data that we hold.',
          'Request correction of inaccurate or incomplete data.',
          'Request deletion of your personal data.',
          'Withdraw consent for data processing at any time.',
          'Object to processing of your data for specific purposes.',
          'Request a copy of your data in a portable format.',
        ],
      },
      {
        title: '7. Security',
        content: 'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes encryption in transit (TLS), secure hosting infrastructure, and access controls limiting data access to authorized personnel only.',
      },
      {
        title: '8. Contact',
        content: 'For privacy-related inquiries, data access requests, or to exercise your rights under the PDPL, contact us at: privacy@steadywrk.app',
        extra: 'STEADYWRK LLC, Building 15, King Hussein Business Park, Amman, Jordan.',
      },
    ]
  },
  ar: {
    title: 'سياسة الخصوصية',
    lastUpdated: 'آخر تحديث: 21 مارس 2026',
    sections: [
      {
        title: '1. المقدمة',
        content: 'تلتزم شركة ستيدي وورك (STEADYWRK LLC) ("ستيدي وورك"، "نحن"، "لنا") بحماية بياناتك الشخصية. تشرح سياسة الخصوصية هذه كيف نقوم بجمع معلوماتك واستخدامها وتخزينها ومشاركتها عند استخدامك لموقعنا الإلكتروني steadywrk.app والخدمات ذات الصلة. نحن نلتزم بقانون حماية البيانات الشخصية الأردني رقم 24 لسنة 2023 (PDPL) ومعايير حماية البيانات الدولية المعمول بها.',
      },
      {
        title: '2. البيانات التي نجمعها',
        content: 'نقوم بجمع الفئات التالية من البيانات الشخصية:',
        list: [
          'بيانات التقديم: الاسم، عنوان البريد الإلكتروني، رقم الهاتف، السيرة الذاتية، روابط حافظة الأعمال، الإجابات على التقييمات، وأي معلومات أخرى تقدمها عند التقدم للوظائف أو البرامج.',
          'بيانات التحليلات: بيانات الاستخدام مجهولة المصدر بما في ذلك الصفحات التي تمت زيارتها، والوقت المستغرق، ونوع المتصفح، ومعلومات الجهاز، ومصدر الإحالة. يتم جمعها عبر PostHog و Vercel Analytics و Ahrefs.',
          'بيانات الاتصال: الاسم وعنوان البريد الإلكتروني عند التواصل معنا عبر نموذج الاتصال أو واتساب.',
          'بيانات المصادقة: عنوان البريد الإلكتروني ومعلومات الملف الشخصي الأساسية عند إنشاء حساب عبر Clerk.',
        ],
      },
      {
        title: '3. كيف نستخدم بياناتك',
        list: [
          'تقييم التوظيف: مراجعة الطلبات، وإجراء التقييمات، واتخاذ قرارات التوظيف.',
          'تحسين المنصة: تحليل أنماط الاستخدام لتحسين موقعنا الإلكتروني والمحتوى وتجربة المستخدم.',
          'التواصل: الرد على الاستفسارات، وإرسال تحديثات حالة الطلب، ومشاركة فرص العمل ذات الصلة.',
          'الامتثال القانوني: الوفاء بالتزاماتنا بموجب القانون الأردني، بما في ذلك قانون حماية البيانات الشخصية.',
        ],
      },
      {
        title: '4. الاحتفاظ بالبيانات',
        content: 'يتم الاحتفاظ ببيانات الطلبات لمدة أقصاها 12 شهرًا من تاريخ التقديم، وبعد ذلك يتم حذفها تلقائيًا ما لم يتم تعيينك أو ما لم تقدم موافقة صريحة للاحتفاظ ببياناتك للفرص المستقبلية. بيانات التحليلات مجهولة المصدر ومجمعة، ولا تحتوي على معلومات تعريف شخصية. يمكنك طلب حذف بياناتك في أي وقت عن طريق الاتصال بنا على privacy@steadywrk.app.',
      },
      {
        title: '5. مشاركة البيانات',
        content: 'نحن لا نبيع بياناتك الشخصية. قد نشارك بياناتك مع: مديري التوظيف داخل ستيدي وورك لأغراض التوظيف؛ مزودي الخدمات الذين يساعدون في عملياتنا (الاستضافة، التحليلات، المصادقة)، وفقًا لاتفاقيات معالجة البيانات المناسبة؛ والسلطات القانونية عندما يقتضي القانون ذلك. جميع مزودي الخدمات التابعين لجهات خارجية ملزمون تعاقديًا بالتعامل مع بياناتك وفقًا للوائح حماية البيانات المعمول بها.',
      },
      {
        title: '6. حقوقك بموجب قانون حماية البيانات الشخصية',
        content: 'بموجب قانون حماية البيانات الشخصية الأردني رقم 24 لسنة 2023، لديك الحق في:',
        list: [
          'الوصول إلى بياناتك الشخصية التي نحتفظ بها.',
          'طلب تصحيح البيانات غير الدقيقة أو غير المكتملة.',
          'طلب حذف بياناتك الشخصية.',
          'سحب الموافقة على معالجة البيانات في أي وقت.',
          'الاعتراض على معالجة بياناتك لأغراض محددة.',
          'طلب نسخة من بياناتك بتنسيق قابل للنقل.',
        ],
      },
      {
        title: '7. الأمان',
        content: 'نحن ننفذ تدابير فنية وتنظيمية مناسبة لحماية بياناتك الشخصية من الوصول غير المصرح به أو التغيير أو الإفصاح أو الإتلاف. يشمل ذلك التشفير أثناء النقل (TLS)، والبنية التحتية الآمنة للاستضافة، وضوابط الوصول التي تقصر الوصول إلى البيانات على الموظفين المصرح لهم فقط.',
      },
      {
        title: '8. اتصل بنا',
        content: 'للاستفسارات المتعلقة بالخصوصية، أو طلبات الوصول إلى البيانات، أو لممارسة حقوقك بموجب قانون حماية البيانات الشخصية، اتصل بنا على: privacy@steadywrk.app',
        extra: 'STEADYWRK LLC، المبنى 15، مجمع الملك حسين للأعمال، عمّان، الأردن.',
      },
    ]
  }
};

export function PrivacyContent() {
  return (
    <LanguageToggle>
      {(lang) => {
        const t = CONTENT[lang];
        return (
          <div className="max-w-3xl mx-auto">
            <div dir="ltr" className="mb-6">
              <Breadcrumbs />
            </div>

            <h1
              className="text-[clamp(2rem,1.2rem+2.5vw,3.5rem)] font-bold text-[#23211D] leading-[1.08] tracking-[-0.02em] mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t.title}
            </h1>
            <p className="text-[14px] text-[#6B6B66] mb-12">
              {t.lastUpdated}
            </p>

            <div className="space-y-10 text-[#23211D]" style={{ fontFamily: 'var(--font-body)' }}>
              {t.sections.map((section, idx) => (
                <section key={idx}>
                  <h2
                    className="text-[20px] font-bold mb-3"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {section.title}
                  </h2>
                  {section.content && (
                    <p className="text-[16px] leading-relaxed text-[#6E695F] mb-3">
                      {section.content}
                    </p>
                  )}
                  {section.list && (
                    <ul className="space-y-2">
                      {section.list.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="flex items-start gap-3 text-[15px] text-[#6E695F] leading-relaxed"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E58A0F] mt-2 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.extra && (
                    <p className="text-[16px] leading-relaxed text-[#6E695F] mt-2">
                      {section.extra}
                    </p>
                  )}
                </section>
              ))}
            </div>
          </div>
        );
      }}
    </LanguageToggle>
  );
}
