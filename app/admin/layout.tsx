import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "../../auth";

import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminSignOut from "@/app/components/admin/admin-sign-out";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-end border-b border-stone-200 p-4">
          <AdminSignOut />
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}