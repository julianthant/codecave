'use client'

import React, { memo } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  className?: string
}

export const SearchBar = memo(function SearchBar({ className }: SearchBarProps) {
  return (
    <div className="max-w-xs">
      <label htmlFor="desktop-search" className="sr-only">
        Search
      </label>
      <Input
        id="desktop-search"
        name="search"
        type="search"
        placeholder="Search"
        autoComplete="off"
        className={cn(
          'block bg-white py-2 pr-3 pl-10 border border-gray-300 focus:border-[hsl(25_95%_65%)] rounded-md focus:outline-none focus:ring-1 focus:ring-[hsl(25_95%_65%)] w-full focus:text-gray-900 text-sm placeholder-gray-500 focus:placeholder-gray-400 transition-colors duration-200 ease-in-out',
          className
        )}
      />
    </div>
  )
})

export const MobileSearchBar = memo(function MobileSearchBar({ className }: SearchBarProps) {
  return (
    <div className="w-full max-w-md">
      <label htmlFor="mobile-search" className="sr-only">
        Search
      </label>
      <Input
        id="mobile-search"
        name="search"
        type="search"
        placeholder="Search"
        autoComplete="off"
        className={cn(
          'block bg-white py-2 pr-3 pl-10 border border-gray-300 focus:border-[hsl(25_95%_65%)] rounded-md focus:outline-none focus:ring-1 focus:ring-[hsl(25_95%_65%)] w-full focus:text-gray-900 text-sm placeholder-gray-500 focus:placeholder-gray-400 transition-colors duration-200 ease-in-out',
          className
        )}
      />
    </div>
  )
})
