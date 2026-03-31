export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";
export const hasLocale = (locale: string): locale is Locale =>
  (locales as readonly string[]).includes(locale);
