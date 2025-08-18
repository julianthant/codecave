'use client'

import { useAuth } from '@/hooks/use-auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { User, Settings, FileText, Users, LogOut } from 'lucide-react'

export function UserMenu() {
  const { user, profile, signOut } = useAuth()

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative rounded-full w-8 h-8">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={user.user_metadata?.avatar_url || ''}
              alt={profile?.displayName || user.email || ''}
            />
            <AvatarFallback>
              {profile?.displayName?.[0]?.toUpperCase() ||
                user.email?.[0]?.toUpperCase() ||
                'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none">
              {profile?.displayName || 'User'}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              @{profile?.username || 'username'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/u/${profile?.username}`} className="cursor-pointer">
            <User className="mr-2 w-4 h-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <FileText className="mr-2 w-4 h-4" />
            <span>My Posts</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/groups" className="cursor-pointer">
            <Users className="mr-2 w-4 h-4" />
            <span>My Groups</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 w-4 h-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer">
          <LogOut className="mr-2 w-4 h-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
