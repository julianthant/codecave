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
    
    const filtered = mockFollowers.filter(user =>
      user.displayName.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.bio?.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredFollowers(filtered)
  }

  const handleFollowBack = (userId: string) => {
    console.log('Follow back user:', userId)
  }

  const handleRemoveFollower = (userId: string) => {
    const updated = filteredFollowers.filter(user => user.id !== userId)
    setFilteredFollowers(updated)
    console.log('Remove follower:', userId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Followers
          </h2>
          <p className="text-sm text-gray-600">
            {filteredFollowers.length} developer{filteredFollowers.length !== 1 ? 's' : ''} following you
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search your followers..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Followers List */}
      {filteredFollowers.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            {searchQuery ? (
              <Search className="w-8 h-8 text-gray-400" />
            ) : (
              <Heart className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No results found' : 'No followers yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Share great content and engage with the community to gain followers.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFollowers.map((user) => (
            <GlobalConnectionCard
              key={`follower-mobile-${user.id}`}
              user={user}
              variant="follower"
              compact={true}
              className="block sm:hidden"
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