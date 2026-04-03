"use client";

import { useParams } from "next/navigation";
import * as messages from "@/locales";

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
      <p className="text-sm font-medium">{t.error.title}</p>
      <p className="text-xs text-muted-foreground">{error.message}</p>
      <button
        onClick={unstable_retry}
        className="text-xs px-3 py-1.5 rounded border border-border hover:bg-muted transition-colors"
      >
        {t.error.retry}
      </button>
    </div>
  );
}
