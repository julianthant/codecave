import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/services/database'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Get current user for auth context
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    // Create project data
    const projectData = {
      userId: user.id,
      name: body.name.trim(),
      description: body.description?.trim() || null,
      technologies: body.technologies || [],
      githubUrl: body.githubUrl?.trim() || null,
      liveUrl: body.liveUrl?.trim() || null,
      imageUrl: body.imageUrl?.trim() || null,
      isPrivate: Boolean(body.isPrivate),
      language: body.language?.trim() || null,
      stars: body.stars || 0,
      forks: body.forks || 0,
    }

    // Create the project
    const project = await dbService.projects.create(projectData)

    return NextResponse.json({
      success: true,
      project
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current user for auth context
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const includePrivate = searchParams.get('includePrivate') === 'true'

    // Fetch user's projects
    const projects = await dbService.projects.findByUser(user.id, includePrivate)

    return NextResponse.json({
      projects
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}