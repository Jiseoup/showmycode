export default function CommitDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 space-y-5 overflow-auto px-6 py-6">
      {/* Back link skeleton. */}
      <div className="bg-muted h-3 w-24 animate-pulse rounded" />

      {/* Commit header skeleton. */}
      <div className="border-border space-y-3 rounded-lg border p-4">
        <div className="space-y-2">
          <div className="bg-muted h-5 w-3/4 animate-pulse rounded" />
          <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
        </div>
        <div className="border-border flex items-center gap-2 border-t pt-2">
          <div className="bg-muted h-5 w-5 animate-pulse rounded-full" />
          <div className="bg-muted h-4 w-40 animate-pulse rounded" />
          <div className="bg-muted ml-auto h-5 w-16 animate-pulse rounded" />
        </div>
      </div>

      {/* Files changed skeleton. */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="bg-muted h-4 w-32 animate-pulse rounded" />
          <div className="bg-muted h-4 w-16 animate-pulse rounded" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-border rounded border">
              <div className="border-border border-b px-3 py-2">
                <div className="bg-muted h-4 w-48 animate-pulse rounded" />
              </div>
              <div className="space-y-1 p-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="bg-muted h-4 animate-pulse rounded"
                    style={{ width: `${40 + ((j * 31) % 50)}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
