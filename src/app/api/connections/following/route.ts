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
    // Get users that the current user follows
    const following = await dbService.connections.getFollowing(
      user.id,
      query.limit
    )

    // Filter by search query if provided
    let filteredFollowing = following
    if (query.search) {
      const searchLower = query.search.toLowerCase()
      filteredFollowing = following.filter((profile) =>
        profile.username.toLowerCase().includes(searchLower) ||
        profile.displayName?.toLowerCase().includes(searchLower) ||
        profile.bio?.toLowerCase().includes(searchLower)
      )
    }

    return createSuccessResponse({
      following: filteredFollowing,
      total: following.length,
      filtered: filteredFollowing.length,
    })
  } catch (error) {
    console.error('Error fetching following list:', error)
    throw error
  }
})