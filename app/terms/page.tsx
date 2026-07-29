import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام | DukanCoffee",
  description:
    "تعرف على شروط وأحكام استخدام موقع DukanCoffee.",
};

export default function TermsPage() {
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
            الشروط والأحكام
          </h1>

          <p className="mt-4 max-w-3xl leading-8 text-stone-600">
            تحدد هذه الشروط القواعد العامة لاستخدام موقع DukanCoffee
            والمعلومات والخدمات المتاحة من خلاله.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <article>
            <h2 className="text-2xl font-bold">
              استخدام الموقع
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              يمكن استخدام الموقع لاستعراض آلات القهوة، الأسعار،
              المواصفات، وتاريخ تغير الأسعار. يجب استخدام الموقع بصورة
              مشروعة ودون محاولة تعطيله أو إساءة استخدامه.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold">
              دقة المعلومات
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              نبذل جهدًا لعرض معلومات واضحة وحديثة، إلا أن الأسعار،
              التوفر، المواصفات، والعروض قد تتغير لدى المتجر أو الشركة
              المصنعة دون إشعار مسبق.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold">
              الأسعار وعمليات الشراء
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              لا يبيع DukanCoffee المنتجات مباشرة. تتم عمليات الشراء
              من خلال المتجر الخارجي، ويكون السعر النهائي وشروط الدفع
              والشحن والاسترجاع خاضعة لذلك المتجر.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold">
              الروابط التسويقية
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              قد يحتوي الموقع على روابط تسويقية. قد يحصل DukanCoffee
              على عمولة عند إتمام عملية شراء مؤهلة من خلال بعض هذه
              الروابط، دون إضافة تكلفة مباشرة على المستخدم.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold">
              المواقع الخارجية
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              لا يتحكم DukanCoffee في محتوى أو سياسات أو خدمات المواقع
              والمتاجر الخارجية، ولا يتحمل مسؤولية أي تعامل يتم خارج
              الموقع.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold">
              الملكية الفكرية
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              تصميم الموقع، النصوص الأصلية، وطريقة تنظيم المحتوى مملوكة
              لـ DukanCoffee ما لم يذكر خلاف ذلك. تبقى أسماء المنتجات
              والعلامات التجارية والصور مملوكة لأصحابها.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold">
              حدود المسؤولية
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              يستخدم الزائر المعلومات المتاحة على مسؤوليته. يجب التحقق
              من السعر والمواصفات والتوفر وشروط الشراء مباشرة في صفحة
              المتجر قبل اتخاذ قرار الشراء.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold">
              تحديث الشروط
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              قد يتم تعديل هذه الشروط عند تطوير الموقع أو إضافة خدمات
              جديدة. تصبح النسخة المنشورة في هذه الصفحة هي النسخة
              المعتمدة عند تحديثها.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold">
              التواصل
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              يمكن إرسال الاستفسارات المتعلقة بهذه الشروط من خلال صفحة
              التواصل في الموقع.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}