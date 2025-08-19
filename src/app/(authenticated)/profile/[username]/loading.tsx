import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image Skeleton */}
      <div className="h-48 bg-gray-200 animate-pulse sm:h-64" />

      {/* Profile Content */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="pb-6">
          {/* Avatar and Basic Info Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
            {/* Avatar */}
            <div className="-mt-16 flex-shrink-0">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>

            {/* Profile Info */}
            <div className="mt-6 flex-grow space-y-3 sm:mt-0">
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-2xl" />
                <Skeleton className="h-4 w-3/4 max-w-xl" />
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-24" />
                ))}
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-6 w-16" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="text-center space-y-2">
                  <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                  <Skeleton className="h-6 w-12 mx-auto" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-24" />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-grow space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-6 w-16" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}