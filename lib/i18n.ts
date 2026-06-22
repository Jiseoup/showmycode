export const locales = ["en", "ko"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const hasLocale = (locale: string): locale is Locale =>
  (locales as readonly string[]).includes(locale);
