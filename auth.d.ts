import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
  }

  interface Session {
    user: {
      id: string;
      role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
  }
}

export {};