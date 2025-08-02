'use client'

import React from 'react'
import {
  User,
  Settings,
  UserCircle,
  BookOpen,
  Code,
  Trophy,
  Bell,
  Moon,
  Sun,
  HelpCircle,
  Shield,
  LogOut,
  CreditCard,
  Users,
  MessageSquare,
  Bookmark,
  Eye,
  Github,
  ExternalLink,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { SignInButton } from './sign-in-button'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function UserAvatar() {
  const { isAuthenticated, user, profile, signOut } = useAuth()

  const getAvatarSrc = () => {
    if (isAuthenticated && user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url
    }
    if (isAuthenticated && profile?.avatar_url) {
      return profile.avatar_url
    }
    return null // Default avatar will be shown
  }

  const avatarSrc = getAvatarSrc()

  if (!isAuthenticated) {
    return <SignInButton redirectTo="/feed" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          aria-label="Profile menu"
          className="relative flex justify-center items-center bg-muted hover:bg-gray-200 p-0 rounded-full focus:outline-none w-10 h-10 overflow-hidden text-gray-600 hover:text-gray-900 transition-all duration-200 ease-in-out"
        >
          {avatarSrc ? (
            <img
              className="rounded-full w-full h-full object-cover"
              src={avatarSrc}
              alt="User avatar"
            />
          ) : (
            <User className="w-5 h-5" />
          )}
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72" sideOffset={8}>
        {/* User Info Section */}
        <div className="flex items-center space-x-3 px-4 py-3 border-b">
          {avatarSrc ? (
            <img
              className="rounded-full w-10 h-10 object-cover"
              src={avatarSrc}
              alt="User avatar"
            />
          ) : (
            <div className="flex justify-center items-center bg-[hsl(25_95%_65%)] rounded-full w-10 h-10">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {user?.user_metadata?.full_name ||
                user?.user_metadata?.name ||
                'Developer'}
            </p>
            <p className="text-gray-500 text-xs truncate">
              {user?.email || 'user@codecave.dev'}
            </p>
          </div>
        </div>

        {/* Profile & Activity */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-4 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
            Profile
          </DropdownMenuLabel>
          <DropdownMenuItem className="px-4 py-2 cursor-pointer">
            <Link
              href="/profile"
              className="flex items-center space-x-3 w-full"
            >
              <UserCircle className="w-4 h-4 text-gray-500" />
              <span>View Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2 cursor-pointer">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 w-full"
            >
              <Trophy className="w-4 h-4 text-gray-500" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2 cursor-pointer">
            <Link
              href="/activity"
              className="flex items-center space-x-3 w-full"
            >
              <Eye className="w-4 h-4 text-gray-500" />
              <span>Activity</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Social Features */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-4 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
            Social
          </DropdownMenuLabel>
          <DropdownMenuItem className="px-4 py-2 cursor-pointer">
            <Link
              href="/connections"
              className="flex items-center space-x-3 w-full"
            >
              <Users className="w-4 h-4 text-gray-500" />
              <span>Connections</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2 cursor-pointer">
            <Link
              href="/bookmarks"
              className="flex items-center space-x-3 w-full"
            >
              <Bookmark className="w-4 h-4 text-gray-500" />
              <span>Saved Posts</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Developer Tools */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-4 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
            Developer
          </DropdownMenuLabel>
          <DropdownMenuItem className="px-4 py-2 cursor-pointer">
            <Link
              href="/repositories"
              className="flex items-center space-x-3 w-full"
            >
              <Code className="w-4 h-4 text-gray-500" />
              <span>Repositories</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2 cursor-pointer">
            <Link
              href="/projects"
              className="flex items-center space-x-3 w-full"
            >
              <BookOpen className="w-4 h-4 text-gray-500" />
              <span>Projects</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2 cursor-pointer">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between items-center w-full"
            >
              <div className="flex items-center space-x-3">
                <Github className="w-4 h-4 text-gray-500" />
                <span>GitHub Profile</span>
              </div>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Settings & Preferences */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-4 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
            Preferences
          </DropdownMenuLabel>
          <DropdownMenuItem className="px-4 py-2 cursor-pointer">
            <Link
              href="/settings"
              className="flex items-center space-x-3 w-full"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2 cursor-pointer">
            <Link
              href="/notifications"
              className="flex items-center space-x-3 w-full"
            >
              <Bell className="w-4 h-4 text-gray-500" />
              <span>Notifications</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2 cursor-pointer">
            <Link
              href="/privacy"
              className="flex items-center space-x-3 w-full"
            >
              <Shield className="w-4 h-4 text-gray-500" />
              <span>Privacy</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Account & Billing */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="px-4 py-2 cursor-pointer">
            <Link
              href="/billing"
              className="flex items-center space-x-3 w-full"
            >
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span>Billing & Plans</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2 cursor-pointer">
            <Link href="/help" className="flex items-center space-x-3 w-full">
              <HelpCircle className="w-4 h-4 text-gray-500" />
              <span>Help & Support</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Sign Out */}
        <DropdownMenuItem
          className="focus:bg-red-50 px-4 py-2 text-red-600 focus:text-red-600 cursor-pointer"
          onClick={signOut}
        >
          <div className="flex items-center space-x-3 w-full">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
