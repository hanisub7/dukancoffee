import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;

// Allow maintenance and admin authentication routes.
if (
  pathname === "/maintenance" ||
  pathname === "/login" ||
  pathname.startsWith("/api/auth")
) {
  return NextResponse.next();
}

  // Keep admin routes protected by Auth.js.
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Hide the unfinished public website in production.
  if (process.env.VERCEL_ENV === "production") {
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.redirect(url);
  }

  // Local development and preview remain accessible.
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};