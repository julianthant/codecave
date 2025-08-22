'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Sparkles, TrendingUp, Loader2 } from 'lucide-react'
import { GlobalConnectionCard } from '../shared/global-connection-card'
import type { Profile } from '@/types'

interface SuggestionWithMutuals extends Profile {
  mutualConnections: number
}

export function DiscoverSection() {
  // Fetch connection suggestions
  const { data: suggestions, isLoading, error } = useQuery<SuggestionWithMutuals[]>({
    queryKey: ['connections', 'suggestions'],
    queryFn: async () => {
      const response = await fetch('/api/connections/suggestions?limit=20')
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions')
      }
      const result = await response.json()
      return result.data
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading suggestions...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="py-12 text-center">
          <h3 className="mb-2 font-medium text-gray-900 text-lg">Unable to load suggestions</h3>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  const allSuggestions = suggestions || []
  const peopleSuggestions = allSuggestions.slice(0, 8)
  const trendingSuggestions = allSuggestions.slice(2, 6)

  return (
    <div className="space-y-8">
      {/* People You May Know */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900 text-xl">
              People You May Know
            </h2>
          </div>
          <button className="font-medium text-orange-600 hover:text-orange-700 text-sm">
            See All
          </button>
        </div>

        {peopleSuggestions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-600">No suggestions available at the moment.</p>
          </div>
        ) : (
          <div className="gap-2 sm:gap-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {peopleSuggestions.map((user) => (
              <GlobalConnectionCard
                key={user.id}
                user={user}
                variant="discover"
                compact={true}
                className="sm:hidden block"
              />
            ))}
            {peopleSuggestions.map((user) => (
              <GlobalConnectionCard
                key={`desktop-${user.id}`}
                user={user}
                variant="discover"
                compact={false}
                className="hidden sm:block"
              />
            ))}
          </div>
        )}
      </section>

      {/* Trending Developers */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900 text-xl">
              Recently Joined
            </h2>
          </div>
          <button className="font-medium text-orange-600 hover:text-orange-700 text-sm">
            See All
          </button>
        </div>

        {trendingSuggestions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-600">No recent developers to show.</p>
          </div>
        ) : (
          <div className="gap-2 sm:gap-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trendingSuggestions.map((user) => (
              <GlobalConnectionCard
                key={`trending-mobile-${user.id}`}
                user={user}
                variant="discover"
                compact={true}
                className="sm:hidden block"
              />
            ))}
            {trendingSuggestions.map((user) => (
              <GlobalConnectionCard
                key={`trending-desktop-${user.id}`}
                user={user}
                variant="discover"
                compact={false}
                className="hidden sm:block"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
