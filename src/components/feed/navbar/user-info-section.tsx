import React from 'react'
import { User } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface UserInfoSectionProps {
  user: SupabaseUser | null
  avatarSrc: string | null
}

export function UserInfoSection({ user, avatarSrc }: UserInfoSectionProps) {
  return (
    <div className="flex items-center space-x-3 px-4 py-3 border-b">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarSrc || undefined} alt="User avatar" />
        <AvatarFallback className="bg-[hsl(25_95%_65%)] text-white">
          <User className="w-5 h-5" />
        </AvatarFallback>
      </Avatar>
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
  )
}