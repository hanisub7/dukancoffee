import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | DukanCoffee",
  description:
    "تعرف على سياسة الخصوصية في DukanCoffee وكيفية التعامل مع بيانات المستخدم.",
};

export default function PrivacyPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-white text-stone-900"
    >
      <section className="border-b border-stone-200 bg-stone-50">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-orange-700">
            DukanCoffee
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            سياسة الخصوصية
          </h1>

          <p className="mt-4 max-w-3xl leading-8 text-stone-600">
            توضح هذه الصفحة بصورة عامة كيفية تعامل DukanCoffee مع
            المعلومات التي قد يتم جمعها عند استخدام الموقع.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <article>
            <h2 className="text-2xl font-bold">
              المعلومات التي قد نجمعها
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              قد نجمع معلومات تقنية عامة مثل نوع الجهاز، المتصفح،
              الصفحات التي تمت زيارتها، وبيانات الاستخدام الأساسية
              اللازمة لتحسين أداء الموقع وتجربة المستخدم.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold">
              استخدام المعلومات
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              تستخدم المعلومات لتحسين الموقع، فهم طريقة استخدام الصفحات،
              معالجة المشكلات التقنية، وتطوير الخدمات والمحتوى المعروض.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold">
              ملفات تعريف الارتباط
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              قد يستخدم الموقع ملفات تعريف الارتباط أو تقنيات مشابهة
              لتشغيل بعض الخصائص، حفظ التفضيلات، وقياس أداء الموقع.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold">
              الروابط الخارجية
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              قد يحتوي DukanCoffee على روابط تؤدي إلى متاجر أو مواقع
              خارجية. تخضع تلك المواقع لسياسات الخصوصية الخاصة بها،
              ولا يتحكم DukanCoffee في طريقة تعاملها مع البيانات.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold">
              الروابط التسويقية
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              قد تكون بعض الروابط روابط تسويقية، وقد يحصل DukanCoffee
              على عمولة عند إتمام عملية شراء مؤهلة من خلال هذه الروابط،
              دون زيادة السعر على المستخدم.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold">
              تحديث السياسة
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              قد يتم تحديث هذه السياسة عند إضافة خدمات أو أدوات جديدة.
              وسيتم نشر النسخة المحدثة في هذه الصفحة.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold">
              التواصل
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              يمكن إرسال الاستفسارات المتعلقة بالخصوصية من خلال صفحة
              التواصل في الموقع.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}