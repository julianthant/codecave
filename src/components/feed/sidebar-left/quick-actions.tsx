'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Bookmark, Users, Mail, Calendar, Video, Code2 } from 'lucide-react'
import { toast } from 'sonner'

export function QuickActions() {
  const handleQuickAction = (action: string, path?: string) => {
    if (path) {
      // In a real app, navigate to the path
      toast.success(`Navigating to ${action}...`)
    } else {
      toast.success(`Opening ${action}...`)
    }
  }

  const actions = [
    {
      icon: Bookmark,
      label: 'Saved Items',
      path: '/saved',
    },
    {
      icon: Users,
      label: 'Groups',
      path: '/groups',
    },
    {
      icon: Mail,
      label: 'Newsletters',
      path: '/newsletters',
    },
    {
      icon: Calendar,
      label: 'Events',
      path: '/events',
    },
    {
      icon: Video,
      label: 'Cave Sessions',
      path: '/sessions',
    },
    {
      icon: Code2,
      label: 'Code Vault',
      path: '/vault',
    },
  ]

  return (
    <Card className="bg-white py-4 border-gray-200">
      <CardContent className="space-y-1">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.label, action.path)}
              className="group flex items-center space-x-3 hover:bg-gray-50 py-2 rounded-md w-full text-left transition-colors duration-150"
            >
              <Icon className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
              <span className="font-semibold text-gray-900 group-hover:text-gray-700 text-sm">
                {action.label}
              </span>
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}
