import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/services/database'
import type { UpdateUserSettings } from '@/db/schema'
import { createClient } from '@/utils/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    const body = await request.json()

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

    // Find the profile to verify ownership
    const profile = await dbService.profiles.findByUsername(username)
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Check if the current user owns this profile
    if (profile.id !== currentUserId) {
      return NextResponse.json(
        { error: 'Unauthorized - can only update own settings' },
        { status: 403 }
      )
    }

    // Validate the settings data
    const validFields: Array<keyof UpdateUserSettings> = [
      'skills',
      'languages',
      'experienceLevel',
      'availableForCollab',
      'emailNotifications',
      'theme',
      'timezone',
      'privacySettings',
    ]

    // Filter only valid fields and remove undefined values
    const settingsUpdate: UpdateUserSettings = {}
    for (const [key, value] of Object.entries(body)) {
      if (validFields.includes(key as keyof UpdateUserSettings) && value !== undefined) {
        (settingsUpdate as Record<string, unknown>)[key] = value
      }
    }

    if (Object.keys(settingsUpdate).length === 0) {
      return NextResponse.json(
        { error: 'No valid settings provided' },
        { status: 400 }
      )
    }

    // Update the user settings
    const updatedSettings = await dbService.userSettings.update(
      currentUserId,
      {
        ...settingsUpdate,
        updatedAt: new Date(),
      }
    )

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      message: 'Settings updated successfully',
    })
  } catch (error) {
    console.error('Error updating user settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
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

    // Find the profile to verify ownership
    const profile = await dbService.profiles.findByUsername(username)
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Check if the current user owns this profile (settings are private)
    if (profile.id !== currentUserId) {
      return NextResponse.json(
        { error: 'Unauthorized - can only view own settings' },
        { status: 403 }
      )
    }

    // Get the user settings
    const settings = await dbService.userSettings.findById(currentUserId)

    return NextResponse.json({
      settings,
    })
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}