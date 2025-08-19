import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

function MetricCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="space-y-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="w-24 h-4 bg-gray-200 rounded" />
          <div className="w-6 h-6 bg-gray-200 rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="w-16 h-8 bg-gray-200 rounded" />
          <div className="w-20 h-4 bg-gray-200 rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="w-32 h-5 bg-gray-200 rounded" />
        <div className="w-48 h-4 bg-gray-200 rounded" />
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px] bg-gray-200 rounded" />
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
            <div className="w-28 h-5 bg-gray-200 rounded" />
            <div className="w-40 h-4 bg-gray-200 rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded" />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-3 bg-gray-200 rounded" />
                    <div className="w-12 h-3 bg-gray-200 rounded" />
                    <div className="w-20 h-3 bg-gray-200 rounded" />
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="w-80 h-5 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="hidden sm:flex sm:items-center sm:space-x-2 sm:rounded-lg sm:bg-white sm:px-4 sm:py-2 sm:shadow-sm sm:border">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Metrics Grid Skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
          
          {/* Main Content Grid Skeleton */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <ChartSkeleton />
              <ChartSkeleton />
              <Card className="animate-pulse">
                <CardHeader>
                  <div className="w-32 h-5 bg-gray-200 rounded" />
                  <div className="w-48 h-4 bg-gray-200 rounded" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="w-full h-4 bg-gray-200 rounded" />
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-3 bg-gray-200 rounded" />
                          <div className="w-12 h-3 bg-gray-200 rounded" />
                          <div className="w-12 h-3 bg-gray-200 rounded" />
                          <div className="w-20 h-3 bg-gray-200 rounded ml-auto" />
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