'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'

export function MyCollaborations() {
  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardContent className="flex flex-col justify-center items-center py-12">
          <Users className="mb-4 w-12 h-12 text-gray-400" />
          <h3 className="mb-2 font-semibold text-gray-900 text-lg">
            Your Active Collaborations
          </h3>
          <p className="max-w-md text-gray-600 text-sm text-center">
            Collaborations you&apos;re currently involved in will appear here.
            Start by applying to projects or posting your own!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
