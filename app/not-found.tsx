import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { defaultLocale, getDictionary, hasLocale, type Locale } from "@/lib/i18n.server";

// Root not-found UI for unmatched URLs and every notFound() call in the app.
// It sits above app/[lang], so it has no locale param: read the locale proxy.ts
// resolved into the x-locale header, the same way the root layout does.
async function resolveLocale(): Promise<Locale> {
  const locale = (await headers()).get("x-locale");
  return locale && hasLocale(locale) ? locale : defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = (await getDictionary(await resolveLocale())).notFound;
  return { title: t.title };
}

// The copy stays generic on purpose: a repo that does not exist and a private repo
// outside the allowlist must look the same, or the page would reveal which exist.
export default async function NotFound() {
  const locale = await resolveLocale();
  const t = (await getDictionary(locale)).notFound;

  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center gap-3 px-3 text-center md:px-6">
      <p className="text-muted-foreground text-5xl font-semibold tracking-tight">404</p>
      <h1 className="text-base font-semibold">{t.title}</h1>
      <p className="text-muted-foreground text-sm">{t.description}</p>
      <Link
        href={`/${locale}`}
        className="border-border bg-muted hover:bg-accent mt-2 rounded border px-3 py-1.5 text-sm transition-colors"
      >
        {t.home}
      </Link>
    </main>
  );
}
