import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { dbService } from '@/services/database'
import { respondToInvitationSchema } from '@/db/schema/validation/connections.validation'
import { handleApiError, validateApiInput, createSuccessResponse, ErrorResponses } from '@/utils/api-errors'
import { z } from 'zod'

// Validate invitation ID parameter
const invitationParamsSchema = z.object({
  id: z.string().uuid('Invalid invitation ID'),
})

export const PATCH = handleApiError(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Authentication check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  // Validate invitation ID
  const { id } = await params
  const validatedParams = validateApiInput(invitationParamsSchema, { id })

  // Validate request body
  const body = await request.json()
  const validatedData = validateApiInput(respondToInvitationSchema, body)

  try {
    // Find the invitation
    const invitation = await dbService.connectionInvitations.findById(validatedParams.id)
    
    if (!invitation) {
      return ErrorResponses.notFound('Invitation', validatedParams.id)
    }

    // Verify user is the receiver of the invitation
    if (invitation.receiverId !== user.id) {
      return ErrorResponses.forbidden('You can only respond to invitations sent to you')
    }

    // Check if invitation is still pending
    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: 'Invitation has already been responded to' },
        { status: 400 }
      )
    }

    // Map action to status
    const status = validatedData.action === 'accept' ? 'accepted' : 'declined'
    
    // Update invitation status
    const updatedInvitation = await dbService.connectionInvitations.update(
      validatedParams.id,
      status,
      new Date()
    )

    // If accepted, create the connection
    if (validatedData.action === 'accept') {
      await dbService.connections.create(invitation.senderId, user.id)
      
      // TODO: Send notification to sender about acceptance
      // await notificationService.sendConnectionAccepted(invitation)
    }

    // TODO: Send notification to sender about response
    // await notificationService.sendInvitationResponse(updatedInvitation)

    const message = validatedData.action === 'accept' 
      ? 'Invitation accepted successfully' 
      : 'Invitation declined'

    return createSuccessResponse(updatedInvitation, message)
  } catch (error) {
    console.error('Error responding to invitation:', error)
    throw error
  }
})

export const DELETE = handleApiError(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Authentication check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  // Validate invitation ID
  const { id } = await params
  const validatedParams = validateApiInput(invitationParamsSchema, { id })

  try {
    // Find the invitation
    const invitation = await dbService.connectionInvitations.findById(validatedParams.id)
    
    if (!invitation) {
      return ErrorResponses.notFound('Invitation', validatedParams.id)
    }

    // Verify user is the sender of the invitation
    if (invitation.senderId !== user.id) {
      return ErrorResponses.forbidden('You can only cancel invitations you sent')
    }

    // Check if invitation is still pending
    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: 'Can only cancel pending invitations' },
        { status: 400 }
      )
    }

    // Cancel the invitation
    const updatedInvitation = await dbService.connectionInvitations.cancel(
      validatedParams.id,
      user.id
    )

    return createSuccessResponse(updatedInvitation, 'Invitation cancelled successfully')
  } catch (error) {
    console.error('Error cancelling invitation:', error)
    throw error
  }
})