import React from 'react'
import { Settings, Bell, Shield } from 'lucide-react'
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

export function PreferencesSection() {
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="px-4 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
        Preferences
      </DropdownMenuLabel>
      <DropdownMenuItem className="px-4 py-2 cursor-pointer">
        <Link href="/settings" className="flex items-center space-x-3 w-full">
          <Settings className="w-4 h-4 text-gray-500" />
          <span>Settings</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="px-4 py-2 cursor-pointer">
        <Link href="/notifications" className="flex items-center space-x-3 w-full">
          <Bell className="w-4 h-4 text-gray-500" />
          <span>Notifications</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="px-4 py-2 cursor-pointer">
        <Link href="/privacy" className="flex items-center space-x-3 w-full">
          <Shield className="w-4 h-4 text-gray-500" />
          <span>Privacy</span>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  )
}