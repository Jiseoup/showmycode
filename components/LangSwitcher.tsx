"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

const labels: Record<Locale, string> = { ko: "KO", en: "EN" };

export function LangSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname();

  function switchTo(lang: Locale) {
    // Replace the locale segment: /ko/... → /en/... or /ko → /en.
    const segments = pathname.split("/");
    segments[1] = lang;
    return segments.join("/") || "/";
  }

  return (
    <div className="flex items-center gap-0.5 text-xs">
      {locales.map((lang, i) => (
        <span key={lang} className="flex items-center gap-0.5">
          {i > 0 && <span className="text-muted-foreground/40">|</span>}
          {lang === currentLang ? (
            <span className="font-semibold text-foreground">{labels[lang]}</span>
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
