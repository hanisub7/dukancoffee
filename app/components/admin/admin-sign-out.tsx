"use client";

import { signOut } from "next-auth/react";

export default function AdminSignOut() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-lg border border-stone-300 px-3 py-2 text-sm hover:bg-stone-100"
    >
      Sign out
    </button>
  );
}