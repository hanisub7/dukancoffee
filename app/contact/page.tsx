import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا | DukanCoffee",
  description: "تواصل مع فريق DukanCoffee.",
};

export default function ContactPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-white text-stone-900"
    >
      <section className="border-b border-stone-200 bg-stone-50">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">
            تواصل معنا
          </h1>

          <p className="mt-4 leading-8 text-stone-600">
            إذا كانت لديك ملاحظات أو استفسارات حول الموقع أو البيانات
            المعروضة، يسعدنا التواصل معك.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-stone-200 bg-white p-8">
          <h2 className="text-xl font-semibold">
            البريد الإلكتروني
          </h2>

          <p className="mt-4 text-stone-600">
            سيتم توفير عنوان البريد الإلكتروني الرسمي لـ DukanCoffee
            قبل إطلاق الموقع.
          </p>
        </div>
      </section>
    </main>
  );
}