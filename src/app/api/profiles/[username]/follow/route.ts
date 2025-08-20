import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/services/database'
import { createClient } from '@/utils/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    // TODO: Get current user from auth
    // For now, we'll simulate with a placeholder
    const currentUserId = 'placeholder-user-id'
    
    if (!currentUserId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Find the user to follow
    const targetProfile = await dbService.profiles.findByUsername(username)
    
    if (!targetProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
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

    return NextResponse.json({
      success: true,
      followerCount,
      message: `Now following @${username}`,
    })
  } catch (error) {
    console.error('Error following user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

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
    const targetProfile = await dbService.profiles.findByUsername(username)
    
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

    return NextResponse.json({
      success: true,
      followerCount,
      message: `Unfollowed @${username}`,
    })
  } catch (error) {
    console.error('Error unfollowing user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}