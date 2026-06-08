export default function PullDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 space-y-5 overflow-auto px-3 py-6 md:px-6">
      {/* Back link skeleton. */}
      <div className="bg-muted h-3 w-24 animate-pulse rounded" />

      {/* PR header skeleton. */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
          <div className="bg-muted h-5 w-3/5 animate-pulse rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-muted h-5 w-5 animate-pulse rounded-full" />
          <div className="bg-muted h-4 w-40 animate-pulse rounded" />
          <div className="bg-muted h-4 w-32 animate-pulse rounded" />
        </div>
      </div>

      {/* Tab navigation skeleton. */}
      <div className="border-border flex gap-1 border-b">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="px-3 py-2">
            <div className="bg-muted h-4 w-16 animate-pulse rounded" />
          </div>
        ))}
      </div>

      {/* Content skeleton. */}
      <div className="border-border rounded-lg border p-4">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted h-4 animate-pulse rounded"
              style={{ width: `${40 + ((i * 41) % 50)}%` }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
