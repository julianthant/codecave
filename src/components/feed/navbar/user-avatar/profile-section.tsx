import React from 'react'
import { UserCircle, Trophy, Eye } from 'lucide-react'
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'

export function ProfileSection() {
  const { profile } = useAuth()

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="px-4 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
        Profile
      </DropdownMenuLabel>
      <DropdownMenuItem className="px-4 py-2 cursor-pointer">
        <Link
          href={`/profile/${profile?.username}`}
          className="flex items-center space-x-3 w-full"
        >
          <UserCircle className="w-4 h-4 text-gray-500" />
          <span>View Profile</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="px-4 py-2 cursor-pointer">
        <Link href="/dashboard" className="flex items-center space-x-3 w-full">
          <Trophy className="w-4 h-4 text-gray-500" />
          <span>Dashboard</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="px-4 py-2 cursor-pointer">
        <Link href="/activity" className="flex items-center space-x-3 w-full">
          <Eye className="w-4 h-4 text-gray-500" />
          <span>Activity</span>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  )
}
