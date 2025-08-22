import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { dbService } from '@/services/database'
import { 
  invitationQuerySchema,
  createConnectionInvitationSchema,
} from '@/db/schema/validation/connections.validation'
import { handleApiError, validateApiInput, createSuccessResponse, ErrorResponses } from '@/utils/api-errors'

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
    invitationQuerySchema,
    Object.fromEntries(request.nextUrl.searchParams)
  )

  try {
    let invitations = []

    if (query.type === 'sent') {
      const sentInvitations = await dbService.connectionInvitations.getSent(user.id)
      invitations = sentInvitations.map(inv => ({
        ...inv,
        user: inv.receiver,
        type: 'sent' as const,
        sentAt: inv.createdAt,
      }))
    } else if (query.type === 'received') {
      const receivedInvitations = await dbService.connectionInvitations.getReceived(user.id)
      invitations = receivedInvitations.map(inv => ({
        ...inv,
        user: inv.sender,
        type: 'received' as const,
        sentAt: inv.createdAt,
      }))
    } else {
      // Get both sent and received
      const [sent, received] = await Promise.all([
        dbService.connectionInvitations.getSent(user.id),
        dbService.connectionInvitations.getReceived(user.id),
      ])
      invitations = [
        ...received.map(inv => ({ 
          ...inv, 
          user: inv.sender, 
          type: 'received' as const,
          sentAt: inv.createdAt,
        })), 
        ...sent.map(inv => ({ 
          ...inv, 
          user: inv.receiver, 
          type: 'sent' as const,
          sentAt: inv.createdAt,
        }))
      ]
    }

    // Filter by status if provided
    if (query.status) {
      invitations = invitations.filter((inv) => inv.status === query.status)
    }

    // Simple pagination
    const startIndex = (query.page - 1) * query.limit
    const endIndex = startIndex + query.limit
    const paginatedInvitations = invitations.slice(startIndex, endIndex)

    return createSuccessResponse({
      invitations: paginatedInvitations,
      total: invitations.length,
      page: query.page,
      pageSize: query.limit,
      hasMore: endIndex < invitations.length,
    })
  } catch (error) {
    console.error('Error fetching invitations:', error)
    throw error
  }
})

export const POST = handleApiError(async (request: NextRequest) => {
  // Authentication check
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
  const validatedData = validateApiInput(createConnectionInvitationSchema, body)

  try {
    // Find the receiver by username
    const receiver = await dbService.profiles.findByUsername(validatedData.receiverUsername)
    
    if (!receiver) {
      return ErrorResponses.notFound('User', validatedData.receiverUsername)
    }

    // Prevent self-invitation
    if (receiver.id === user.id) {
      return NextResponse.json(
        { error: 'Cannot send invitation to yourself' },
        { status: 400 }
      )
    }

    // Check if already connected
    const existingConnection = await dbService.connections.findConnection(
      user.id,
      receiver.id
    )

    if (existingConnection) {
      return NextResponse.json(
        { error: 'Already connected to this user' },
        { status: 400 }
      )
    }

    // Check for pending invitation
    const hasPendingInvitation = await dbService.connectionInvitations.hasPendingInvitation(
      user.id,
      receiver.id
    )

    if (hasPendingInvitation) {
      return NextResponse.json(
        { error: 'Invitation already sent to this user' },
        { status: 400 }
      )
    }

    // Create the invitation
    const invitation = await dbService.connectionInvitations.create(
      user.id,
      receiver.id,
      validatedData.message
    )

    // TODO: Send notification to receiver
    // await notificationService.sendConnectionInvitation(invitation)

    return createSuccessResponse(invitation, 'Invitation sent successfully')
  } catch (error) {
    console.error('Error creating invitation:', error)
    throw error
  }
})