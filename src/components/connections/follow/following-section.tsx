'use client'

import React, { useState } from 'react'
import { Search, UserMinus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { GlobalConnectionCard } from '../shared/global-connection-card'
import { mockFollowing } from '@/lib/mock-data/connections-data'

export function FollowingSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredFollowing, setFilteredFollowing] = useState(mockFollowing)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredFollowing(mockFollowing)
      return
    }
    
    const filtered = mockFollowing.filter(user =>
      user.displayName.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.bio?.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredFollowing(filtered)
  }

  const handleUnfollow = (userId: string) => {
    const updated = filteredFollowing.filter(user => user.id !== userId)
    setFilteredFollowing(updated)
    console.log('Unfollow user:', userId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Following
          </h2>
          <p className="text-sm text-gray-600">
            {filteredFollowing.length} developer{filteredFollowing.length !== 1 ? 's' : ''} you follow
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search people you follow..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Following List */}
      {filteredFollowing.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            {searchQuery ? (
              <Search className="w-8 h-8 text-gray-400" />
            ) : (
              <UserMinus className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No results found' : 'Not following anyone yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Discover interesting developers in the Discover tab.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFollowing.map((user) => (
            <GlobalConnectionCard
              key={`following-mobile-${user.id}`}
              user={user}
              variant="following"
              compact={true}
              className="block sm:hidden"
            />
          ))}
          {filteredFollowing.map((user) => (
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