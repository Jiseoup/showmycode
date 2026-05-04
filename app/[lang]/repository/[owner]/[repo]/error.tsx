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
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-medium">{t.error.title}</p>
      <p className="text-muted-foreground text-xs">{error.message}</p>
      <button
        onClick={unstable_retry}
        className="border-border hover:bg-muted rounded border px-3 py-1.5 text-xs transition-colors"
      >
        {t.error.retry}
      </button>
    </div>
  );
}
