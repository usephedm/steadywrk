import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية',
  description: 'سياسة الخصوصية لشركة STEADYWRK ذ.م.م - حماية البيانات الشخصية وفقاً لقانون حماية البيانات الشخصية الأردني رقم 24 لسنة 2023',
  alternates: {
    canonical: '/ar/privacy',
    languages: {
      'en': '/privacy',
      'ar': '/ar/privacy',
    },
  },
  openGraph: {
    title: 'سياسة الخصوصية | STEADYWRK',
    locale: 'ar_JO',
    alternateLocale: 'en_US',
  },
};

export default function ArabicPrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-[#111110]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#23211D] dark:text-[#E8E8E6]" style={{ fontFamily: 'var(--font-display)' }}>
            سياسة الخصوصية
          </h1>
          <Link
            href="/privacy"
            className="text-sm text-[#E58A0F] hover:underline"
          >
            English Version
          </Link>
        </div>

        <p className="text-sm text-[#6E695F] dark:text-[#8A8A86] mb-12">
          آخر تحديث: ١ مارس ٢٠٢٦
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none text-[#3D3A34] dark:text-[#C4C4C0] leading-relaxed space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">١. مقدمة</h2>
            <p>
              شركة STEADYWRK ذ.م.م (&ldquo;نحن&rdquo; أو &ldquo;الشركة&rdquo;) ملتزمة بحماية بياناتك الشخصية وفقاً لقانون حماية البيانات الشخصية الأردني رقم ٢٤ لسنة ٢٠٢٣ (PDPL). تصف هذه السياسة كيفية جمع بياناتك واستخدامها وحمايتها.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">٢. البيانات التي نجمعها</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>الاسم الكامل وعنوان البريد الإلكتروني</li>
              <li>رقم الهاتف والسيرة الذاتية</li>
              <li>الإجابات على أسئلة التقديم</li>
              <li>بيانات التصفح والتحليلات (عبر PostHog)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">٣. كيف نستخدم بياناتك</h2>
            <p>نستخدم بياناتك لـ: معالجة طلبات التوظيف، التواصل معك بشأن فرص العمل، تحسين خدماتنا، والامتثال للمتطلبات القانونية.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">٤. حقوقك (المادة ١٢ من القانون)</h2>
            <p>لديك الحق في: الوصول إلى بياناتك، تصحيحها، حذفها، تقييد معالجتها، ونقلها. لممارسة هذه الحقوق، تواصل معنا عبر privacy@steadywrk.app.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">٥. الاحتفاظ بالبيانات (المادة ١٤)</h2>
            <p>نحتفظ ببياناتك لمدة ١٢ شهراً من تاريخ التقديم. بعد ذلك، يتم حذفها تلقائياً ما لم تكن موظفاً نشطاً.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">٦. أمن البيانات</h2>
            <p>نستخدم تشفير TLS وقواعد بيانات مشفرة والتحكم في الوصول المبني على الأدوار لحماية بياناتك.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">٧. مسؤول حماية البيانات</h2>
            <p>مسؤول حماية البيانات لدينا متاح عبر privacy@steadywrk.app. المقر: مبنى ١٥، مجمع الملك حسين للأعمال، عمّان، الأردن.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">٨. التعديلات</h2>
            <p>قد نحدّث هذه السياسة بشكل دوري. سيتم نشر أي تغييرات على هذه الصفحة مع تاريخ التحديث.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
