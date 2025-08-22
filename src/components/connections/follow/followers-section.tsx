'use client'

import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Heart, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { GlobalConnectionCard } from '../shared/global-connection-card'
import type { Profile } from '@/types'

interface FollowerWithStatus extends Profile {
  isFollowingBack: boolean
}

export function FollowersSection() {
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch followers list
  const { data: followersData, isLoading, error } = useQuery({
    queryKey: ['connections', 'followers'],
    queryFn: async () => {
      const response = await fetch('/api/connections/followers?limit=100')
      if (!response.ok) {
        throw new Error('Failed to fetch followers list')
      }
      const result = await response.json()
      return result.data
    },
  })

  // Filter followers list based on search query
  const filteredFollowers = useMemo(() => {
    const followers = followersData?.followers || []
    
    if (!searchQuery.trim()) {
      return followers
    }

    const searchLower = searchQuery.toLowerCase()
    return followers.filter((user: FollowerWithStatus) =>
      user.displayName?.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.bio?.toLowerCase().includes(searchLower)
    )
  }, [followersData?.followers, searchQuery])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading followers list...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="py-12 text-center">
          <h3 className="mb-2 font-medium text-gray-900 text-lg">Unable to load followers list</h3>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  const totalFollowers = followersData?.total || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="font-semibold text-gray-900 text-xl">Followers</h2>
          <p className="text-gray-600 text-sm">
            {searchQuery ? filteredFollowers.length : totalFollowers} developer
            {(searchQuery ? filteredFollowers.length : totalFollowers) !== 1 ? 's' : ''} following you
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
        <Input
          placeholder="Search your followers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Followers List */}
      {filteredFollowers.length === 0 ? (
        <div className="py-12 text-center">
          <div className="flex justify-center items-center bg-gray-100 mx-auto mb-4 rounded-full w-24 h-24">
            {searchQuery ? (
              <Search className="w-8 h-8 text-gray-400" />
            ) : (
              <Heart className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <h3 className="mb-2 font-medium text-gray-900 text-lg">
            {searchQuery ? 'No results found' : 'No followers yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'Try adjusting your search criteria.'
              : 'Share great content and engage with the community to gain followers.'}
          </p>
        </div>
      ) : (
        <div className="gap-2 sm:gap-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFollowers.map((user: FollowerWithStatus) => (
            <GlobalConnectionCard
              key={`follower-mobile-${user.id}`}
              user={user}
              variant="follower"
              compact={true}
              className="sm:hidden block"
            />
          ))}
          {filteredFollowers.map((user: FollowerWithStatus) => (
            <GlobalConnectionCard
              key={`follower-desktop-${user.id}`}
              user={user}
              variant="follower"
              compact={false}
              className="hidden sm:block"
            />
          ))}
        </div>
      )}
    </div>
  )
}
