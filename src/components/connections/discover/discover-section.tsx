'use client'

import React from 'react'
import { Sparkles, Users, TrendingUp } from 'lucide-react'
import { GlobalConnectionCard } from '../shared/global-connection-card'
import { mockConnectionsSuggestions } from '@/lib/mock-data/connections-data'

export function DiscoverSection() {
  const handleConnect = (userId: string) => {
    console.log('Connect to user:', userId)
  }

  const handleFollow = (userId: string) => {
    console.log('Follow user:', userId)
  }

  return (
    <div className="space-y-8">
      {/* People You May Know */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              People You May Know
            </h2>
          </div>
          <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            See All
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {mockConnectionsSuggestions.slice(0, 8).map((user) => (
            <GlobalConnectionCard
              key={user.id}
              user={user}
              variant="discover"
              compact={true}
              className="block sm:hidden"
            />
          ))}
          {mockConnectionsSuggestions.slice(0, 8).map((user) => (
            <GlobalConnectionCard
              key={`desktop-${user.id}`}
              user={user}
              variant="discover"
              compact={false}
              className="hidden sm:block"
            />
          ))}
        </div>
      </section>

      {/* Trending Developers */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Trending Developers
            </h2>
          </div>
          <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            See All
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {mockConnectionsSuggestions.slice(2, 6).map((user) => (
            <GlobalConnectionCard
              key={`trending-mobile-${user.id}`}
              user={user}
              variant="discover"
              compact={true}
              className="block sm:hidden"
            />
          ))}
          {mockConnectionsSuggestions.slice(2, 6).map((user) => (
            <GlobalConnectionCard
              key={`trending-desktop-${user.id}`}
              user={user}
              variant="discover"
              compact={false}
              className="hidden sm:block"
            />
          ))}
        </div>
      </section>

      {/* Similar Experience Level */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Similar Experience Level
            </h2>
          </div>
          <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            See All
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {mockConnectionsSuggestions.filter(user => user.experienceLevel === 'senior').map((user) => (
            <GlobalConnectionCard
              key={`similar-mobile-${user.id}`}
              user={user}
              variant="discover"
              compact={true}
              className="block sm:hidden"
            />
          ))}
          {mockConnectionsSuggestions.filter(user => user.experienceLevel === 'senior').map((user) => (
            <GlobalConnectionCard
              key={`similar-desktop-${user.id}`}
              user={user}
              variant="discover"
              compact={false}
              className="hidden sm:block"
            />
          ))}
        </div>
      </section>
    </div>
  )
}