"use client";

import { useParams } from "next/navigation";

// Inline i18n strings here because error boundaries must be "use client" and cannot call getDictionary (server-only).
const messages = {
  ko: { title: "데이터를 불러오지 못했습니다.", retry: "다시 시도" },
  en: { title: "Failed to load data.", retry: "Try again" },
} as const;

export default function RepoError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const { lang } = useParams<{ lang: string }>();
  const t = messages[lang as keyof typeof messages] ?? messages.ko;

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
      <p className="text-sm font-medium">{t.title}</p>
      <p className="text-xs text-muted-foreground">{error.message}</p>
      <button
        onClick={unstable_retry}
        className="text-xs px-3 py-1.5 rounded border border-border hover:bg-muted transition-colors"
      >
        {t.retry}
      </button>
    </div>
  );
}
