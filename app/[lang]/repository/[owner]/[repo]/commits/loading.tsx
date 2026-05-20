export default function CommitsLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 overflow-auto px-3 py-4 md:px-6 md:py-6">
      {/* Title + branch selector skeleton. */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="bg-muted h-6 w-40 animate-pulse rounded" />
        <div className="bg-muted h-8 w-32 animate-pulse rounded" />
      </div>

      {/* Commit list skeletons. */}
      <ul className="space-y-px">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="border-border flex items-start gap-3 border-b py-3 last:border-0">
            <div className="bg-muted mt-0.5 h-8 w-8 shrink-0 animate-pulse rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <div
                className="bg-muted h-4 animate-pulse rounded"
                style={{ width: `${50 + ((i * 23) % 40)}%` }}
              />
              <div className="bg-muted h-3 w-36 animate-pulse rounded" />
            </div>
            <div className="bg-muted h-6 w-16 shrink-0 animate-pulse rounded" />
          </li>
        ))}
      </ul>
    </main>
  );
}
