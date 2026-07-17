export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-20">

        <h1 className="text-5xl font-bold text-stone-900">
          ☕ DukanCoffee
        </h1>

        <p className="mt-4 text-xl text-stone-600">
          Compare coffee machine prices in Saudi Arabia.
        </p>

        <div className="mt-10">
          <input
            type="text"
            placeholder="Search coffee machines..."
            className="w-full rounded-xl border border-stone-300 p-4 text-lg shadow-sm"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">

          <div className="rounded-2xl bg-white p-6 shadow">
            ☕ Espresso Machines
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            🤖 Fully Automatic
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            ⚙️ Coffee Grinders
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            🟢 Capsule Machines
          </div>

        </div>

      </div>
    </main>
  );
}