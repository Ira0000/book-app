import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/library", "/reading", "/recommended"];
const guestOnlyRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const refreshToken = request.cookies.get("refreshToken");
  const isAuthenticated = !!(token && refreshToken);
  const pathname = request.nextUrl.pathname;

  // Special handling for root path "/"
  if (pathname === "/") {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // If authenticated, allow access to "/"
    return NextResponse.next();
  }

  // Handle protected routes (excluding "/")
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Handle guest-only routes
  if (
    guestOnlyRoutes.some((route) => pathname.startsWith(route)) &&
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
