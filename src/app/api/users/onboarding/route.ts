import { NextResponse } from 'next/server'
import { dbService } from '@/services/database'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    // Verify user is authenticated
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate that the user ID matches
    if (body.id !== user.id) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 403 })
    }

    // Check username availability
    const isAvailable = await dbService.profiles.checkUsernameAvailable(body.username)
    if (!isAvailable) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
    }

    // Create user profile and settings
    const userWithProfile = await dbService.users.createComplete(
      body.id,
      // Profile data (public)
      {
        username: body.username,
        displayName: body.displayName,
        bio: body.bio,
        avatarUrl: body.avatarUrl,
        githubUsername: body.githubUsername,
        twitterUsername: null,
        discordUsername: null,
        linkedinUrl: null,
      },
      // Settings data (private) - create with defaults
      {
        skills: [],
        languages: [],
        experienceLevel: null,
        availableForCollab: false,
        emailNotifications: true,
        theme: 'system',
        isPro: false,
      }
    )

    return NextResponse.json({ 
      user: userWithProfile,
      message: 'Profile created successfully' 
    })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}