import { Skeleton } from '@/components/ui/skeleton';

export function CourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      {/* Image skeleton - aspect video */}
      <Skeleton className="aspect-video w-full" />

      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />

        {/* Instructor skeleton */}
        <Skeleton className="h-4 w-32" />

        {/* Stats skeleton (rating, students, duration) */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Price skeleton */}
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
}

export function CourseGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}
