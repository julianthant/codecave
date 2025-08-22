import { NextResponse } from 'next/server'
import { dbService } from '@/services/database'
import { createClient } from '@/utils/supabase/server'
// import { profileInsertSchema, userSettingsInsertSchema } from '@/db/schema/validation/profiles.validation'
import { z } from 'zod'

// Onboarding-specific validation schema
const onboardingSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, underscores, and hyphens'),
  displayName: z.string().min(1).max(50),
  tagline: z.string().max(60).optional().nullable(),
  bio: z.string().max(160).optional().nullable(),
  githubUsername: z.string().max(39).regex(/^[a-zA-Z0-9-]+$/).optional().nullable(),
  skills: z.array(z.string()).max(50).default([]),
  languages: z.array(z.string()).max(20).default([]),
  availableForCollab: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  avatarUrl: z.string().url().optional().nullable(),
})

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
    
    // Validate input with Zod schema
    let validatedData
    try {
      validatedData = onboardingSchema.parse(body)
      console.log('Request data validated successfully')
    } catch (validationError) {
      console.error('Validation error:', validationError)
      if (validationError instanceof z.ZodError) {
        const errorMessages = validationError.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ')
        return NextResponse.json({ error: `Validation failed: ${errorMessages}` }, { status: 400 })
      }
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
    
    // Validate that the user ID matches
    if (validatedData.id !== user.id) {
      console.log('User ID mismatch:', { bodyId: validatedData.id, userId: user.id })
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 403 })
    }

    // Check if user already has a profile (prevent duplicate onboarding)
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()
    
    console.log('Existing profile check:', { existingProfile, profileError })
    
    if (existingProfile) {
      console.log('User already has profile:', user.id)
      return NextResponse.json({ error: 'User already completed onboarding' }, { status: 400 })
    }
    
    // Only proceed if the error is "not found" (PGRST116)
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Database error checking for existing profile:', profileError)
      return NextResponse.json({ error: 'Failed to check existing profile' }, { status: 500 })
    }
    
    console.log('No existing profile found, proceeding with onboarding')

    console.log('Checking username availability:', validatedData.username)
    // Check username availability
    let isAvailable
    try {
      isAvailable = await dbService.profiles.checkUsernameAvailable(validatedData.username)
      console.log('Username availability check result:', isAvailable)
    } catch (availabilityError) {
      console.error('Username availability check failed:', availabilityError)
      return NextResponse.json({ error: 'Failed to check username availability' }, { status: 500 })
    }
    
    if (!isAvailable) {
      console.log('Username taken:', validatedData.username)
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
    }

    console.log('Creating user profile...')
    // Create user profile and settings
    let userWithProfile
    try {
      userWithProfile = await dbService.users.createComplete(
        validatedData.id,
        // Profile data (public)
        {
          username: validatedData.username,
          displayName: validatedData.displayName,
          tagline: validatedData.tagline,
          bio: validatedData.bio,
          avatarUrl: validatedData.avatarUrl,
          githubUsername: validatedData.githubUsername,
          twitterUsername: null,
          discordUsername: null,
          linkedinUrl: null,
          onboardingCompleted: true, // Mark onboarding as completed
        },
        // Settings data (private) - use validated values
        {
          skills: validatedData.skills,
          languages: validatedData.languages,
          experienceLevel: null,
          availableForCollab: validatedData.availableForCollab,
          emailNotifications: validatedData.emailNotifications,
          theme: validatedData.theme,
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