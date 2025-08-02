'use client'

import React, { useState, useCallback, memo } from 'react'
import { Menu, X } from 'lucide-react'
import { MobileNavTabs } from './mobile-nav-tabs'

export const MobileMenu = memo(function MobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  return (
    <>
      {/* Mobile and Tablet - Hamburger menu */}
      <div className="lg:hidden flex items-center">
        <button
          type="button"
          className="inline-flex justify-center items-center bg-white hover:bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(25_95%_65%)] focus:ring-offset-2 text-gray-400 hover:text-gray-500 transition-colors duration-200 ease-in-out"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
        >
          <span className="sr-only">{mobileMenuOpen ? 'Close' : 'Open'} main menu</span>
          {mobileMenuOpen ? (
            <X className="block w-6 h-6 transition-transform duration-200 ease-in-out" aria-hidden="true" />
          ) : (
            <Menu className="block w-6 h-6 transition-transform duration-200 ease-in-out" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Tabs */}
      <MobileNavTabs mobileMenuOpen={mobileMenuOpen} />
    </>
  )
})