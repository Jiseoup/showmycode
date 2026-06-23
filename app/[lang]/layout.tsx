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

// Supported locale roots — not prerendered, since the home page renders at request time.
export function generateStaticParams() {
  return [{ lang: "ko" }, { lang: "en" }];
}
