export const locales = ["en", "ko"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const hasLocale = (locale: string): locale is Locale =>
  (locales as readonly string[]).includes(locale);

// Case-insensitive lookup, since language tags are case-insensitive (RFC 5646).
const findLocale = (tag: string): Locale | undefined =>
  locales.find((l) => l.toLowerCase() === tag);

// Picks the best supported locale for an Accept-Language header value.
// Tags are tried in descending q order (ties keep header order), skipping `*` and q=0.
// Each tag matches a locale exactly or by its primary subtag (ko-KR → ko).
// Falls back to defaultLocale when nothing in the list is supported.
export function matchLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag = "", ...params] = part.split(";").map((s) => s.trim());
      const qParam = params.find((p) => p.startsWith("q="));
      const q = qParam === undefined ? 1 : Number(qParam.slice(2));
      return { tag: tag.toLowerCase(), q: Number.isNaN(q) ? 0 : q, index };
    })
    .filter(({ tag, q }) => tag !== "" && tag !== "*" && q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  for (const { tag } of ranked) {
    const match = findLocale(tag) ?? findLocale(tag.split("-")[0]);
    if (match) return match;
  }
  return defaultLocale;
}

// Each language's name written in that language (endonym), shown in the language switcher.
// Intentionally not translated: a reader looks for their own language by its native name.
export const localeNames: Record<Locale, string> = {
  en: "English",
  ko: "한국어",
};
