export default function HomeLoading() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header skeleton. */}
      <header className="border-border flex items-center justify-between gap-2 border-b px-3 py-3 md:gap-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="bg-muted h-5 w-5 animate-pulse rounded" />
          <div className="bg-muted h-5 w-24 animate-pulse rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-muted h-8 w-16 animate-pulse rounded" />
          <div className="bg-muted h-8 w-8 animate-pulse rounded" />
        </div>
      </header>

      {/* Repo card skeletons. */}
      <main className="mx-auto max-w-3xl px-3 py-6 md:px-6 md:py-10">
        <ul className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="border-border rounded-lg border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="bg-muted h-5 w-40 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-64 animate-pulse rounded" />
                  <div className="flex gap-4">
                    <div className="bg-muted h-3 w-20 animate-pulse rounded" />
                    <div className="bg-muted h-3 w-12 animate-pulse rounded" />
                    <div className="bg-muted h-3 w-28 animate-pulse rounded" />
                  </div>
                </div>
                <div className="bg-muted h-5 w-14 animate-pulse rounded-full" />
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
