import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'شروط الاستخدام',
  description: 'شروط استخدام منصة STEADYWRK - الشروط والأحكام القانونية',
  alternates: {
    canonical: '/ar/terms',
    languages: {
      en: '/terms',
      ar: '/ar/terms',
    },
  },
  openGraph: {
    title: 'شروط الاستخدام | STEADYWRK',
    locale: 'ar_JO',
    alternateLocale: 'en_US',
  },
};

export default function ArabicTermsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-[#111110]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-3xl font-bold text-[#23211D] dark:text-[#E8E8E6]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            شروط الاستخدام
          </h1>
          <Link href="/terms" className="text-sm text-[#E58A0F] hover:underline">
            English Version
          </Link>
        </div>

        <p className="text-sm text-[#6E695F] dark:text-[#8A8A86] mb-12">آخر تحديث: ١ مارس ٢٠٢٦</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none text-[#3D3A34] dark:text-[#C4C4C0] leading-relaxed space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">
              ١. القبول
            </h2>
            <p>
              باستخدامك لمنصة steadywrk.app، فإنك توافق على هذه الشروط. إذا لم توافق، يرجى عدم
              استخدام المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">
              ٢. الخدمات
            </h2>
            <p>
              توفر STEADYWRK منصة للتوظيف تربط المواهب الأردنية بفرص العمل في مجالات الذكاء
              الاصطناعي والتكنولوجيا وتعهيد العمليات التجارية.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">
              ٣. حسابات المستخدمين
            </h2>
            <p>
              أنت مسؤول عن الحفاظ على سرية بيانات حسابك. يجب أن تكون المعلومات المقدمة دقيقة وكاملة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">
              ٤. التقديم على الوظائف
            </h2>
            <p>
              بتقديم طلب توظيف، فإنك تقر بأن جميع المعلومات صحيحة وتمنح STEADYWRK الإذن بمعالجة
              بياناتك وفقاً لسياسة الخصوصية.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">
              ٥. الملكية الفكرية
            </h2>
            <p>
              جميع محتويات المنصة، بما في ذلك التصميم والشعارات والنصوص، هي ملكية فكرية لشركة
              STEADYWRK ذ.م.م.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">
              ٦. السلوك المحظور
            </h2>
            <p>
              يُحظر: تقديم معلومات كاذبة، إساءة استخدام المنصة، محاولة الوصول غير المصرح به، أو أي
              سلوك يضر بالمستخدمين الآخرين.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">
              ٧. إخلاء المسؤولية
            </h2>
            <p>
              لا تضمن STEADYWRK الحصول على وظيفة. المنصة توفر أدوات وفرص التقديم، لكن قرارات التوظيف
              تعود لأصحاب العمل.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">
              ٨. تحديد المسؤولية
            </h2>
            <p>
              مسؤولية STEADYWRK محدودة بالحد الأقصى المسموح به قانونياً. لا نتحمل مسؤولية الأضرار غير
              المباشرة أو التبعية.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">
              ٩. الإنهاء
            </h2>
            <p>
              يمكننا تعليق أو إنهاء حسابك في حالة انتهاك هذه الشروط. يمكنك حذف حسابك في أي وقت عبر
              التواصل معنا.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">
              ١٠. القانون الحاكم
            </h2>
            <p>
              تخضع هذه الشروط لقوانين المملكة الأردنية الهاشمية. تختص محاكم عمّان بالفصل في أي نزاع.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#23211D] dark:text-[#E8E8E6] mb-4">
              ١١. التواصل
            </h2>
            <p>
              للاستفسارات: legal@steadywrk.app. المقر: مبنى ١٥، مجمع الملك حسين للأعمال، عمّان،
              الأردن.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
