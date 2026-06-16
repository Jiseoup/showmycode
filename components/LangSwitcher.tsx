"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

const labels: Record<Locale, string> = { ko: "KO", en: "EN" };

function LangLinks({ currentLang, query }: { currentLang: Locale; query: string }) {
  const pathname = usePathname();

  function switchTo(lang: Locale) {
    // Replace the locale segment: /ko/... → /en/... or /ko → /en.
    const segments = pathname.split("/");
    segments[1] = lang;
    const path = segments.join("/") || "/";
    // Keep query params so locale switches preserve tab, page, and file/branch.
    return query ? `${path}?${query}` : path;
  }

  return (
    <div className="flex items-center gap-0.5 text-xs">
      {locales.map((lang, i) => (
        <span key={lang} className="flex items-center gap-0.5">
          {i > 0 && <span className="text-muted-foreground/40">|</span>}
          {lang === currentLang ? (
            <span className="text-foreground font-semibold">{labels[lang]}</span>
          ) : (
            <Link
              href={switchTo(lang)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {labels[lang]}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}

// Reads the query string; isolated so the Suspense boundary can prerender the rest.
function QueryAwareLangLinks({ currentLang }: { currentLang: Locale }) {
  const query = useSearchParams().toString();
  return <LangLinks currentLang={currentLang} query={query} />;
}

export function LangSwitcher({ currentLang }: { currentLang: Locale }) {
  // useSearchParams requires a Suspense boundary to keep prerendered routes static.
  // The fallback renders the switcher without query params (the value during prerender).
  return (
    <Suspense fallback={<LangLinks currentLang={currentLang} query="" />}>
      <QueryAwareLangLinks currentLang={currentLang} />
    </Suspense>
  );
}
