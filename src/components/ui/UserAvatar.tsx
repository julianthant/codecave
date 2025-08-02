'use client'

import { cn } from '@/lib/utils'
import { Trophy, Shield, Crown } from 'lucide-react'
import Image from 'next/image'

interface UserAvatarProps {
  user: {
    id: string
    username: string
    display_name: string
    avatar_url?: string | null
    leetcode_rank?: string
    is_verified?: boolean
    is_admin?: boolean
  }
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showRank?: boolean
  className?: string
  onClick?: () => void
}

const sizeMap = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const rankColors = {
  Bronze: 'bg-orange-600',
  Silver: 'bg-gray-400',
  Gold: 'bg-yellow-500',
  Platinum: 'bg-purple-500',
  Diamond: 'bg-blue-500',
  Master: 'bg-red-500'
}

const rankIcons = {
  Bronze: Trophy,
  Silver: Trophy,
  Gold: Crown,
  Platinum: Crown,
  Diamond: Shield,
  Master: Shield
}

export function UserAvatar({
  user,
  size = 'md',
  showRank = true,
  className,
  onClick
}: UserAvatarProps) {
  const initials = user.display_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const RankIcon = user.leetcode_rank ? rankIcons[user.leetcode_rank as keyof typeof rankIcons] : null

  return (
    <div
      className={cn("relative inline-block", className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={cn(
        "relative overflow-hidden rounded-full bg-gradient-to-br from-gray-600 to-gray-700",
        sizeMap[size],
        onClick && "cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all"
      )}>
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt={`${user.display_name}'s avatar`}
            fill
            className="object-cover"
            sizes={`${parseInt(sizeMap[size].split(' ')[0].slice(2)) * 4}px`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-medium">
            <span className={cn(
              size === 'xs' && "text-xs",
              size === 'sm' && "text-sm",
              size === 'md' && "text-sm",
              size === 'lg' && "text-base",
              size === 'xl' && "text-xl"
            )}>
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Rank Badge */}
      {showRank && user.leetcode_rank && RankIcon && (size === 'md' || size === 'lg' || size === 'xl') && (
        <div className={cn(
          "absolute -bottom-1 -right-1 rounded-full flex items-center justify-center",
          "border-2 border-white",
          rankColors[user.leetcode_rank as keyof typeof rankColors],
          size === 'md' && "w-4 h-4",
          size === 'lg' && "w-5 h-5",
          size === 'xl' && "w-6 h-6"
        )}>
          <RankIcon className={cn(
            "text-white",
            size === 'md' && "w-2.5 h-2.5",
            size === 'lg' && "w-3 h-3",
            size === 'xl' && "w-3.5 h-3.5"
          )} />
        </div>
      )}

      {/* Admin/Verified Badge */}
      {user.is_admin && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <Shield className="w-2.5 h-2.5 text-white" />
        </div>
      )}
    </div>
  )
}