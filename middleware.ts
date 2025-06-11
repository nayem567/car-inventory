import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protect /add-car and /dashboard routes
  const protectedPaths = ["/add-car", "/dashboard"];
  const { pathname } = request.nextUrl;

  // Only run on protected paths
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    // Check for Supabase auth cookie (sb-access-token)
    const hasToken = request.cookies.has("sb-access-token");
    if (!hasToken) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/add-car", "/dashboard"],
};
