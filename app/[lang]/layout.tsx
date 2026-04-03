import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n.server";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <>{children}</>;
}

// Pre-render both locale roots at build time to avoid a dynamic fallback on first visit.
export function generateStaticParams() {
  return [{ lang: "ko" }, { lang: "en" }];
}
