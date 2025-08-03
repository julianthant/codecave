'use client'

import React from 'react'
import { User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { SignInButton } from './sign-in-button'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { UserInfoSection } from './user-info-section'
import { ProfileSection } from './profile-section'
import { SocialSection } from './social-section'
import { DeveloperSection } from './developer-section'
import { PreferencesSection } from './preferences-section'
import { AccountSection } from './account-section'

export function UserAvatar() {
  const { isAuthenticated, user, profile, signOut } = useAuth()

  const getAvatarSrc = () => {
    if (isAuthenticated && user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url
    }
    if (isAuthenticated && profile?.avatar_url) {
      return profile.avatar_url
    }
    return null
  }

  const avatarSrc = getAvatarSrc()

  if (!isAuthenticated) {
    return <SignInButton redirectTo="/feed" aria-label="Sign in" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Profile menu"
          className="relative rounded-full p-0 h-10 w-10 hover:bg-gray-100 focus:outline-none transition-all duration-200 ease-in-out"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarSrc || undefined} alt="User avatar" />
            <AvatarFallback className="bg-[hsl(25_95%_65%)] text-white">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-72" sideOffset={8}>
        <UserInfoSection user={user} avatarSrc={avatarSrc} />
        
        <ProfileSection />
        <DropdownMenuSeparator />
        
        <SocialSection />
        <DropdownMenuSeparator />
        
        <DeveloperSection />
        <DropdownMenuSeparator />
        
        <PreferencesSection />
        <DropdownMenuSeparator />
        
        <AccountSection onSignOut={signOut} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}