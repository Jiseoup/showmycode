"use client";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html>
      <body
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: "12px",
          fontFamily: "sans-serif",
        }}
      >
        <p style={{ fontSize: "16px", fontWeight: 500 }}>Something went wrong.</p>
        <button
          onClick={unstable_retry}
          style={{
            fontSize: "14px",
            padding: "6px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
