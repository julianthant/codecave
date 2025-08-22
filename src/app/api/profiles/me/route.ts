import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/services/database'
import { createClient } from '@/utils/supabase/server'
import { handleApiError, validateApiInput, createSuccessResponse } from '@/utils/api-errors'
import { z } from 'zod'

// Profile update schema
const updateProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50, 'Display name must be less than 50 characters').optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores').optional(),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),
  githubUsername: z.string().max(39, 'GitHub username is too long').optional(),
  twitterUsername: z.string().max(15, 'Twitter username is too long').optional(),
  discordUsername: z.string().max(37, 'Discord username is too long').optional(),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  location: z.string().max(100, 'Location is too long').optional(),
  portfolioUrl: z.string().url('Please enter a valid portfolio URL').optional().or(z.literal('')),
})

export const GET = handleApiError(async () => {
  // Get current user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  // Get user profile with settings
  const userProfile = await dbService.users.findWithSettings(user.id)
  
  if (!userProfile) {
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    )
  }

  return createSuccessResponse(userProfile)
})

export const PATCH = handleApiError(async (request: NextRequest) => {
  // Get current user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  // Validate request body
  const body = await request.json()
  const validatedData = validateApiInput(updateProfileSchema, body)

  // Remove empty strings and undefined values
  const updateData: Record<string, string | undefined> = {}
  for (const [key, value] of Object.entries(validatedData)) {
    if (value !== undefined && value !== '') {
      updateData[key] = value
    }
  }

  // Check if username is being updated and if it's available
  if (updateData.username) {
    const existingProfile = await dbService.profiles.findByUsername(updateData.username)
    if (existingProfile && existingProfile.id !== user.id) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      )
    }
    // Ensure username is lowercase
    updateData.username = updateData.username.toLowerCase()
  }

  // Update the profile
  const updatedProfile = await dbService.profiles.update(user.id, updateData)

  return createSuccessResponse(updatedProfile, 'Profile updated successfully')
})