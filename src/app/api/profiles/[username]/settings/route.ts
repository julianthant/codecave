import { NextRequest } from 'next/server'
import { dbService } from '@/services/database'
import { userSettingsUpdateSchema } from '@/db/schema'
import { createClient } from '@/utils/supabase/server'
import { handleApiError, validateApiInput, ErrorResponses, createSuccessResponse } from '@/utils/api-errors'

export const PATCH = handleApiError(async (
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  const { username } = await params
  const body = await request.json()

  // Validate request body with Zod
  const validatedData = validateApiInput(userSettingsUpdateSchema, body)

  // Get current authenticated user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return ErrorResponses.unauthorized()
  }

  const currentUserId = user.id

  // Find the profile to verify ownership
  const profile = await dbService.profiles.findByUsername(username)
  
  if (!profile) {
    return ErrorResponses.notFound('Profile')
  }

  // Check if the current user owns this profile
  if (profile.id !== currentUserId) {
    return ErrorResponses.forbidden('Can only update own settings')
  }

  // Check if any valid data was provided
  if (Object.keys(validatedData).length === 0) {
    return ErrorResponses.badRequest('No valid settings provided')
  }

  // Update the user settings
  const updatedSettings = await dbService.userSettings.update(
    currentUserId,
    validatedData
  )

  return createSuccessResponse(
    { settings: updatedSettings },
    'Settings updated successfully'
  )
})

export const GET = handleApiError(async (
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  const { username } = await params

  // Get current authenticated user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return ErrorResponses.unauthorized()
  }

  const currentUserId = user.id

  // Find the profile to verify ownership
  const profile = await dbService.profiles.findByUsername(username)
  
  if (!profile) {
    return ErrorResponses.notFound('Profile')
  }

  // Check if the current user owns this profile (settings are private)
  if (profile.id !== currentUserId) {
    return ErrorResponses.forbidden('Can only view own settings')
  }

  // Get the user settings
  const settings = await dbService.userSettings.findById(currentUserId)

  return createSuccessResponse({ settings })
})