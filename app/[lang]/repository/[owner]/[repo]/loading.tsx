export default function CodeLoading() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar skeleton (hidden on mobile). */}
      <aside className="border-border hidden w-64 shrink-0 border-r md:block">
        <div className="space-y-2 p-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="bg-muted h-4 w-4 animate-pulse rounded" />
              <div
                className="bg-muted h-4 animate-pulse rounded"
                style={{ width: `${60 + ((i * 37) % 40)}%` }}
              />
            </div>
          ))}
        </div>
      </aside>

      {/* Code area skeleton. */}
      <div className="flex-1">
        <div className="border-border bg-muted/40 border-b px-4 py-2">
          <div className="bg-muted h-4 w-48 animate-pulse rounded" />
        </div>
        <div className="space-y-2 p-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted h-4 animate-pulse rounded"
              style={{ width: `${30 + ((i * 47) % 60)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
