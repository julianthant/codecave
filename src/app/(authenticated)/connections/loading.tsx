import { Skeleton } from '@/components/ui/skeleton'

export default function ConnectionsLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-8">
          <Skeleton className="mb-2 w-48 h-9" />
          <Skeleton className="w-96 h-5" />
        </div>

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            <Skeleton className="w-full h-12" />
            <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="space-y-4 bg-white p-6 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Skeleton className="rounded-full w-12 h-12" />
                    <div>
                      <Skeleton className="mb-1 w-24 h-4" />
                      <Skeleton className="w-16 h-3" />
                    </div>
                  </div>
                  <Skeleton className="w-full h-12" />
                  <div className="flex space-x-2">
                    <Skeleton className="w-16 h-6" />
                    <Skeleton className="w-20 h-6" />
                    <Skeleton className="w-18 h-6" />
                  </div>
                  <Skeleton className="w-full h-9" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-1">
            <div className="space-y-4 bg-white p-6 border rounded-lg">
              <Skeleton className="w-32 h-5" />
              <div className="space-y-3">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-28 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
