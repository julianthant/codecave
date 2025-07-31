'use client'

import { useAuthStore } from '@/stores/auth.store'
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
import { User, Settings, FileText, Users, LogOut, Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function UserMenu() {
  const { user, profile, setUser, setProfile } = useAuthStore()
  const router = useRouter()

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Immediately clear the auth store to prevent UI issues
    setUser(null)
    setProfile(null)
    
    // Show loading state
    toast.loading('Signing out...', { id: 'signout' })

    try {
      // Use the server-side sign out endpoint
      const response = await fetch('/auth/signout', {
        method: 'POST',
      })
      
      if (response.ok) {
        toast.success('Signed out successfully', { id: 'signout' })
      } else {
        throw new Error('Sign out failed')
      }
    } catch {
      console.log('Server signout failed, clearing local state')
      toast.success('Signed out successfully', { id: 'signout' })
    }
    
    // Always redirect and refresh
    router.push('/')
    window.location.href = '/' // Force a full page reload to clear all state
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative rounded-full w-8 h-8">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={user.user_metadata?.avatar_url || ''}
              alt={profile?.display_name || user.email || ''}
            />
            <AvatarFallback>
              {profile?.display_name?.[0]?.toUpperCase() ||
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
              {profile?.display_name || 'User'}
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
        {profile?.is_pro && (
          <DropdownMenuItem asChild>
            <Link href="/pro" className="text-blue-600 cursor-pointer">
              <Crown className="mr-2 w-4 h-4" />
              <span>Pro Settings</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 w-4 h-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
