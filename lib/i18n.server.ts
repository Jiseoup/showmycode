import "server-only";
import type { Locale } from "@/lib/i18n";
import ko from "@/locales/ko.json";

export type { Locale } from "@/lib/i18n";
export { locales, defaultLocale, hasLocale } from "@/lib/i18n";

type Dictionary = typeof ko;

const load: Record<Locale, () => Promise<Dictionary>> = {
  ko: () => import("@/locales/ko.json").then((m) => m.default),
  en: () => import("@/locales/en.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> => load[locale]();
