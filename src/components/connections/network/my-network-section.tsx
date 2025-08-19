'use client'

import React, { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlobalConnectionCard } from '../shared/global-connection-card'
import { NetworkFilters } from './network-filters'
import { mockMyConnections } from '@/lib/mock-data/connections-data'
import { cn } from '@/lib/utils'

export function MyNetworkSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filteredConnections, setFilteredConnections] = useState(mockMyConnections)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredConnections(mockMyConnections)
      return
    }
    
    const filtered = mockMyConnections.filter(user =>
      user.displayName.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.bio?.toLowerCase().includes(query.toLowerCase()) ||
      user.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
    )
    setFilteredConnections(filtered)
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            My Network
          </h2>
          <p className="text-sm text-gray-600">
            {filteredConnections.length} connection{filteredConnections.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center space-x-2",
              showFilters && "bg-orange-50 border-orange-200 text-orange-600"
            )}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search your connections..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <NetworkFilters
          onFiltersChange={(filters) => {
            let filtered = mockMyConnections

            // Apply search filter
            if (searchQuery.trim()) {
              filtered = filtered.filter(user =>
                user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
              )
            }

            // Apply skill filters
            if (filters.skills.length > 0) {
              filtered = filtered.filter(user =>
                filters.skills.some(skill => user.skills.includes(skill))
              )
            }

            // Apply experience level filters
            if (filters.experienceLevels.length > 0) {
              filtered = filtered.filter(user =>
                filters.experienceLevels.includes(user.experienceLevel)
              )
            }

            // Apply availability filter
            if (filters.availability !== null) {
              filtered = filtered.filter(user => user.availableForCollab === filters.availability)
            }

            setFilteredConnections(filtered)
          }}
        />
      )}

      {/* Connections Display */}
      {filteredConnections.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No connections found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Start connecting with other developers to grow your network.'}
          </p>
          <Button onClick={() => handleSearch('')}>
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filteredConnections.map((user) => (
            <GlobalConnectionCard
              key={`mobile-${user.id}`}
              user={user}
              variant="connection"
              compact={true}
              className="block sm:hidden"
            />
          ))}
          {filteredConnections.map((user) => (
            <GlobalConnectionCard
              key={`desktop-${user.id}`}
              user={user}
              variant="connection"
              compact={false}
              className="hidden sm:block"
            />
          ))}
        </div>
      )}
    </div>
  )
}