import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/library", "/reading", "/recommended"];
const guestOnlyRoutes = ["/login", "/register"];
// const publicRoutes = ["/", "/about", "/contact"];

const IS_TESTING = false;

const conditionalLog = (message: string, isError = false) => {
  if (IS_TESTING) {
    if (isError) console.error(message);
    else console.log(message);
  }
};

export function middleware(request: NextRequest) {
  const isAuthenticated =
    request.cookies.get("isAuthenticated")?.value === "true";
  const pathname = request.nextUrl.pathname;
  const DEFAULT_AUTHENTICATED_REDIRECT = "/recommended";
  const DEFAULT_UNAUTHENTICATED_REDIRECT = "/login";

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  conditionalLog(
    `🛡️ Middleware: ${pathname}, authenticated: ${isAuthenticated}`
  );

  if (pathname === "/") {
    const redirectTo = isAuthenticated
      ? DEFAULT_AUTHENTICATED_REDIRECT
      : DEFAULT_UNAUTHENTICATED_REDIRECT;

    conditionalLog(`🔀 Root redirect: ${redirectTo}`);
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current route is guest-only
  const isGuestOnlyRoute = guestOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current route is public
  // const isPublicRoute = publicRoutes.some((route) =>
  //   pathname.startsWith(route)
  // );

  // Protected routes - redirect to login if not authenticated
  if (isProtectedRoute && !isAuthenticated) {
    conditionalLog(`🔒 Protected route access denied: ${pathname}`);
    const loginUrl = new URL(DEFAULT_UNAUTHENTICATED_REDIRECT, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Guest-only routes - redirect authenticated users away
  if (isGuestOnlyRoute && isAuthenticated) {
    conditionalLog(
      `👤 Guest route, redirecting authenticated user: ${pathname}`
    );
    const redirectUrl =
      request.nextUrl.searchParams.get("redirect") ||
      DEFAULT_AUTHENTICATED_REDIRECT;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Public routes - allow both authenticated and unauthenticated
  // if (isPublicRoute) {
  //   conditionalLog(`🌐 Public route access: ${pathname}`);
  //   return NextResponse.next();
  // }

  // Default: allow access
  conditionalLog(`✅ Route access granted: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).+)",
  ],
};
