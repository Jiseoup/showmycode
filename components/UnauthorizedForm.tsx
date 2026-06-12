"use client";

import { useRef, useState } from "react";

// Strings are passed from the server component, which resolves the locale
// from the Accept-Language header (this page lives outside the [lang] layout).
type Props = {
  title: string;
  description: string;
  placeholder: string;
  submit: string;
  invalid: string;
};

export default function UnauthorizedForm({
  title,
  description,
  placeholder,
  submit,
  invalid,
}: Props) {
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-base font-semibold">{title}</p>
      <p className="text-muted-foreground text-sm">{description}</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="password"
            placeholder={placeholder}
            autoFocus
            onChange={() => setError(false)}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-border w-56 rounded border px-3 py-1.5 text-sm focus:ring-1 focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="border-border bg-muted hover:bg-accent cursor-pointer rounded border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submit}
          </button>
        </div>
        {/* Reserve space so the layout doesn't shift when the message toggles. */}
        <p aria-live="polite" className={`text-sm text-red-500 ${error ? "visible" : "invisible"}`}>
          {invalid}
        </p>
      </form>
    </div>
  );
}
