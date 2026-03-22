'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { LanguageToggle } from '@/components/ui/language-toggle';

const CONTENT = {
  en: {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: March 21, 2026',
    sections: [
      {
        title: '1. Acceptance of Terms',
        content: 'By accessing or using the STEADYWRK website at steadywrk.app and any related services (collectively, the "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use the Platform. STEADYWRK LLC ("STEADYWRK," "we," "our," or "us") reserves the right to update these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the revised Terms.',
      },
      {
        title: '2. Eligibility',
        content: 'You must be at least 18 years of age to use the Platform. By using the Platform, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms. If you are using the Platform on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.',
      },
      {
        title: '3. Account Terms',
        content: 'Certain features of the Platform may require you to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account and to update your information as needed. You must notify us immediately of any unauthorized use of your account. STEADYWRK is not liable for any loss or damage arising from your failure to maintain the security of your account.',
      },
      {
        title: '4. Acceptable Use',
        content: 'You agree not to use the Platform to:',
        list: [
          'Submit false, misleading, or fraudulent information in applications or any other forms.',
          'Violate any applicable local, national, or international law or regulation.',
          'Infringe upon the intellectual property rights of STEADYWRK or any third party.',
          'Attempt to gain unauthorized access to the Platform, other accounts, or any related systems or networks.',
          'Transmit any viruses, malware, or other harmful code.',
          'Use automated systems (bots, scrapers) to access or interact with the Platform without express written permission.',
          'Harass, abuse, or threaten other users or STEADYWRK team members.',
        ],
      },
      {
        title: '5. Intellectual Property',
        content: 'All content on the Platform, including but not limited to text, graphics, logos, icons, images, audio, video, software, and the design and arrangement thereof, is the property of STEADYWRK LLC or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise exploit any content on the Platform without our express written consent. Content you submit (applications, assessments) remains your property, but you grant STEADYWRK a non-exclusive license to use it for recruitment and platform improvement purposes.',
      },
      {
        title: '6. Application and Hiring',
        content: 'Submitting an application through the Platform does not guarantee employment or placement in any program. STEADYWRK reserves the right to accept or reject any application at its sole discretion. All hiring decisions are made based on qualifications, skills, and organizational needs. We are committed to fair and transparent hiring practices as described in our public-facing process documentation.',
      },
      {
        title: '7. Limitation of Liability',
        content: 'To the maximum extent permitted by law, STEADYWRK LLC and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, goodwill, or other intangible losses, resulting from your use of or inability to use the Platform, even if we have been advised of the possibility of such damages. Our total liability to you for any claims arising from your use of the Platform shall not exceed the amount you have paid to us, if any, in the twelve months preceding the claim.',
      },
      {
        title: '8. Disclaimer of Warranties',
        content: 'The Platform is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. STEADYWRK does not warrant that the Platform will be uninterrupted, error-free, or secure.',
      },
      {
        title: '9. Governing Law',
        content: 'These Terms shall be governed by and construed in accordance with the laws of the Hashemite Kingdom of Jordan. Any disputes arising from or relating to these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of Amman, Jordan.',
      },
      {
        title: '10. Termination',
        content: 'We may suspend or terminate your access to the Platform at any time, with or without cause, and with or without notice. Upon termination, your right to use the Platform will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including intellectual property provisions, disclaimers, and limitations of liability.',
      },
      {
        title: '11. Contact',
        content: 'For questions about these Terms of Service, contact us at: legal@steadywrk.app',
        extra: 'STEADYWRK LLC, Building 15, King Hussein Business Park, Amman, Jordan.',
      },
    ]
  },
  ar: {
    title: 'شروط الخدمة',
    lastUpdated: 'آخر تحديث: 21 مارس 2026',
    sections: [
      {
        title: '1. قبول الشروط',
        content: 'من خلال الوصول إلى أو استخدام موقع ستيدي وورك (steadywrk.app) وأي خدمات ذات صلة (يُشار إليها مجتمعة باسم "المنصة")، فإنك توافق على الالتزام بشروط الخدمة هذه ("الشروط"). إذا كنت لا توافق على هذه الشروط، يجب عليك عدم استخدام المنصة. تحتفظ شركة ستيدي وورك (STEADYWRK LLC) ("ستيدي وورك"، "نحن"، "لنا") بالحق في تحديث هذه الشروط في أي وقت. استمرار استخدام المنصة بعد إجراء التغييرات يشكل قبولاً للشروط المعدلة.',
      },
      {
        title: '2. الأهلية',
        content: 'يجب أن يكون عمرك 18 عامًا على الأقل لاستخدام المنصة. باستخدامك للمنصة، فإنك تقر وتضمن أنك تبلغ من العمر 18 عامًا على الأقل وتتمتع بالأهلية القانونية للموافقة على هذه الشروط. إذا كنت تستخدم المنصة نيابة عن مؤسسة، فإنك تقر بأن لديك الصلاحية لإلزام تلك المؤسسة بهذه الشروط.',
      },
      {
        title: '3. شروط الحساب',
        content: 'قد تتطلب بعض ميزات المنصة إنشاء حساب. أنت مسؤول عن الحفاظ على سرية بيانات الاعتماد الخاصة بحسابك وعن جميع الأنشطة التي تحدث تحت حسابك. توافق على تقديم معلومات دقيقة وكاملة عند إنشاء حسابك وتحديث معلوماتك عند الحاجة. يجب عليك إخطارنا فوراً بأي استخدام غير مصرح به لحسابك. ستيدي وورك ليست مسؤولة عن أي خسارة أو ضرر ينشأ عن فشلك في الحفاظ على أمان حسابك.',
      },
      {
        title: '4. الاستخدام المقبول',
        content: 'أنت توافق على عدم استخدام المنصة من أجل:',
        list: [
          'تقديم معلومات كاذبة أو مضللة أو احتيالية في الطلبات أو أي نماذج أخرى.',
          'انتهاك أي قانون أو لائحة محلية أو وطنية أو دولية معمول بها.',
          'التعدي على حقوق الملكية الفكرية لشركة ستيدي وورك أو أي طرف ثالث.',
          'محاولة الوصول غير المصرح به إلى المنصة، أو حسابات أخرى، أو أي أنظمة أو شبكات ذات صلة.',
          'نقل أي فيروسات أو برامج ضارة أو أي رموز ضارة أخرى.',
          'استخدام الأنظمة الآلية (الروبوتات، برامج الكشط) للوصول إلى المنصة أو التفاعل معها دون إذن كتابي صريح.',
          'مضايقة، أو إساءة معاملة، أو تهديد المستخدمين الآخرين أو أعضاء فريق ستيدي وورك.',
        ],
      },
      {
        title: '5. الملكية الفكرية',
        content: 'جميع المحتويات الموجودة على المنصة، بما في ذلك على سبيل المثال لا الحصر النصوص والرسومات والشعارات والأيقونات والصور والصوت والفيديو والبرامج، وتصميمها وترتيبها، هي ملك لشركة ستيدي وورك أو المرخصين لها وهي محمية بموجب حقوق النشر والعلامات التجارية وقوانين الملكية الفكرية الأخرى. لا يجوز لك إعادة إنتاج أو توزيع أو تعديل أو إنشاء أعمال مشتقة من أو عرض علني أو استغلال أي محتوى على المنصة دون موافقة كتابية صريحة منا. المحتوى الذي ترسله (الطلبات، التقييمات) يظل ملكاً لك، ولكنك تمنح ستيدي وورك ترخيصاً غير حصري لاستخدامه لأغراض التوظيف وتحسين المنصة.',
      },
      {
        title: '6. التقديم والتوظيف',
        content: 'تقديم طلب عبر المنصة لا يضمن التوظيف أو التنسيب في أي برنامج. تحتفظ ستيدي وورك بالحق في قبول أو رفض أي طلب وفقًا لتقديرها الخاص. يتم اتخاذ جميع قرارات التوظيف بناءً على المؤهلات والمهارات والاحتياجات التنظيمية. نحن ملتزمون بممارسات التوظيف العادلة والشفافة كما هو موضح في وثائق العمليات العامة لدينا.',
      },
      {
        title: '7. الحد من المسؤولية',
        content: 'إلى أقصى حد يسمح به القانون، لن تكون شركة ستيدي وورك ومسؤولوها ومديروها وموظفوها ووكلاؤها مسؤولين عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية، أو أي خسارة في الأرباح أو البيانات أو السمعة الطيبة، أو غيرها من الخسائر غير الملموسة، الناتجة عن استخدامك أو عدم قدرتك على استخدام المنصة، حتى لو تم إبلاغنا بإمكانية حدوث مثل هذه الأضرار. لن يتجاوز إجمالي التزامنا تجاهك عن أي مطالبات تنشأ عن استخدامك للمنصة المبلغ الذي دفعته لنا، إن وجد، في الأشهر الاثني عشر السابقة للمطالبة.',
      },
      {
        title: '8. إخلاء المسؤولية من الضمانات',
        content: 'يتم توفير المنصة على أساس "كما هي" و"كما هي متاحة" دون ضمانات من أي نوع، سواء صريحة أو ضمنية، بما في ذلك على سبيل المثال لا الحصر الضمانات الضمنية للتسويق والملاءمة لغرض معين وعدم الانتهاك. لا تضمن ستيدي وورك أن المنصة ستكون غير منقطعة أو خالية من الأخطاء أو آمنة.',
      },
      {
        title: '9. القانون الحاكم',
        content: 'تخضع هذه الشروط وتفسر وفقًا لقوانين المملكة الأردنية الهاشمية. تخضع أي نزاعات تنشأ عن أو تتعلق بهذه الشروط أو استخدامك للمنصة للاختصاص الحصري لمحاكم عمّان، الأردن.',
      },
      {
        title: '10. الإنهاء',
        content: 'يجوز لنا تعليق أو إنهاء وصولك إلى المنصة في أي وقت، بسبب أو بدون سبب، وبإشعار أو بدونه. عند الإنهاء، سيتوقف حقك في استخدام المنصة على الفور. جميع أحكام هذه الشروط التي يجب بطبيعتها أن تبقى سارية المفعول بعد الإنهاء ستظل سارية، بما في ذلك أحكام الملكية الفكرية وإخلاء المسؤولية وحدود المسؤولية.',
      },
      {
        title: '11. اتصل بنا',
        content: 'للاستفسارات حول شروط الخدمة هذه، اتصل بنا على: legal@steadywrk.app',
        extra: 'STEADYWRK LLC، المبنى 15، مجمع الملك حسين للأعمال، عمّان، الأردن.',
      },
    ]
  }
};

export function TermsContent() {
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
