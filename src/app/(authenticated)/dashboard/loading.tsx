import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

function MetricCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="space-y-0 pb-3">
        <div className="flex justify-between items-center">
          <div className="bg-gray-200 rounded w-24 h-4" />
          <div className="bg-gray-200 rounded w-6 h-6" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="bg-gray-200 rounded w-16 h-8" />
          <div className="bg-gray-200 rounded w-20 h-4" />
        </div>
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="bg-gray-200 rounded w-32 h-5" />
        <div className="bg-gray-200 rounded w-48 h-4" />
      </CardHeader>
      <CardContent>
        <div className="bg-gray-200 rounded w-full h-[300px]" />
      </CardContent>
    </Card>
  )
}

function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="bg-gray-200 rounded w-28 h-5" />
            <div className="bg-gray-200 rounded w-40 h-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-2">
                  <div className="bg-gray-200 rounded w-full h-4" />
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-200 rounded w-12 h-3" />
                    <div className="bg-gray-200 rounded w-12 h-3" />
                    <div className="bg-gray-200 rounded w-20 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function DashboardLoading() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-65px)]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="bg-gray-200 mb-2 rounded w-32 h-8 animate-pulse" />
              <div className="bg-gray-200 rounded w-80 h-5 animate-pulse" />
            </div>
            <div className="hidden sm:flex sm:items-center sm:space-x-2 sm:bg-white sm:shadow-sm sm:px-4 sm:py-2 sm:border sm:rounded-lg">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div className="bg-gray-200 rounded w-40 h-4 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Metrics Grid Skeleton */}
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>

          {/* Main Content Grid Skeleton */}
          <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
            {/* Left Column Skeleton */}
            <div className="space-y-6 lg:col-span-2">
              <ChartSkeleton />
              <ChartSkeleton />
              <Card className="animate-pulse">
                <CardHeader>
                  <div className="bg-gray-200 rounded w-32 h-5" />
                  <div className="bg-gray-200 rounded w-48 h-4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="bg-gray-200 rounded w-full h-4" />
                        <div className="flex items-center gap-4">
                          <div className="bg-gray-200 rounded w-12 h-3" />
                          <div className="bg-gray-200 rounded w-12 h-3" />
                          <div className="bg-gray-200 rounded w-12 h-3" />
                          <div className="bg-gray-200 ml-auto rounded w-20 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column Skeleton */}
            <div className="lg:col-span-1">
              <SidebarSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
