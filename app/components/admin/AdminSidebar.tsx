import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="min-h-screen w-64 border-r bg-white p-6">
      <h2 className="text-xl font-bold">
        DukanCoffee
      </h2>

      <nav className="mt-8 space-y-3">
        <Link
          href="/admin"
          className="block hover:text-blue-600"
        >
          Dashboard
        </Link>

        <Link
          href="/admin/products"
          className="block hover:text-blue-600"
        >
          Products
        </Link>

        <Link
          href="/admin/brands"
          className="block hover:text-blue-600"
        >
          Brands
        </Link>

        <Link
          href="/admin/categories"
          className="block hover:text-blue-600"
        >
          Categories
        </Link>

        <Link
          href="/admin/drinks"
          className="block hover:text-blue-600"
        >
          Drinks
        </Link>

        <Link
          href="/admin/retailers"
          className="block hover:text-blue-600"
        >
          Retailers
        </Link>
      </nav>
    </aside>
  );
}