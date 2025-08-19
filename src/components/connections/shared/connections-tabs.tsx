'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Tab {
  value: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface ConnectionsTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (value: string) => void
  className?: string
}

export function ConnectionsTabs({ tabs, activeTab, onTabChange, className }: ConnectionsTabsProps) {
  return (
    <div className={cn("w-full mb-8", className)}>
      {/* Tab Navigation Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex">
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.value
            
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={cn(
                  "relative flex-1 px-4 py-4 flex items-center justify-center space-x-2 transition-all duration-200",
                  "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset",
                  "text-sm font-medium",
                  isActive 
                    ? "text-gray-900 bg-gray-50/50" 
                    : "text-gray-600 hover:text-gray-900",
                  // Add border between tabs (except last)
                  index < tabs.length - 1 && "border-r border-gray-200"
                )}
              >
                {/* Tab Content */}
                <Icon className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-orange-600" : "text-gray-500"
                )} />
                
                {/* Desktop Label */}
                <span className="hidden sm:block">{tab.label}</span>
                
                {/* Mobile Label */}
                <span className="block sm:hidden text-xs">{tab.label}</span>

                {/* Active Bottom Border */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                    layoutId="activeTabBorder"
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 30 
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}