'use client'

import React, { useCallback, useState } from 'react'
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

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    title: 'New project invitation',
    message: "You've been invited to join the React Dashboard project",
    time: '2 minutes ago',
    read: false,
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 2,
    title: 'Task completed',
    message: 'UI Design task has been marked as complete',
    time: '1 hour ago',
    read: false,
    avatar:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 3,
    title: 'Meeting reminder',
    message: 'Team standup meeting in 30 minutes',
    time: '3 hours ago',
    read: true,
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            className="relative flex justify-center items-center bg-muted hover:bg-gray-200 rounded-full focus:outline-none text-gray-600 hover:text-gray-900 transition-all duration-200 ease-in-out w-10 h-10"
            aria-label={`View notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="-top-1 right-0 absolute flex justify-center items-center bg-[hsl(25_95%_65%)] hover:bg-[hsl(25_95%_55%)] px-1 rounded-full w-4 h-4 font-medium text-white text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <DropdownMenuLabel className="p-0 font-semibold text-sm">
              Notifications
            </DropdownMenuLabel>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="font-medium text-[hsl(25_95%_65%)] hover:text-[hsl(25_95%_55%)] text-xs transition-colors duration-150"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col justify-center items-center px-4 py-8">
                <Bell className="mb-2 w-8 h-8 text-gray-300" />
                <p className="text-gray-500 text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                    !notification.read ? 'bg-[hsl(25_95%_65%)]/5' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className="relative flex-shrink-0">
                      <img
                        className="rounded-full w-8 h-8"
                        src={notification.avatar}
                        alt=""
                      />
                      {!notification.read && (
                        <Badge className="-top-0.5 -right-0.5 absolute bg-[hsl(25_95%_65%)] hover:bg-[hsl(25_95%_65%)] p-0 border-2 border-white rounded-full w-3 h-3">
                          <span className="sr-only">Unread</span>
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm leading-5">
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-gray-600 text-sm leading-5">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-gray-400 text-xs">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="px-4 py-3">
                <a
                  href="#"
                  className="font-medium text-[hsl(25_95%_65%)] hover:text-[hsl(25_95%_55%)] text-sm transition-colors duration-150"
                >
                  View all notifications →
                </a>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
