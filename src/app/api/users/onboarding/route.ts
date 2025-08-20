import { NextResponse } from 'next/server'
import { dbService } from '@/services/database'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    console.log('=== Onboarding API Request Started ===')
    
    // Verify user is authenticated
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
    
    if (!user) {
      console.log('No user found in session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User authenticated:', user.id)

    let body
    try {
      body = await request.json()
      console.log('Request body parsed successfully')
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }
    
    // Validate required fields
    if (!body.username || !body.displayName) {
      console.log('Missing required fields:', { username: !!body.username, displayName: !!body.displayName })
      return NextResponse.json({ error: 'Username and display name are required' }, { status: 400 })
    }
    
    // Validate that the user ID matches
    if (body.id !== user.id) {
      console.log('User ID mismatch:', { bodyId: body.id, userId: user.id })
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 403 })
    }

    console.log('Checking username availability:', body.username)
    // Check username availability
    let isAvailable
    try {
      isAvailable = await dbService.profiles.checkUsernameAvailable(body.username)
      console.log('Username availability check result:', isAvailable)
    } catch (availabilityError) {
      console.error('Username availability check failed:', availabilityError)
      return NextResponse.json({ error: 'Failed to check username availability' }, { status: 500 })
    }
    
    if (!isAvailable) {
      console.log('Username taken:', body.username)
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
    }

    console.log('Creating user profile...')
    // Create user profile and settings
    let userWithProfile
    try {
      userWithProfile = await dbService.users.createComplete(
        body.id,
        // Profile data (public)
        {
          username: body.username,
          displayName: body.displayName,
          tagline: body.tagline || null,
          bio: body.bio || null,
          avatarUrl: body.avatarUrl || null,
          githubUsername: body.githubUsername || null,
          twitterUsername: null,
          discordUsername: null,
          linkedinUrl: null,
        },
        // Settings data (private) - use provided values or defaults
        {
          skills: Array.isArray(body.skills) ? body.skills : [],
          languages: Array.isArray(body.languages) ? body.languages : [],
          experienceLevel: null,
          availableForCollab: body.availableForCollab ?? true,
          emailNotifications: body.emailNotifications ?? true,
          theme: body.theme || 'system',
          isPro: false,
        }
      )
      console.log('Profile creation successful')
    } catch (createError) {
      console.error('Profile creation failed:', createError)
      console.error('Create error details:', {
        message: createError instanceof Error ? createError.message : String(createError),
        stack: createError instanceof Error ? createError.stack : 'No stack trace',
        name: createError instanceof Error ? createError.name : 'Unknown error type'
      })
      return NextResponse.json({ 
        error: 'Failed to create user profile',
        details: createError instanceof Error ? createError.message : 'Database operation failed'
      }, { status: 500 })
    }

    console.log('Profile created successfully for user:', user.id)
    return NextResponse.json({ 
      user: userWithProfile,
      message: 'Profile created successfully' 
    })
  } catch (error) {
    console.error('=== Onboarding API Error ===')
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Full error:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    // Return a proper JSON error response
    return NextResponse.json(
      { 
        error: 'Failed to create profile',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}