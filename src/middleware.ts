import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/library", "/reading", "/recommended"];
const guestOnlyRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const isAuthenticated =
    request.cookies.get("isAuthenticated")?.value === "true";
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes, static files, etc.
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Root path "/"
  if (pathname === "/") {
    if (!isAuthenticated) {
      const url = new URL("/login", request.url);
      const response = NextResponse.redirect(url);
      return response;
    }
    return NextResponse.next();
  }

  // Protected routes - redirect to login if not authenticated
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/login", request.url);
    // Preserve the original URL as a redirect parameter
    url.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(url);
    return response;
  }

  // Guest-only routes - redirect to home if authenticated
  const isGuestOnlyRoute = guestOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isGuestOnlyRoute && isAuthenticated) {
    const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/";
    const url = new URL(redirectUrl, request.url);
    const response = NextResponse.redirect(url);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
