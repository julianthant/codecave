'use client'

import React, { useState, useCallback } from 'react'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

interface NavItemProps {
  label: string
  href?: string
  active?: boolean
  onClick?: () => void
}

function NavItem({ label, href = '#', active = false, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'block border-l-4 py-2 pl-3 pr-4 text-base font-medium',
        active
          ? 'border-[hsl(25_95%_65%)] bg-[hsl(25_95%_65%)]/10 text-[hsl(25_95%_45%)]'
          : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
      )}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}

interface MobileNavTabsProps {
  mobileMenuOpen: boolean
}

const navigation = [
  { name: 'Dashboard', href: '#dashboard' },
  { name: 'Team', href: '#team' },
  { name: 'Projects', href: '#projects' },
  { name: 'Calendar', href: '#calendar' },
] as const

export function MobileNavTabs({ mobileMenuOpen }: MobileNavTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('Dashboard')

  const handleTabClick = useCallback((tabName: string) => {
    setActiveTab(tabName)
  }, [])

  if (!mobileMenuOpen) return null

  return (
    <div className="lg:hidden border-gray-200 border-t">
      <div className="space-y-1 pt-2 pb-3">
        {navigation.map((item) => (
          <NavItem
            key={item.name}
            label={item.name}
            href={item.href}
            active={activeTab === item.name}
            onClick={() => handleTabClick(item.name)}
          />
        ))}
      </div>
      <div className="pt-4 pb-3 border-gray-200 border-t">
        <div className="flex items-center px-4">
          <div className="flex-shrink-0">
            <Image
              className="rounded-full w-10 h-10"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User avatar"
              width={40}
              height={40}
            />
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-800 text-base">
              Tom Cook
            </div>
            <div className="font-medium text-gray-500 text-sm">
              tom@example.com
            </div>
          </div>
          <button
            type="button"
            className="flex-shrink-0 bg-white ml-auto p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[hsl(25_95%_65%)] focus:ring-offset-2 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        <div className="space-y-1 mt-3">
          <a
            href="#"
            className="block hover:bg-gray-100 px-4 py-2 font-medium text-gray-500 hover:text-gray-800 text-base"
          >
            Your Profile
          </a>
          <a
            href="#"
            className="block hover:bg-gray-100 px-4 py-2 font-medium text-gray-500 hover:text-gray-800 text-base"
          >
            Settings
          </a>
          <a
            href="#"
            className="block hover:bg-gray-100 px-4 py-2 font-medium text-gray-500 hover:text-gray-800 text-base"
          >
            Sign out
          </a>
        </div>
      </div>
    </div>
  )
}