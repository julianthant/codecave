import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface ConnectionSkeletonProps {
  variant?: 'card' | 'list'
  count?: number
}

export function ConnectionSkeleton({ variant = 'card', count = 6 }: ConnectionSkeletonProps) {
  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-full max-w-xs" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-18" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse h-full">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            
            <Skeleton className="h-12 w-full" />
            
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            
            <div className="flex space-x-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-18" />
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 w-10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}