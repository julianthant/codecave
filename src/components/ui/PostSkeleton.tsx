'use client'

import { cn } from '@/lib/utils'

interface PostSkeletonProps {
  variant?: 'article' | 'snippet' | 'showcase' | 'discussion'
  className?: string
}

export function PostSkeleton({ variant = 'article', className }: PostSkeletonProps) {
  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-xl p-4",
      "animate-pulse",
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-3">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        {variant === 'article' && (
          <div className="h-6 bg-gray-200 rounded w-1/2" />
        )}
      </div>

      {/* Content based on variant */}
      {variant === 'article' && (
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
        </div>
      )}

      {variant === 'snippet' && (
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-700 rounded w-5/6" />
            <div className="h-3 bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      )}

      {variant === 'showcase' && (
        <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
      )}

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-gray-100 rounded-full" />
        <div className="h-6 w-20 bg-gray-100 rounded-full" />
        <div className="h-6 w-14 bg-gray-100 rounded-full" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex space-x-4">
          <div className="h-8 w-16 bg-gray-100 rounded-lg" />
          <div className="h-8 w-16 bg-gray-100 rounded-lg" />
        </div>
        <div className="flex space-x-2">
          <div className="h-8 w-8 bg-gray-100 rounded-lg" />
          <div className="h-8 w-8 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  )
}