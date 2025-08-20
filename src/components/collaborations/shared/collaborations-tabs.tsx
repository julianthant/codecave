'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface Tab {
  value: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface CollaborationsTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (value: string) => void
  className?: string
}

export function CollaborationsTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: CollaborationsTabsProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {/* Desktop Tabs */}
      <div className="hidden sm:flex items-center space-x-1 bg-white p-1 border border-gray-200 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.value

          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-orange-50 text-orange-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <Badge
                  variant="secondary"
                  className={cn(
                    'ml-1 px-1.5 py-0 h-5 min-w-[20px] text-xs',
                    isActive
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  )}
                >
                  {tab.badge}
                </Badge>
              )}
            </button>
          )
        })}
      </div>

      {/* Mobile Dropdown */}
      <select
        value={activeTab}
        onChange={(e) => onTabChange(e.target.value)}
        className="sm:hidden flex-1 bg-white px-4 py-2 border border-gray-200 focus:border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-gray-700 text-sm"
      >
        {tabs.map((tab) => (
          <option key={tab.value} value={tab.value}>
            {tab.label} {tab.badge && tab.badge > 0 ? `(${tab.badge})` : ''}
          </option>
        ))}
      </select>
    </div>
  )
}
