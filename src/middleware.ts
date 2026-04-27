import { NextResponse } from "next/server";
import type { NextRequest } from "next/request";

/**
 * This runs on the "Edge". It checks the request before it even hits the page.
 * Useful for redirecting users away from protected UI routes.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // If using cookies for web
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
