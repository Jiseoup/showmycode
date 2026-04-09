import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "smc_auth";

// Validates a share token submitted from the unauthorized page.
// On success, sets the auth cookie; on failure, returns 401 without leaking details.
export async function POST(request: NextRequest) {
  const expected = process.env.SHARE_TOKEN;
  if (!expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let submitted: string | undefined;
  try {
    const body = (await request.json()) as { token?: unknown };
    if (typeof body.token === "string") submitted = body.token.trim();
  } catch {
    // Invalid JSON body — treat as failed auth.
  }

  if (!submitted || submitted !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days.
  });
  return response;
}
