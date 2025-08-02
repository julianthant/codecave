'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserAvatar } from './UserAvatar'
import { PenSquare, Code, Image, Hash } from 'lucide-react'

interface CreatePostCardProps {
  userId: string
  user?: any
  className?: string
}

export function CreatePostCard({ userId, user, className }: CreatePostCardProps) {
  const router = useRouter()
  const [isFocused, setIsFocused] = useState(false)

  const quickActions = [
    { icon: PenSquare, label: 'Article', type: 'article' },
    { icon: Code, label: 'Code', type: 'snippet' },
    { icon: Image, label: 'Showcase', type: 'showcase' },
    { icon: Hash, label: 'Discuss', type: 'discussion' },
  ]

  const handleClick = () => {
    router.push('/editor/new')
  }

  const handleQuickAction = (type: string) => {
    router.push(`/editor/new?type=${type}`)
  }

  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-xl p-4",
      "transition-all duration-200",
      isFocused && "border-gray-300 shadow-sm",
      className
    )}>
      <div className="flex items-start space-x-3">
        {user && <UserAvatar user={user} size="md" />}

        <div className="flex-1">
          <button
            onClick={handleClick}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full px-4 py-3 text-left",
              "bg-gray-50 rounded-lg border border-transparent",
              "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            )}
          >
            What's on your mind?
          </button>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 mt-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.type}
                  onClick={() => handleQuickAction(action.type)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-1.5",
                    "text-sm text-gray-600 hover:text-gray-900",
                    "hover:bg-gray-50 rounded-lg",
                    "transition-colors duration-200"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}