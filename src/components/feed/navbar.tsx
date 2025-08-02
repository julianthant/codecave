import React from 'react'
import { Search } from 'lucide-react'
import { UserActions, UserAvatar } from './user-actions'
import { SearchBar, MobileSearchBar } from './search-bar'
import { MobileMenu } from './mobile-menu'
import { DesktopNav } from './desktop-nav'
import { LogoBlack, Logo } from '../ui/logo'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="top-0 z-50 sticky bg-white/95 supports-[backdrop-filter]:bg-white/60 shadow-sm backdrop-blur-sm border-gray-200 border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-2">
              <Link
                href="/feed"
                aria-label="Navigate to feed"
                className="max-md:hidden rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(25_95%_65%)] focus-visible:ring-offset-2"
              >
                <LogoBlack />
              </Link>
              <Link
                href="/feed"
                aria-label="Navigate to feed"
                className="md:hidden rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(25_95%_65%)] focus-visible:ring-offset-2"
              >
                <Logo className="w-7 h-7" />
              </Link>
            </div>

            {/* Desktop Navigation - Server side rendered */}
            <DesktopNav />
          </div>

          {/* Center - Search bar (mobile and tablet) */}
          <div className="lg:hidden flex flex-1 justify-center items-center px-2">
            <div className="relative w-full max-w-md">
              <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
              <MobileSearchBar />
            </div>
          </div>

          {/* Desktop - Search and actions with proper order */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6 lg:ml-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
              <SearchBar />
            </div>

            {/* Notification Icon */}
            <div className="flex-shrink-0">
              <UserActions />
            </div>

            {/* User Avatar (rightmost) */}
            <div className="flex-shrink-0">
              <UserAvatar />
            </div>
          </div>

          {/* Mobile Menu with client-side state */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  )
}
