'use client'

import React, { useCallback } from 'react'
import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { SignInButton } from './sign-in-button'
import Image from 'next/image'

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'invitation',
    title: 'Project Invitation',
    message: 'Sarah invited you to join the React Dashboard project',
    time: '2 minutes ago',
    read: false,
    avatar: 'https://ui-avatars.com/api/?name=Sarah&background=6366f1&color=ffffff&size=36',
    actionUrl: '/projects/react-dashboard',
  },
  {
    id: 2,
    type: 'like',
    title: 'New Like',
    message: 'Alex liked your post about TypeScript best practices',
    time: '15 minutes ago',
    read: false,
    avatar: 'https://ui-avatars.com/api/?name=Alex&background=10b981&color=ffffff&size=36',
    actionUrl: '/posts/typescript-practices',
  },
  {
    id: 3,
    type: 'comment',
    title: 'New Comment',
    message: 'Jordan commented on your "Building with Next.js" post',
    time: '1 hour ago',
    read: false,
    avatar: 'https://ui-avatars.com/api/?name=Jordan&background=f59e0b&color=ffffff&size=36',
    actionUrl: '/posts/building-nextjs',
  },
  {
    id: 4,
    type: 'follow',
    title: 'New Follower',
    message: 'Maya started following you',
    time: '2 hours ago',
    read: true,
    avatar: 'https://ui-avatars.com/api/?name=Maya&background=ec4899&color=ffffff&size=36',
    actionUrl: '/profile/maya',
  },
  {
    id: 5,
    type: 'mention',
    title: 'Mention',
    message: 'Chris mentioned you in a discussion about React hooks',
    time: '1 day ago',
    read: true,
    avatar: 'https://ui-avatars.com/api/?name=Chris&background=8b5cf6&color=ffffff&size=36',
    actionUrl: '/discussions/react-hooks',
  },
]

export function NotificationIcon() {
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = React.useState(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    )
  }, [])

  if (!isAuthenticated) {
    return (
      <SignInButton redirectTo="/feed" aria-label="View notifications">
        <Bell className="w-5 h-5" aria-hidden="true" />
      </SignInButton>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 rounded-full hover:bg-muted/50 focus:outline-none transition-colors"
          aria-label={`View notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium bg-red-500 text-white rounded-full border-2 border-background"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs font-medium text-primary hover:text-primary/80"
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Notification List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12">
              <Bell className="w-8 h-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`px-4 py-3 cursor-pointer border-none focus:bg-muted/50 ${
                  !notification.read ? 'bg-blue-50/50 hover:bg-blue-50/80' : 'hover:bg-muted/30'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3 w-full">
                  <div className="relative flex-shrink-0">
                    <Image
                      className="w-9 h-9 rounded-full"
                      src={notification.avatar}
                      alt={`${notification.title} avatar`}
                      width={36}
                      height={36}
                    />
                    {!notification.read && (
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-tight line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-center text-sm font-medium text-primary hover:text-primary/80 hover:bg-muted/50"
                asChild
              >
                <a href="/notifications">
                  View all notifications
                </a>
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
