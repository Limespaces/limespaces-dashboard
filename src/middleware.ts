import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  if (!isLoggedIn && req.nextUrl.pathname !== "/auth/signin") {
    const loginUrl = new URL("/auth/signin", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.href);

    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    "/((?!api/auth|_next/static|_next/image).*)",
  ],
};
