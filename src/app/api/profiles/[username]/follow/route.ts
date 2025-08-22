import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/services/database'
import { createClient } from '@/utils/supabase/server'
import { followUserSchema } from '@/db/schema/validation/connections.validation'
import { handleApiError, validateApiInput, createSuccessResponse } from '@/utils/api-errors'

export const POST = handleApiError(async (
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  const { username } = await params

  // Validate username parameter
  const validatedParams = validateApiInput(followUserSchema, { username })

  // Get current authenticated user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  const currentUserId = user.id

  // Find the user to follow
  const targetProfile = await dbService.profiles.findByUsername(validatedParams.username)
  
  if (!targetProfile) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }

  // Prevent self-following
  if (targetProfile.id === currentUserId) {
    return NextResponse.json(
      { error: 'Cannot follow yourself' },
      { status: 400 }
    )
  }

  // Check if already following
  const existingConnection = await dbService.connections.findConnection(
    currentUserId,
    targetProfile.id
  )

  if (existingConnection) {
    return NextResponse.json(
      { error: 'Already following this user' },
      { status: 400 }
    )
  }

  // Create the connection
  await dbService.connections.create(currentUserId, targetProfile.id)

  // Get updated follower count
  const followerCount = await dbService.connections.getFollowersCount(targetProfile.id)

  return createSuccessResponse({
    followerCount,
    message: `Now following @${username}`,
  })
})

export const DELETE = handleApiError(async (
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  const { username } = await params

  // Validate username parameter
  const validatedParams = validateApiInput(followUserSchema, { username })

  // Get current authenticated user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  const currentUserId = user.id

  // Find the user to unfollow
  const targetProfile = await dbService.profiles.findByUsername(validatedParams.username)
  
  if (!targetProfile) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }

  // Check if following first
  const isFollowing = await dbService.connections.isFollowing(currentUserId, targetProfile.id)
  
  if (!isFollowing) {
    return NextResponse.json(
      { error: 'Not following this user' },
      { status: 400 }
    )
  }

  // Remove the connection
  await dbService.connections.delete(currentUserId, targetProfile.id)

  // Get updated follower count
  const followerCount = await dbService.connections.getFollowersCount(targetProfile.id)

  return createSuccessResponse({
    followerCount,
    message: `Unfollowed @${username}`,
  })
})