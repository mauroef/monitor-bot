interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded bg-zinc-800 ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <Skeleton className="mb-3 h-3 w-24" />
      <Skeleton className="mb-2 h-6 w-32" />
      <Skeleton className="h-4 w-20" />
    </div>
  )
}
