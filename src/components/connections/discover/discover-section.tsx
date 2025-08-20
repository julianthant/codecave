'use client'

import React from 'react'
import { Sparkles, Users, TrendingUp } from 'lucide-react'
import { GlobalConnectionCard } from '../shared/global-connection-card'
import { mockConnectionsSuggestions } from '@/lib/mock-data/connections-data'

export function DiscoverSection() {
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

        <div className="gap-2 sm:gap-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockConnectionsSuggestions.slice(0, 8).map((user) => (
            <GlobalConnectionCard
              key={user.id}
              user={user}
              variant="discover"
              compact={true}
              className="sm:hidden block"
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900 text-xl">
              Trending Developers
            </h2>
          </div>
          <button className="font-medium text-orange-600 hover:text-orange-700 text-sm">
            See All
          </button>
        </div>

        <div className="gap-2 sm:gap-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockConnectionsSuggestions.slice(2, 6).map((user) => (
            <GlobalConnectionCard
              key={`trending-mobile-${user.id}`}
              user={user}
              variant="discover"
              compact={true}
              className="sm:hidden block"
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900 text-xl">
              Similar Experience Level
            </h2>
          </div>
          <button className="font-medium text-orange-600 hover:text-orange-700 text-sm">
            See All
          </button>
        </div>

        <div className="gap-2 sm:gap-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockConnectionsSuggestions
            .filter((user) => user.experienceLevel === 'senior')
            .map((user) => (
              <GlobalConnectionCard
                key={`similar-mobile-${user.id}`}
                user={user}
                variant="discover"
                compact={true}
                className="sm:hidden block"
              />
            ))}
          {mockConnectionsSuggestions
            .filter((user) => user.experienceLevel === 'senior')
            .map((user) => (
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
