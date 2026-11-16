"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Check, Globe } from "lucide-react";
import { locales, localeNames, type Locale } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = { currentLang: Locale; label: string };

function LangMenu({ currentLang, label, query }: Props & { query: string }) {
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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className="hover:bg-accent text-muted-foreground hover:text-foreground focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-foreground flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-label={label}
      >
        <Globe className="h-4 w-4" aria-hidden />
        {currentLang}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((lang) => {
          const active = lang === currentLang;
          // A plain anchor on purpose: the root layout sets <html lang> and is not
          // re-rendered on client-side navigation, so a <Link> would leave it stale.
          return (
            <DropdownMenuItem key={lang} asChild>
              <a
                href={switchTo(lang)}
                lang={lang}
                hrefLang={lang}
                aria-current={active ? "true" : undefined}
                className={active ? "font-medium" : undefined}
              >
                <Check className={active ? "opacity-100" : "opacity-0"} aria-hidden />
                {localeNames[lang]}
              </a>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Reads the query string; isolated so the Suspense boundary can prerender the rest.
function QueryAwareLangMenu(props: Props) {
  const query = useSearchParams().toString();
  return <LangMenu {...props} query={query} />;
}

export function LangSwitcher(props: Props) {
  // useSearchParams requires a Suspense boundary to keep prerendered routes static.
  // The fallback renders the switcher without query params (the value during prerender).
  return (
    <Suspense fallback={<LangMenu {...props} query="" />}>
      <QueryAwareLangMenu {...props} />
    </Suspense>
  );
}
