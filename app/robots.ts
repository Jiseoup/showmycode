import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { absoluteUrl, seoEnabled } from "@/lib/site";

// Resolved at request time so the origin comes from the running environment.
// Without this the route is prerendered and SITE_URL is baked in at build,
// which would disagree with metadataBase in app/layout.tsx.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  // Default posture: keep the whole deployment out of search results.
  if (!seoEnabled) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  // Opted in: only the localized landing pages are meant to be indexed.
  // Repository views render someone else's code and would bury the landing
  // page; /unauthorized and /api are never useful in a search result.
  return {
    rules: {
      userAgent: "*",
      allow: ["/", ...locales.map((locale) => `/${locale}`)],
      disallow: ["/*/repository/", "/unauthorized", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
