import { format } from 'date-fns'
import { Calendar } from 'lucide-react'

export function DashboardHeader() {
  const currentDate = new Date()
  const formattedDate = format(currentDate, 'EEEE, MMMM do, yyyy')

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-gray-900 text-3xl tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <div className="hidden sm:flex sm:items-center sm:space-x-2 sm:bg-white sm:shadow-sm sm:px-4 sm:py-2 sm:border sm:rounded-lg">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700 text-sm">{formattedDate}</span>
        </div>
      </div>
    </div>
  )
}
