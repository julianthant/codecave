'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ConnectionsErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ConnectionsError({
  error,
  reset,
}: ConnectionsErrorProps) {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-65px)]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="flex justify-center items-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center items-center bg-red-100 mx-auto mb-4 rounded-full w-12 h-12">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="font-semibold text-gray-900 text-xl">
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-gray-600">
                We couldn&apos;t load your connections. This might be a
                temporary issue.
              </p>

              <Button onClick={reset} className="w-full" variant="default">
                <RefreshCw className="mr-2 w-4 h-4" />
                Try Again
              </Button>

              <p className="text-gray-500 text-xs">Error ID: {error.digest}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
