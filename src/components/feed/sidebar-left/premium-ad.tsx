'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, Crown } from 'lucide-react'
import { toast } from 'sonner'

export function PremiumAd() {
  const handleUpgrade = () => {
    // In a real app, navigate to premium signup
    toast.success('Redirecting to premium signup...')
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:shadow-sm transition-all duration-200">
      <CardContent className="p-5">
        {/* Premium Icon */}
        <div className="flex items-center justify-center mb-3">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-full">
            <Crown className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-3">
          <h3 className="font-semibold text-gray-900 text-base mb-1">
            Unlock Premium
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Get advanced analytics, unlimited projects, and exclusive features
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-3 h-3 text-orange-500 flex-shrink-0" />
            <span className="text-xs text-gray-700">Advanced code insights</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3 h-3 text-orange-500 flex-shrink-0" />
            <span className="text-xs text-gray-700">Priority support</span>
          </div>
          <div className="flex items-center space-x-2">
            <Crown className="w-3 h-3 text-orange-500 flex-shrink-0" />
            <span className="text-xs text-gray-700">Exclusive community</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleUpgrade}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-medium py-2 h-auto"
        >
          Try Premium Free
        </Button>

        {/* Pricing */}
        <div className="text-center mt-3">
          <p className="text-xs text-gray-500">
            Starting at <span className="font-medium text-gray-700">$9/month</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}