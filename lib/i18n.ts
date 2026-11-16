export const locales = ["en", "ko"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const hasLocale = (locale: string): locale is Locale =>
  (locales as readonly string[]).includes(locale);

// Each language's name written in that language (endonym), shown in the language switcher.
// Intentionally not translated: a reader looks for their own language by its native name.
export const localeNames: Record<Locale, string> = {
  en: "English",
  ko: "한국어",
};
