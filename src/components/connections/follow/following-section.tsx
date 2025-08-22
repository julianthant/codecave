'use client'

import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, UserMinus, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { GlobalConnectionCard } from '../shared/global-connection-card'
import type { Profile } from '@/types'

export function FollowingSection() {
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch following list
  const { data: followingData, isLoading, error } = useQuery({
    queryKey: ['connections', 'following'],
    queryFn: async () => {
      const response = await fetch('/api/connections/following?limit=100')
      if (!response.ok) {
        throw new Error('Failed to fetch following list')
      }
      const result = await response.json()
      return result.data
    },
  })

  // Filter following list based on search query
  const filteredFollowing = useMemo(() => {
    const following = followingData?.following || []
    
    if (!searchQuery.trim()) {
      return following
    }

    const searchLower = searchQuery.toLowerCase()
    return following.filter((user: Profile) =>
      user.displayName?.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.bio?.toLowerCase().includes(searchLower)
    )
  }, [followingData?.following, searchQuery])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading following list...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="py-12 text-center">
          <h3 className="mb-2 font-medium text-gray-900 text-lg">Unable to load following list</h3>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  const totalFollowing = followingData?.total || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="font-semibold text-gray-900 text-xl">Following</h2>
          <p className="text-gray-600 text-sm">
            {searchQuery ? filteredFollowing.length : totalFollowing} developer
            {(searchQuery ? filteredFollowing.length : totalFollowing) !== 1 ? 's' : ''} you follow
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
        <Input
          placeholder="Search people you follow..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Following List */}
      {filteredFollowing.length === 0 ? (
        <div className="py-12 text-center">
          <div className="flex justify-center items-center bg-gray-100 mx-auto mb-4 rounded-full w-24 h-24">
            {searchQuery ? (
              <Search className="w-8 h-8 text-gray-400" />
            ) : (
              <UserMinus className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <h3 className="mb-2 font-medium text-gray-900 text-lg">
            {searchQuery ? 'No results found' : 'Not following anyone yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'Try adjusting your search criteria.'
              : 'Discover interesting developers in the Discover tab.'}
          </p>
        </div>
      ) : (
        <div className="gap-2 sm:gap-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFollowing.map((user: Profile) => (
            <GlobalConnectionCard
              key={`following-mobile-${user.id}`}
              user={user}
              variant="following"
              compact={true}
              className="sm:hidden block"
            />
          ))}
          {filteredFollowing.map((user: Profile) => (
            <GlobalConnectionCard
              key={`following-desktop-${user.id}`}
              user={user}
              variant="following"
              compact={false}
              className="hidden sm:block"
            />
          ))}
        </div>
      )}
    </div>
  )
}
