export default function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen border-r bg-white p-6">
      <h2 className="text-xl font-bold">DukanCoffee</h2>

      <nav className="mt-8 space-y-3">
        <a href="/admin" className="block hover:text-blue-600">
          Dashboard
        </a>

        <a href="/admin/products" className="block hover:text-blue-600">
          Products
        </a>

        <a href="/admin/brands" className="block hover:text-blue-600">
          Brands
        </a>

        <a href="/admin/categories" className="block hover:text-blue-600">
          Categories
        </a>

        <a href="/admin/retailers" className="block hover:text-blue-600">
          Retailers
        </a>
      </nav>
    </aside>
  );
}