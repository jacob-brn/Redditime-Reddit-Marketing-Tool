import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;

  if (sessionCookie && (pathname === "/login" || pathname === "/signup"))
    return NextResponse.redirect(new URL("/dashboard", request.url));

  if (!sessionCookie && pathname.startsWith("/dashboard"))
    return NextResponse.redirect(new URL("/login", request.url));

  // Redirect /dashboard to /dashboard/schedule-post
  if (pathname === "/dashboard")
    return NextResponse.redirect(
      new URL("/dashboard/schedule-post", request.url)
    );

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
