"use client";

import { usePathname } from "next/navigation";
import PublicFooter from "./public-footer";
import PublicHeader from "./public-header";

type PublicShellProps = {
  children: React.ReactNode;
};

export default function PublicShell({
  children,
}: PublicShellProps) {
  const pathname = usePathname();

  const isPrivateRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login");

  if (isPrivateRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <PublicHeader />

      <main className="min-h-[calc(100vh-64px)]">
        {children}
      </main>

      <PublicFooter />
    </>
  );
}