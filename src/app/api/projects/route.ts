import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/services/database'
import { createClient } from '@/utils/supabase/server'
import { handleApiError, validateApiInput, createSuccessResponse } from '@/utils/api-errors'
import { createProjectSchema, userProjectQuerySchema, projectSelectSchema } from '@/db/schema/validation/projects.validation'

export const POST = handleApiError(async (request: NextRequest) => {
  // Get current user for auth context
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  // Parse and validate request body
  const body = await request.json()
  const validatedData = validateApiInput(createProjectSchema, body)

  // Create project data
  const projectData = {
    userId: user.id,
    name: validatedData.name,
    description: validatedData.description || null,
    technologies: validatedData.technologies || [],
    githubUrl: validatedData.githubUrl || null,
    liveUrl: validatedData.liveUrl || null,
    imageUrl: validatedData.imageUrl || null,
    isPrivate: validatedData.isPrivate,
    language: validatedData.language || null,
    stars: 0, // Always start with 0 for new projects
    forks: 0, // Always start with 0 for new projects
  }

  // Create the project
  const project = await dbService.projects.create(projectData)

  // Validate output
  const validatedProject = projectSelectSchema.parse(project)

  return createSuccessResponse(validatedProject, 'Project created successfully')
})

export const GET = handleApiError(async (request: NextRequest) => {
  // Get current user for auth context
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
    userProjectQuerySchema,
    Object.fromEntries(request.nextUrl.searchParams)
  )

  // Fetch user's projects
  const projects = await dbService.projects.findByUser(user.id, query.includePrivate)

  // Apply search filter if provided
  let filteredProjects = projects
  if (query.search) {
    const searchTerm = query.search.toLowerCase()
    filteredProjects = projects.filter(project => 
      project.name.toLowerCase().includes(searchTerm) ||
      project.description?.toLowerCase().includes(searchTerm) ||
      project.technologies?.some(tech => tech.toLowerCase().includes(searchTerm)) ||
      project.language?.toLowerCase().includes(searchTerm)
    )
  }

  // Apply technology filter if provided
  if (query.technology) {
    filteredProjects = filteredProjects.filter(project =>
      project.technologies?.some(tech => 
        tech.toLowerCase() === query.technology!.toLowerCase()
      )
    )
  }

  // Apply language filter if provided
  if (query.language) {
    filteredProjects = filteredProjects.filter(project =>
      project.language?.toLowerCase() === query.language!.toLowerCase()
    )
  }

  // Apply pagination
  const startIndex = (query.page - 1) * query.limit
  const endIndex = startIndex + query.limit
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

  return createSuccessResponse({
    projects: paginatedProjects,
    total: filteredProjects.length,
    page: query.page,
    pageSize: query.limit,
    hasMore: endIndex < filteredProjects.length,
  })
})