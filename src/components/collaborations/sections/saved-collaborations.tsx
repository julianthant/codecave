'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Bookmark } from 'lucide-react'

export function SavedCollaborations() {
  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardContent className="flex flex-col justify-center items-center py-12">
          <Bookmark className="mb-4 w-12 h-12 text-gray-400" />
          <h3 className="mb-2 font-semibold text-gray-900 text-lg">
            No Saved Collaborations
          </h3>
          <p className="max-w-md text-gray-600 text-sm text-center">
            Save interesting collaboration opportunities to review them later.
            Your saved items will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
