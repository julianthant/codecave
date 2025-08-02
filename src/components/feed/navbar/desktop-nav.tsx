'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '../../ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '#dashboard' },
  { name: 'Team', href: '#team' },
  { name: 'Projects', href: '#projects' },
  { name: 'Calendar', href: '#calendar' },
] as const

export function DesktopNav() {
  const [activeTab, setActiveTab] = useState<string>('Dashboard')

  const handleTabClick = useCallback((tabName: string) => {
    setActiveTab(tabName)
  }, [])

  return (
    <nav className="hidden lg:flex lg:space-x-4 lg:ml-6" aria-label="Global">
      {navigation.map((item) => (
        <Button
          variant="ghost"
          key={item.name}
          asChild
          className={cn(
            'inline-flex relative items-center px-3 font-medium text-sm transition-colors duration-200 ease-in-out',
            activeTab === item.name
              ? 'text-gray-900 bg-muted'
              : 'text-gray-500 hover:text-gray-700'
          )}
          aria-current={activeTab === item.name ? 'page' : undefined}
        >
          <Link
            href={item.href}
            onClick={() => handleTabClick(item.name)}
            className="rounded-md focus:outline-none focus-visible:ring-[hsl(25_95%_65%)] focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {item.name}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
