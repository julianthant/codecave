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
    // Get connection suggestions (users not already connected)
    const suggestions = await dbService.connections.getSuggestions(
      user.id,
      query.limit
    )

    // Calculate mutual connections for each suggestion
    const suggestionsWithMutuals = await Promise.all(
      suggestions.map(async (profile) => {
        const mutualCount = await dbService.connections.getMutualConnectionCount(
          user.id,
          profile.id
        )
        
        return {
          ...profile,
          mutualConnections: mutualCount,
        }
      })
    )

    return createSuccessResponse(suggestionsWithMutuals)
  } catch (error) {
    console.error('Error fetching connection suggestions:', error)
    throw error
  }
})