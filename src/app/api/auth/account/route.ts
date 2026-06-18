import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(
    `${process.env.AUTH_OIDC_CLIENT_ISSUER}/account`,
  );
}
