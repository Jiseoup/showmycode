"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

// Standalone page — outside [lang] layout, so no i18n context available.
export default function UnauthorizedPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const token = inputRef.current?.value.trim();
    if (token) router.push(`/?token=${encodeURIComponent(token)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-base font-semibold">Access restricted</p>
      <p className="text-sm text-muted-foreground">
        Enter your access token to continue.
      </p>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="password"
          placeholder="Access token"
          autoFocus
          className="text-sm px-3 py-1.5 w-56 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-border"
        />
        <button
          type="submit"
          className="text-sm px-3 py-1.5 rounded border border-border bg-muted hover:bg-accent transition-colors cursor-pointer"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
