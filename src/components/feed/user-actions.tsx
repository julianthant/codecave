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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[hsl(25_95%_65%)] focus:ring-offset-2 transition-all duration-200 ease-in-out"
          aria-label={`View notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive"
              className="absolute top-0 left-0 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-medium text-white bg-[hsl(25_95%_65%)] hover:bg-[hsl(25_95%_55%)] rounded-full"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <DropdownMenuLabel className="text-sm font-semibold p-0">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-medium text-[hsl(25_95%_65%)] hover:text-[hsl(25_95%_55%)] transition-colors duration-150"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <Bell className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No notifications</p>
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
                      className="w-8 h-8 rounded-full"
                      src={notification.avatar}
                      alt=""
                    />
                    {!notification.read && (
                      <Badge className="absolute -top-0.5 -right-0.5 w-3 h-3 p-0 bg-[hsl(25_95%_65%)] hover:bg-[hsl(25_95%_65%)] rounded-full border-2 border-white">
                        <span className="sr-only">Unread</span>
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-5">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5 leading-5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
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
                className="text-sm font-medium text-[hsl(25_95%_65%)] hover:text-[hsl(25_95%_55%)] transition-colors duration-150"
              >
                View all notifications →
              </a>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function UserAvatar() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-[hsl(25_95%_65%)] focus:ring-offset-2 hover:ring-2 hover:ring-gray-200 transition-all duration-200 ease-in-out"
        >
          <span className="sr-only">Open user menu</span>
          <img
            className="w-8 h-8 rounded-full border-2 border-transparent hover:border-gray-200 transition-colors duration-200"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <a href="#" className="w-full">
            Your Profile
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a href="#" className="w-full">
            Settings
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <a href="#" className="w-full">
            Sign out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Keep original for backward compatibility but now just returns notification icon
export function UserActions() {
  return <NotificationIcon />
}

export function MobileUserAvatar() {
  return (
    <div className="flex-shrink-0">
      <img
        className="rounded-full w-10 h-10"
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt=""
      />
    </div>
  )
}

export function MobileActions() {
  return (
    <button
      type="button"
      className="flex-shrink-0 bg-white ml-auto p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-gray-400 hover:text-gray-500"
    >
      <span className="sr-only">View notifications</span>
      <Bell className="w-6 h-6" aria-hidden="true" />
    </button>
  )
}
