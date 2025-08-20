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
    <div className={cn(
      "w-full mb-0 lg:mb-8",
      "fixed bottom-0 left-0 right-0 z-50 lg:static lg:bottom-auto",
      "pb-safe",
      className
    )}>
      {/* Tab Navigation Card */}
      <div className="bg-white border-t border-gray-200 lg:rounded-lg lg:border lg:shadow-sm overflow-hidden lg:shadow-lg">
        <div className="grid grid-cols-5 lg:flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.value
            
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={cn(
                  // Mobile: vertical layout with better touch targets, Desktop: horizontal layout
                  "relative flex flex-col items-center justify-center py-3 px-2 lg:flex-row lg:flex-1 lg:px-4 lg:py-4 lg:space-x-2",
                  "transition-all duration-200",
                  "hover:bg-gray-50 focus:outline-none active:bg-gray-100",
                  "text-sm font-medium",
                  isActive 
                    ? "text-orange-600 bg-gray-50/50 lg:text-gray-900" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {/* Tab Icon */}
                <Icon className={cn(
                  "w-5 h-5 lg:w-4 lg:h-4 transition-colors mb-1 lg:mb-0",
                  isActive ? "text-orange-600" : "text-gray-500"
                )} />
                
                {/* Tab Label - Always Visible */}
                <span className={cn(
                  "text-[11px] leading-tight lg:text-sm",
                  "block" // Always show labels
                )}>
                  {tab.label}
                </span>

                {/* Active Bottom Border - Desktop only */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 hidden lg:block"
                    layoutId="activeTabBorder"
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 30 
                    }}
                  />
                )}

                {/* Active Top Border - Mobile only */}
                {isActive && (
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-0.5 bg-orange-500 lg:hidden"
                    layoutId="activeTabBorderMobile"
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