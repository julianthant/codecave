'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Mail } from 'lucide-react'

export function CollaborationInvitations() {
  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardContent className="flex flex-col justify-center items-center py-12">
          <Mail className="mb-4 w-12 h-12 text-gray-400" />
          <h3 className="mb-2 font-semibold text-gray-900 text-lg">
            No Invitations Yet
          </h3>
          <p className="max-w-md text-gray-600 text-sm text-center">
            When other developers invite you to collaborate on their projects,
            you&apos;ll see those invitations here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
