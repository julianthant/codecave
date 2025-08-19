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
      {/* Desktop Layout */}
      <div className="hidden sm:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.value
            
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={cn(
                  "relative flex-1 px-4 py-4 flex items-center justify-center space-x-2 transition-all duration-200",
                  "hover:bg-gray-50 focus:outline-none",
                  "text-sm font-medium",
                  isActive 
                    ? "text-gray-900 bg-gray-50/50" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-orange-600" : "text-gray-500"
                )} />
                <span>{tab.label}</span>

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

      {/* Mobile Layout - Grid with vertical icon/text */}
      <div className="sm:hidden">
        <div className="grid grid-cols-3 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.value
            
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={cn(
                  "relative flex flex-col items-center p-3 transition-all duration-200",
                  "hover:bg-gray-50 focus:outline-none rounded-lg",
                  isActive 
                    ? "text-orange-600 bg-orange-50" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium leading-tight text-center">
                  {tab.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-orange-100 rounded-lg -z-10"
                    layoutId="activeMobileTab"
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