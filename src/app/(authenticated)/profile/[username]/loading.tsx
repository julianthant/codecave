import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function ProfileLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cover Image Skeleton */}
      <div className="bg-gray-200 h-48 sm:h-64 animate-pulse" />

      {/* Profile Content */}
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="pb-6">
          {/* Avatar and Basic Info Skeleton */}
          <div className="flex sm:flex-row flex-col sm:items-end sm:space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0 -mt-16">
              <Skeleton className="rounded-full w-32 h-32" />
            </div>

            {/* Profile Info */}
            <div className="flex-grow space-y-3 mt-6 sm:mt-0">
              <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <div className="space-y-2">
                  <Skeleton className="w-48 h-8" />
                  <Skeleton className="w-32 h-6" />
                </div>
                <Skeleton className="w-32 h-10" />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Skeleton className="w-full max-w-2xl h-4" />
                <Skeleton className="w-3/4 max-w-xl h-4" />
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap gap-4">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-28 h-4" />
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-24 h-10" />
                ))}
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Skeleton className="w-16 h-4" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="w-16 h-6" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Stats Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="gap-6 grid grid-cols-2 sm:grid-cols-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2 text-center">
                  <Skeleton className="mx-auto rounded-full w-12 h-12" />
                  <Skeleton className="mx-auto w-12 h-6" />
                  <Skeleton className="mx-auto w-16 h-4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="mb-6 border-gray-200 border-b">
          <div className="flex space-x-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-24 h-12" />
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
                    <Skeleton className="rounded-full w-10 h-10" />
                    <div className="flex-grow space-y-2">
                      <Skeleton className="w-32 h-5" />
                      <Skeleton className="w-24 h-4" />
                    </div>
                  </div>
                  <Skeleton className="w-3/4 h-6" />
                  <div className="space-y-2">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-5/6 h-4" />
                  </div>
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="w-16 h-6" />
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
