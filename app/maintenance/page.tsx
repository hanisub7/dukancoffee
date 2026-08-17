export default function MaintenancePage() {
  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-stone-50 px-6"
    >
      <div className="w-full max-w-xl rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">
        <div className="text-3xl font-bold text-orange-500">
          DukanCoffee
        </div>

        <h1 className="mt-6 text-3xl font-bold text-stone-900">
          الموقع قيد التجهيز
        </h1>

        <p className="mt-4 text-base leading-8 text-stone-600">
          نعمل حاليًا على تجهيز DukanCoffee وتحديث بيانات المنتجات والأسعار
          قبل الإطلاق الرسمي.
        </p>

        <p className="mt-3 text-sm text-stone-500">
          شكرًا لزيارتك، ونراك قريبًا.
        </p>
      </div>
    </main>
  );
}