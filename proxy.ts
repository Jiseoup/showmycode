import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, hasLocale } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 이미 로케일 prefix가 있으면 통과
  const pathnameHasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (pathnameHasLocale) return;

  // Accept-Language 헤더에서 로케일 감지
  const acceptLang = request.headers.get("accept-language") ?? "";
  const detected = acceptLang.split(",")[0].split("-")[0].toLowerCase();
  const locale = hasLocale(detected) ? detected : defaultLocale;

  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
