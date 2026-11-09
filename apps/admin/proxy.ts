import { type NextRequest, NextResponse } from "next/server";

/**
 * Admin auth gate. Once the server issues admin sessions, check the session
 * cookie here and redirect to /login when it's missing:
 *
 *   if (!request.cookies.has("admin_session")) {
 *     return NextResponse.redirect(new URL("/login", request.url));
 *   }
 *
 * Note: this is a UX guard only — apps/server must still verify the admin role
 * on every admin endpoint.
 */
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Everything except /login, Next internals and static files
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|brand/|robots.txt).*)"],
};
