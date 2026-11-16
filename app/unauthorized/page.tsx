import { headers } from "next/headers";
import { getDictionary } from "@/lib/i18n.server";
import { matchLocale } from "@/lib/i18n";
import { UnauthorizedForm } from "@/components/UnauthorizedForm";

// Standalone page — outside the [lang] layout, so there is no locale param.
// Resolve the locale from Accept-Language with the same matcher proxy.ts uses.
export default async function UnauthorizedPage() {
  const locale = matchLocale((await headers()).get("accept-language"));
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
