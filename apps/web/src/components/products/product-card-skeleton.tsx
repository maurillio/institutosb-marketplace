import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full" />

      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />

        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Price skeleton */}
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
