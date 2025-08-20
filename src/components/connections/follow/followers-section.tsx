'use client'

import React, { useState } from 'react'
import { Search, Heart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { GlobalConnectionCard } from '../shared/global-connection-card'
import { mockFollowers } from '@/lib/mock-data/connections-data'

export function FollowersSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredFollowers, setFilteredFollowers] = useState(mockFollowers)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredFollowers(mockFollowers)
      return
    }

    const filtered = mockFollowers.filter(
      (user) =>
        user.displayName.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.bio?.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredFollowers(filtered)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="font-semibold text-gray-900 text-xl">Followers</h2>
          <p className="text-gray-600 text-sm">
            {filteredFollowers.length} developer
            {filteredFollowers.length !== 1 ? 's' : ''} following you
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
        <Input
          placeholder="Search your followers..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
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
          {filteredFollowers.map((user) => (
            <GlobalConnectionCard
              key={`follower-mobile-${user.id}`}
              user={user}
              variant="follower"
              compact={true}
              className="sm:hidden block"
            />
          ))}
          {filteredFollowers.map((user) => (
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
