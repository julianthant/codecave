import React from 'react'
import { CreditCard, HelpCircle, LogOut } from 'lucide-react'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

interface AccountSectionProps {
  onSignOut: () => void
}

export function AccountSection({ onSignOut }: AccountSectionProps) {
  return (
    <>
      {/* Account & Billing */}
      <DropdownMenuGroup>
        <DropdownMenuItem className="px-4 py-2 cursor-pointer">
          <Link href="/billing" className="flex items-center space-x-3 w-full">
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
        onClick={onSignOut}
      >
        <div className="flex items-center space-x-3 w-full">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </div>
      </DropdownMenuItem>
    </>
  )
}