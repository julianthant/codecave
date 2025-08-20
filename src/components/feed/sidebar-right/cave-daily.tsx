'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CaveDaily() {
  const dailyItems = [
    { title: 'Binary Search Challenge', meta: 'Algorithm • Medium difficulty' },
    {
      title: 'Elena Rodriguez joined',
      meta: 'ML Engineer • 95% accuracy project',
    },
    { title: 'React 19 Released', meta: 'Compiler • New hooks • Server SSR' },
    {
      title: 'Code Review Best Practices',
      meta: 'Discussion • 47 participants',
    },
    { title: 'TypeScript 5.4 Beta', meta: 'Decorators • Performance gains' },
    { title: "Sarah Chen's AI Tool", meta: 'Open source • 2.3k stars today' },
  ]

  const handleItemClick = (item: { title: string; meta: string }) => {
    // In a real app, navigate to item or open modal
    console.log('Navigate to:', item.title)
  }

  return (
    <Card className="gap-0 bg-white border-gray-200">
      <CardHeader className="px-5">
        <CardTitle className="font-medium text-gray-900 text-lg">
          The Cave Daily
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {dailyItems.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => handleItemClick(item)}
              className="hover:bg-gray-50 px-5 py-3 w-full text-left transition-colors duration-150 cursor-pointer"
            >
              <div className="mb-0.5 font-medium text-gray-900 text-sm">
                {item.title}
              </div>
              <div className="text-gray-500 text-xs">{item.meta}</div>
            </button>
            {index < dailyItems.length - 1 && (
              <div className="mx-5 border-gray-100 border-t"></div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
