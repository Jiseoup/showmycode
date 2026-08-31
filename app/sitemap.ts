import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { absoluteUrl, seoEnabled } from "@/lib/site";

// Resolved at request time for the same reason as robots.ts.
export const dynamic = "force-dynamic";

// Landing pages only — repository views are disallowed in robots.ts. Empty when
// this deployment has not opted in to indexing.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!seoEnabled) return [];

  return locales.map((locale) => ({
    url: absoluteUrl(`/${locale}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1,
  }));
}
