import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن | DukanCoffee",
  description:
    "تعرف على DukanCoffee ومنهجنا في عرض أسعار ومعلومات آلات القهوة.",
};

export default function AboutPage() {
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
            من نحن
          </h1>

          <p className="mt-4 max-w-3xl leading-8 text-stone-600">
            DukanCoffee منصة تساعد المستخدم على استعراض آلات القهوة،
            مقارنة الأسعار الحالية، ومتابعة تاريخ تغير السعر بطريقة واضحة
            ومنظمة.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <article>
            <h2 className="text-2xl font-bold text-stone-900">
              هدفنا
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              نهدف إلى تسهيل البحث عن آلة القهوة المناسبة من خلال جمع
              المعلومات الأساسية والأسعار المسجلة في مكان واحد، دون
              مبالغة أو ادعاءات غير موثقة.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-stone-900">
              كيف نعرض المعلومات
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              نعرض بيانات المنتجات والأسعار كما هي متاحة من المصادر
              والمتاجر، مع توضيح السعر الحالي وتاريخ تحديثه وتغيره عند
              توفر بيانات كافية للمقارنة.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-stone-900">
              نطاق الخدمة
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              يبدأ DukanCoffee بخدمة السوق السعودي، مع الاستعداد للتوسع
              لاحقًا إلى بقية دول الخليج.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-stone-900">
              ملاحظة مهمة
            </h2>

            <p className="mt-4 leading-8 text-stone-600">
              الأسعار والتوفر قد يتغيران لدى المتجر في أي وقت، لذلك يجب
              التحقق من السعر النهائي وشروط الشراء في صفحة المتجر قبل
              إتمام الطلب.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}