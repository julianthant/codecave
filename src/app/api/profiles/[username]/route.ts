import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/services/database'
import { createClient } from '@/utils/supabase/server'

// Utility function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return diffMinutes <= 1 ? 'just now' : `${diffMinutes} minutes ago`
    }
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
  }
  
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return months === 1 ? '1 month ago' : `${months} months ago`
  }
  const years = Math.floor(diffDays / 365)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    // Validate username format
    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Invalid username parameter' },
        { status: 400 }
      )
    }

    // Get current user for auth context
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const currentUserId = user?.id || null

    // Fetch profile data
    const profile = await dbService.profiles.findByUsername(username)

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Fetch user settings only if viewing own profile
    const isOwnProfile = currentUserId === profile.id
    const userSettings = isOwnProfile ? await dbService.userSettings.findById(profile.id) : null

    // Fetch user's posts (use existing method)
    const allPosts = await dbService.posts.findByAuthor(profile.id)
    const posts = allPosts
      .filter(post => post.visibility === 'public' && post.isPublished)
      .slice(0, 10) // Limit to 10 posts

    // Fetch user's projects (use existing method and transform for UI)
    const rawProjects = await dbService.projects.findByUser(profile.id, false) // false = public only
    const projects = rawProjects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description || '',
      technologies: project.technologies || [],
      githubUrl: project.githubUrl || undefined,
      liveUrl: project.liveUrl || undefined,
      stars: project.stars,
      forks: project.forks,
      isPrivate: project.isPrivate,
      lastUpdated: getRelativeTime(project.updatedAt),
      language: project.language || 'Unknown',
    }))

    // Get user stats
    const [followers, following] = await Promise.all([
      dbService.connections.getFollowersCount(profile.id),
      dbService.connections.getFollowingCount(profile.id)
    ])
    
    const postsCount = allPosts.filter(post => post.visibility === 'public' && post.isPublished).length

    // Calculate total likes across all posts
    const totalLikes = posts.reduce((sum, post) => sum + post.likeCount, 0)

    const stats = {
      followers,
      following,
      posts: postsCount,
      projects: projects.length,
      totalLikes,
    }

    return NextResponse.json({
      profile,
      userSettings,
      posts,
      projects,
      stats,
      isOwnProfile,
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}