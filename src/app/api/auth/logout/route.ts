import { auth, signOut } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  const issuer = process.env.AUTH_OIDC_CLIENT_ISSUER;
  const postLogoutRedirectUri =
    process.env.DASHBOARD_URL || "http://localhost:3000";

  if (session?.idToken) {
    const idToken = session.idToken;

    await signOut({ redirect: false });

    const logoutUrl = `${issuer}/protocol/openid-connect/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;
    return NextResponse.redirect(logoutUrl);
  }

  await signOut({ redirect: false });
  return NextResponse.redirect(postLogoutRedirectUri);
}
