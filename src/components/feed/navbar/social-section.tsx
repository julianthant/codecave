import React from 'react'
import { Users, Bookmark } from 'lucide-react'
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

export function SocialSection() {
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="px-4 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
        Social
      </DropdownMenuLabel>
      <DropdownMenuItem className="px-4 py-2 cursor-pointer">
        <Link href="/connections" className="flex items-center space-x-3 w-full">
          <Users className="w-4 h-4 text-gray-500" />
          <span>Connections</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="px-4 py-2 cursor-pointer">
        <Link href="/bookmarks" className="flex items-center space-x-3 w-full">
          <Bookmark className="w-4 h-4 text-gray-500" />
          <span>Saved Posts</span>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  )
}