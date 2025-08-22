import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { dbService } from '@/services/database'
import { connectionQuerySchema } from '@/db/schema/validation/connections.validation'
import { handleApiError, validateApiInput, createSuccessResponse } from '@/utils/api-errors'

export const GET = handleApiError(async (request: NextRequest) => {
  // Authentication check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  // Validate query parameters
  const query = validateApiInput(
    connectionQuerySchema,
    Object.fromEntries(request.nextUrl.searchParams)
  )

  try {
    // Get users that follow the current user
    const followers = await dbService.connections.getFollowers(
      user.id,
      query.limit
    )

    // Filter by search query if provided
    let filteredFollowers = followers
    if (query.search) {
      const searchLower = query.search.toLowerCase()
      filteredFollowers = followers.filter((profile) =>
        profile.username.toLowerCase().includes(searchLower) ||
        profile.displayName?.toLowerCase().includes(searchLower) ||
        profile.bio?.toLowerCase().includes(searchLower)
      )
    }

    // Check if current user follows each follower back
    const followersWithStatus = await Promise.all(
      filteredFollowers.map(async (profile) => {
        const isFollowingBack = await dbService.connections.isFollowing(
          user.id,
          profile.id
        )
        
        return {
          ...profile,
          isFollowingBack,
        }
      })
    )

    return createSuccessResponse({
      followers: followersWithStatus,
      total: followers.length,
      filtered: filteredFollowers.length,
    })
  } catch (error) {
    console.error('Error fetching followers list:', error)
    throw error
  }
})