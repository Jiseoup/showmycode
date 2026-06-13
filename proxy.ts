import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, hasLocale } from "@/lib/i18n";
import { COOKIE_NAME, verifyToken, verifyCookie, cookieValue } from "@/lib/auth";

// Paths that are accessible without a valid auth cookie.
const PUBLIC_PATHS = ["/unauthorized"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

// Redirect to the correct locale if not already present in the path.
function redirectToLocale(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;

  // Pass through if locale prefix already present.
  const hasLocalePrefix = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocalePrefix) return;

  // Detect locale from Accept-Language header.
  const acceptLang = request.headers.get("accept-language") ?? "";
  const detected = acceptLang.split(",")[0].split("-")[0].toLowerCase();
  const locale = hasLocale(detected) ? detected : defaultLocale;

  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public paths through without auth.
  if (isPublicPath(pathname)) return NextResponse.next();

  const token = process.env.SHARE_TOKEN;

  // If SHARE_TOKEN is not set, run in public mode (no auth required).
  if (!token) {
    return redirectToLocale(request) ?? NextResponse.next();
  }

  // If ?token= query param is present and valid, set auth cookie and redirect without the param.
  // This allows sharing a plain URL like https://example.com/?token=xxx.
  const queryToken = request.nextUrl.searchParams.get("token");
  if (queryToken !== null) {
    if (verifyToken(queryToken, token)) {
      const url = new URL(request.url);
      url.searchParams.delete("token");
      const response = NextResponse.redirect(url);
      response.cookies.set(COOKIE_NAME, cookieValue(token), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return response;
    }
    // Invalid token in query param — deny access.
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Check auth cookie for subsequent requests.
  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie?.value && verifyCookie(cookie.value, token)) {
    return redirectToLocale(request) ?? NextResponse.next();
  }

  // No valid auth — redirect to unauthorized page.
  return NextResponse.redirect(new URL("/unauthorized", request.url));
}

/**
 * Run the proxy on every page route, excluding only framework internals and named static assets.
 *
 * Dotted paths are intentionally not excluded:
 * repository names can contain dots (e.g. `next.js`),
 * so a blanket `.*\..*` rule would let those repo pages bypass the share-token check.
 *
 * When adding files to `public/` (e.g. robots.txt, og images),
 * list them here — otherwise they hit the auth gate and locale redirect.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|api|favicon.ico|icon.svg).*)"],
};
