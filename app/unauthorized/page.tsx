import { headers } from "next/headers";
import { getDictionary, defaultLocale, hasLocale } from "@/lib/i18n.server";
import UnauthorizedForm from "@/components/UnauthorizedForm";

// Standalone page — outside the [lang] layout, so there is no locale param.
// Resolve the locale from Accept-Language, mirroring proxy.ts.
export default async function UnauthorizedPage() {
  const acceptLang = (await headers()).get("accept-language") ?? "";
  const detected = acceptLang.split(",")[0].split("-")[0].toLowerCase();
  const locale = hasLocale(detected) ? detected : defaultLocale;
  const dict = await getDictionary(locale);
  const t = dict.unauthorized;

  return (
    <UnauthorizedForm
      title={t.title}
      description={t.description}
      placeholder={t.placeholder}
      submit={t.submit}
      invalid={t.invalid}
    />
  );
}
