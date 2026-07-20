import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "wishverse_session";

const GUEST_ONLY = ["/login", "/register", "/forgot-password", "/reset-password"];
const AUTH_REQUIRED = [
  "/dashboard",
  "/admin",
  "/onboarding",
  "/verify-email",
  "/complete-profile",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  const isGuestOnly = GUEST_ONLY.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isAuthRequired = AUTH_REQUIRED.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (hasSession && isGuestOnly) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!hasSession && isAuthRequired) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/onboarding",
    "/verify-email",
    "/complete-profile",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
