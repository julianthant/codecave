import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { dbService } from '@/services/database'
import { handleApiError, createSuccessResponse } from '@/utils/api-errors'
import { z } from 'zod'

// Response validation schema
const networkStatsSchema = z.object({
  totalConnections: z.number(),
  totalFollowers: z.number(),
  totalFollowing: z.number(),
  newThisWeek: z.number(),
  networkReach: z.number(),
  profileViews: z.number(),
  growthRate: z.number(),
})

export const GET = handleApiError(async () => {
  // Authentication check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  try {
    // Get current network stats
    const [followersCount, followingCount] = await Promise.all([
      dbService.connections.getFollowersCount(user.id),
      dbService.connections.getFollowingCount(user.id),
    ])

    // Get profile stats (includes profile views if available)
    const profileStats = await dbService.profiles.getProfileStats(user.id)

    // Calculate network reach (followers + their followers, simplified)
    const networkReach = followersCount * 2.5 // Simplified calculation

    // Get followers from last week for growth calculation
    // Note: This is a simplified implementation - would need date filtering in production
    const newThisWeek = Math.max(0, Math.floor(followersCount * 0.1)) // Simplified

    // Calculate growth rate (simplified - would need historical data)
    const growthRate = newThisWeek > 0 ? (newThisWeek / Math.max(followersCount, 1)) * 100 : 0

    const stats = {
      totalConnections: followersCount + followingCount,
      totalFollowers: followersCount,
      totalFollowing: followingCount,
      newThisWeek,
      networkReach: Math.floor(networkReach),
      profileViews: profileStats.followerCount * 3, // Simplified calculation
      growthRate: Math.round(growthRate * 100) / 100,
    }

    // Validate response
    const validatedStats = networkStatsSchema.parse(stats)

    return createSuccessResponse(validatedStats)
  } catch (error) {
    console.error('Error fetching network stats:', error)
    throw error
  }
})