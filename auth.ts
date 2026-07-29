import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { z } from "zod";

import { prisma } from "@/app/lib/prisma";

type AdminRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },

pages: {
  signIn: "/login",
},

  callbacks: {
  authorized({ auth, request }) {
    const isAdminRoute =
      request.nextUrl.pathname.startsWith("/admin");

    if (isAdminRoute) {
      return Boolean(auth?.user);
    }

    return true;
  },

    async jwt({ token, user }) {
      if (user) {
        const authenticatedUser = user as typeof user & {
          role: AdminRole;
        };

        token.role = authenticatedUser.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & {
          id: string;
          role: AdminRole;
        };

        sessionUser.id = token.sub ?? "";
        sessionUser.role = token.role as AdminRole;
      }

      return session;
    },
  },

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const parsedCredentials =
          credentialsSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        const adminUser = await prisma.adminUser.findUnique({
          where: {
            email: email.toLowerCase(),
          },
        });

        if (!adminUser || !adminUser.active) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          adminUser.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.fullName,
          role: adminUser.role,
        };
      },
    }),
  ],
});