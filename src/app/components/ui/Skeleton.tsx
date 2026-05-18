interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-surface-container-high rounded'

  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{
        width: width || (variant === 'circular' ? 40 : '100%'),
        height: height || (variant === 'text' ? 16 : variant === 'circular' ? 40 : 100),
      }}
    />
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-outline-variant bg-white p-5">
      <Skeleton variant="circular" className="mb-3" />
      <Skeleton className="mb-2" />
      <Skeleton className="mb-2 w-3/4" />
      <Skeleton className="w-1/2" />
    </div>
  )
}

function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} height={80} variant="rectangular" />
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonList }
export type { SkeletonProps }