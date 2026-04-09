"use client";

import { useRef, useState } from "react";

// Standalone page — outside [lang] layout, so no i18n context available.
export default function UnauthorizedPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const token = inputRef.current?.value.trim();
    if (!token || submitting) return;

    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        // Full page navigation so the freshly-set cookie is sent on the next request.
        window.location.assign("/");
        return;
      }
      setError(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-base font-semibold">Access restricted</p>
      <p className="text-sm text-muted-foreground">
        Enter your access token to continue.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="password"
            placeholder="Access token"
            autoFocus
            onChange={() => setError(false)}
            className="text-sm px-3 py-1.5 w-56 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-border"
          />
          <button
            type="submit"
            disabled={submitting}
            className="text-sm px-3 py-1.5 rounded border border-border bg-muted hover:bg-accent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enter
          </button>
        </div>
        {/* Reserve space so the layout doesn't shift when the message toggles. */}
        <p
          aria-live="polite"
          className={`text-sm text-red-500 ${error ? "visible" : "invisible"}`}
        >
          Invalid token. Please try again.
        </p>
      </form>
    </div>
  );
}
