'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  TrendingUp, 
  Eye, 
  Download, 
  Share2, 
  Lightbulb,
  Calendar,
  Loader2
} from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface NetworkStats {
  totalConnections: number
  totalFollowers: number
  totalFollowing: number
  newThisWeek: number
  networkReach: number
  profileViews: number
  growthRate: number
}

export function ConnectionsSidebar() {
  // Fetch network stats
  const { data: stats, isLoading: statsLoading } = useQuery<NetworkStats>({
    queryKey: ['connections', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/connections/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch network stats')
      }
      const result = await response.json()
      return result.data
    },
  })

  return (
    <div className="space-y-6">
      {/* Network Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <Users className="w-4 h-4 text-orange-500" />
            <span>Network Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {statsLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(stats?.totalConnections || 0)}
                  </div>
                  <div className="text-xs text-gray-600">Connections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(stats?.networkReach || 0)}
                  </div>
                  <div className="text-xs text-gray-600">Network Reach</div>
                </div>
              </div>
              
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New this week</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    +{stats?.newThisWeek || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile views</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {formatNumber(stats?.profileViews || 0)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Growth rate</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stats?.growthRate || 0}%
                  </Badge>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white py-4 border-gray-200">
        <CardContent className="space-y-1">
          <button className="group flex items-center space-x-3 hover:bg-gray-50 py-2 rounded-md w-full text-left transition-colors duration-150">
            <Download className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
            <span className="font-semibold text-gray-900 group-hover:text-gray-700 text-sm">
              Import Contacts
            </span>
          </button>
          <button className="group flex items-center space-x-3 hover:bg-gray-50 py-2 rounded-md w-full text-left transition-colors duration-150">
            <Share2 className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
            <span className="font-semibold text-gray-900 group-hover:text-gray-700 text-sm">
              Share Profile
            </span>
          </button>
          <button className="group flex items-center space-x-3 hover:bg-gray-50 py-2 rounded-md w-full text-left transition-colors duration-150">
            <Eye className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
            <span className="font-semibold text-gray-900 group-hover:text-gray-700 text-sm">
              Who Viewed Profile
            </span>
          </button>
        </CardContent>
      </Card>

      {/* Networking Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <Lightbulb className="w-4 h-4 text-orange-500" />
            <span>Networking Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-gray-700">
                Add a personal message when sending connection requests
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-gray-700">
                Engage with others&apos; posts to build meaningful relationships
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-gray-700">
                Keep your profile updated with latest projects and skills
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-700">
                <span className="font-medium">Sarah Chen</span> accepted your connection
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-sm text-gray-700">
                <span className="font-medium">Alex Kumar</span> viewed your profile
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="text-sm text-gray-700">
                <span className="font-medium">Emily Johnson</span> started following you
              </span>
            </div>
          </div>
          
          <Button variant="ghost" className="w-full text-sm text-orange-600 hover:text-orange-700 mt-3">
            View All Activity
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}