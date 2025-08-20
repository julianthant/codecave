'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export function PostedCollaborations() {
  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardContent className="flex flex-col justify-center items-center py-12">
          <FileText className="mb-4 w-12 h-12 text-gray-400" />
          <h3 className="mb-2 font-semibold text-gray-900 text-lg">
            Your Posted Collaborations
          </h3>
          <p className="max-w-md text-gray-600 text-sm text-center">
            Collaboration opportunities you&apos;ve posted will appear here.
            Post your first project to find team members!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
