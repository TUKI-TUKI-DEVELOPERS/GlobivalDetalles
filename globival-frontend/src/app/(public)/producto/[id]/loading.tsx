export default function ProductoLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image skeleton */}
        <div className="aspect-square animate-pulse rounded-xl bg-muted" />

        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-8 w-3/4 animate-pulse rounded-lg bg-muted" />
          <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex gap-3 pt-4">
            <div className="h-12 flex-1 animate-pulse rounded-lg bg-muted" />
            <div className="h-12 flex-1 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
