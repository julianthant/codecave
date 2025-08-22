import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/services/database'
import { createClient } from '@/utils/supabase/server'
import { handleApiError, validateApiInput, createSuccessResponse, ErrorResponses } from '@/utils/api-errors'
import { updateProjectSchema, projectSelectSchema } from '@/db/schema/validation/projects.validation'
import { z } from 'zod'

const projectIdSchema = z.object({
  id: z.string().uuid('Invalid project ID format')
})

export const GET = handleApiError(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params

  // Validate project ID
  const { id: validatedId } = validateApiInput(projectIdSchema, { id })

  // Get current user for auth context
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  // Fetch project from database
  const projects = await dbService.projects.findByUser(user.id, true)
  const project = projects.find(p => p.id === validatedId)

  if (!project) {
    return ErrorResponses.notFound('Project', validatedId)
  }

  // Validate output
  const validatedProject = projectSelectSchema.parse(project)

  return createSuccessResponse(validatedProject)
})

export const PATCH = handleApiError(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params

  // Validate project ID
  const { id: validatedId } = validateApiInput(projectIdSchema, { id })

  // Get current user for auth context
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  // Verify project ownership
  const projects = await dbService.projects.findByUser(user.id, true)
  const project = projects.find(p => p.id === validatedId)

  if (!project) {
    return ErrorResponses.notFound('Project', validatedId)
  }

  // Parse and validate request body
  const body = await request.json()
  const validatedUpdates = validateApiInput(updateProjectSchema, body)

  // Check if there are any fields to update
  if (Object.keys(validatedUpdates).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    )
  }

  // Update the project
  const updatedProject = await dbService.projects.update(validatedId, validatedUpdates)

  // Validate output
  const validatedProject = projectSelectSchema.parse(updatedProject)

  return createSuccessResponse(validatedProject, 'Project updated successfully')
})

export const DELETE = handleApiError(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params

  // Validate project ID
  const { id: validatedId } = validateApiInput(projectIdSchema, { id })

  // Get current user for auth context
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  // Verify project ownership
  const projects = await dbService.projects.findByUser(user.id, true)
  const project = projects.find(p => p.id === validatedId)

  if (!project) {
    return ErrorResponses.notFound('Project', validatedId)
  }

  // Delete the project
  await dbService.projects.delete(validatedId)

  return createSuccessResponse(
    { id: validatedId }, 
    'Project deleted successfully'
  )
})