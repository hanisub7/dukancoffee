import DashboardCard from "../components/admin/DashboardCard";
import { prisma } from "../lib/prisma";

export default async function AdminPage() {
  const [products, brands, retailers, offers] = await Promise.all([
    prisma.product.count(),
    prisma.brand.count(),
    prisma.retailer.count(),
    prisma.offer.count(),
  ]);

  return (
    <>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p className="mt-2 text-gray-600">
        Welcome to the DukanCoffee Admin Dashboard.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Products" value={products} />
        <DashboardCard title="Brands" value={brands} />
        <DashboardCard title="Retailers" value={retailers} />
        <DashboardCard title="Offers" value={offers} />
      </div>
    </>
  );
}