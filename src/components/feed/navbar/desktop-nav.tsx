'use client'

import React from 'react'
import { Button } from '../../ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Connections', href: '/connections' },
  { name: 'Collaborations', href: '/collaborations' },
] as const

export function DesktopNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <nav className="hidden lg:flex lg:space-x-4 lg:ml-6" aria-label="Global">
      {navigation.map((item) => (
        <Button
          variant="ghost"
          key={item.name}
          asChild
          className={cn(
            'inline-flex relative items-center px-3 font-medium text-sm transition-colors duration-200 ease-in-out',
            isActive(item.href)
              ? 'text-gray-900 bg-muted'
              : 'text-gray-500 hover:text-gray-700'
          )}
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          <Link
            href={item.href}
            className="rounded-md focus:outline-none focus-visible:ring-[hsl(25_95%_65%)] focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {item.name}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
