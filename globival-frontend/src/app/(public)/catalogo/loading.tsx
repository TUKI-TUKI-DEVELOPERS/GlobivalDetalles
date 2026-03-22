export default function CatalogoLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header skeleton */}
      <div className="mb-8 rounded-xl border border-border bg-card p-8">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="mt-3 h-4 w-96 animate-pulse rounded bg-muted" />
      </div>

      {/* Toolbar skeleton */}
      <div className="mb-6 flex items-center gap-4">
        <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-10 flex-1 max-w-md animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-40 animate-pulse rounded-md bg-muted" />
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-border bg-card"
          >
            <div className="h-[250px] animate-pulse bg-muted" />
            <div className="p-4">
              <div className="mb-2 h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="mb-2 h-5 w-full animate-pulse rounded bg-muted" />
              <div className="h-5 w-16 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
