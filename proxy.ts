import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, hasLocale } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass through if locale prefix already present.
  const pathnameHasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (pathnameHasLocale) return;

  // Detect locale from Accept-Language header.
  const acceptLang = request.headers.get("accept-language") ?? "";
  const detected = acceptLang.split(",")[0].split("-")[0].toLowerCase();
  const locale = hasLocale(detected) ? detected : defaultLocale;

  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
