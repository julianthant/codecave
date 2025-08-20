'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-65px)]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center items-center bg-red-100 mx-auto mb-4 rounded-full w-12 h-12">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="font-semibold text-xl">
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-gray-600">
                We encountered an error while loading your dashboard. This might
                be a temporary issue.
              </p>

              {error.digest && (
                <p className="bg-gray-50 p-2 rounded font-mono text-gray-400 text-xs">
                  Error ID: {error.digest}
                </p>
              )}

              <div className="flex sm:flex-row flex-col justify-center gap-3">
                <Button
                  onClick={reset}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <RefreshCw className="mr-2 w-4 h-4" />
                  Try again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = '/feed')}
                >
                  Go to Feed
                </Button>
              </div>

              <p className="text-gray-500 text-xs">
                If this problem persists, please contact support.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
