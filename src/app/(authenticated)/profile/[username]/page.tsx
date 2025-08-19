import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProfileHero } from '@/components/profile/profile-hero'
import { ProfileSummary } from '@/components/profile/profile-summary'
import { ProjectsList } from '@/components/profile/projects-list'
import { ContentStream } from '@/components/profile/content-stream'
import { SkillsMatrix } from '@/components/profile/skills-matrix'
import { ConnectSection } from '@/components/profile/connect-section'
import { ProfileSidebar } from '@/components/profile/profile-sidebar'
import type { Profile, UserSettings, Post } from '@/db/schema'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

// Mock data - In real app, this would come from database
const mockProfileData = {
  profile: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    username: 'johndoe',
    displayName: 'John Doe',
    bio: 'Full-stack developer passionate about React, TypeScript, and building amazing web experiences. Love collaborating on open source projects and sharing knowledge with the community.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    githubUsername: 'johndoe',
    twitterUsername: 'johndoe',
    discordUsername: 'johndoe#1234',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date(),
  } as Profile,
  
  userSettings: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'GraphQL', 'Docker'],
    languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'SQL'],
    experienceLevel: 'senior' as const,
    availableForCollab: true,
    emailNotifications: true,
    theme: 'system',
    isPro: false,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date(),
  } as UserSettings,

  posts: [
    {
      id: '1',
      authorId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Building Scalable React Applications with TypeScript',
      slug: 'building-scalable-react-applications-typescript',
      content: {},
      excerpt: 'Learn how to structure your React applications for scale using TypeScript, proper architecture patterns, and modern development practices.',
      visibility: 'public' as const,
      isPublished: true,
      isDraft: false,
      tags: ['React', 'TypeScript', 'Architecture', 'Best Practices'],
      readingTime: '8 min read',
      viewCount: '1247',
      likeCount: '89',
      commentCount: '23',
      publishedAt: new Date('2024-08-10'),
      createdAt: new Date('2024-08-10'),
      updatedAt: new Date('2024-08-10'),
    },
    {
      id: '2',
      authorId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'The Future of Web Development: Server Components and SSR',
      slug: 'future-web-development-server-components-ssr',
      content: {},
      excerpt: 'Exploring the latest developments in web development with React Server Components, Next.js App Router, and modern SSR patterns.',
      visibility: 'public' as const,
      isPublished: true,
      isDraft: false,
      tags: ['Next.js', 'React', 'SSR', 'Server Components'],
      readingTime: '12 min read',
      viewCount: '2156',
      likeCount: '156',
      commentCount: '45',
      publishedAt: new Date('2024-08-05'),
      createdAt: new Date('2024-08-05'),
      updatedAt: new Date('2024-08-05'),
    },
    {
      id: '3',
      authorId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Database Design Patterns for Modern Applications',
      slug: 'database-design-patterns-modern-applications',
      content: {},
      excerpt: 'A comprehensive guide to database design patterns, normalization, and optimization techniques for modern web applications.',
      visibility: 'public' as const,
      isPublished: true,
      isDraft: false,
      tags: ['Database', 'PostgreSQL', 'Design Patterns', 'Performance'],
      readingTime: '15 min read',
      viewCount: '987',
      likeCount: '67',
      commentCount: '18',
      publishedAt: new Date('2024-07-28'),
      createdAt: new Date('2024-07-28'),
      updatedAt: new Date('2024-07-28'),
    },
  ] as Post[],

  projects: [
    {
      id: '1',
      name: 'CodeCave Platform',
      description: 'A modern developer community platform built with Next.js, TypeScript, and Supabase. Features real-time collaboration, project showcasing, and developer networking.',
      technologies: ['Next.js', 'TypeScript', 'Supabase', 'TailwindCSS', 'Framer Motion'],
      githubUrl: 'https://github.com/johndoe/codecave-platform',
      liveUrl: 'https://codecave.dev',
      stars: 245,
      forks: 67,
      isPrivate: false,
      lastUpdated: '2 days ago',
      language: 'TypeScript',
    },
    {
      id: '2',
      name: 'React Component Library',
      description: 'A comprehensive React component library with TypeScript support, Storybook documentation, and automated testing. Used by multiple teams in production.',
      technologies: ['React', 'TypeScript', 'Storybook', 'Jest', 'Rollup'],
      githubUrl: 'https://github.com/johndoe/react-component-library',
      liveUrl: 'https://components.johndoe.dev',
      stars: 432,
      forks: 89,
      isPrivate: false,
      lastUpdated: '1 week ago',
      language: 'TypeScript',
    },
    {
      id: '3',
      name: 'API Gateway Service',
      description: 'High-performance API gateway built with Go and Redis. Handles rate limiting, authentication, and request routing for microservices architecture.',
      technologies: ['Go', 'Redis', 'Docker', 'Kubernetes', 'Prometheus'],
      githubUrl: 'https://github.com/johndoe/api-gateway',
      stars: 156,
      forks: 34,
      isPrivate: false,
      lastUpdated: '3 weeks ago',
      language: 'Go',
    },
    {
      id: '4',
      name: 'Internal Dashboard',
      description: 'Company internal dashboard for monitoring and analytics. Built with modern React patterns and real-time data visualization.',
      technologies: ['React', 'D3.js', 'WebSocket', 'Node.js'],
      stars: 0,
      forks: 0,
      isPrivate: true,
      lastUpdated: '1 month ago',
      language: 'JavaScript',
    },
  ],

  stats: {
    followers: 1247,
    following: 342,
    posts: 23,
    projects: 15,
    totalLikes: 2456,
  },
}

async function getProfileData(username: string) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // In real app, fetch from database based on username
  if (username === mockProfileData.profile.username) {
    return mockProfileData
  }
  
  return null
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const data = await getProfileData(username)
  
  if (!data) {
    return {
      title: 'Profile Not Found | CodeCave',
    }
  }

  const { profile } = data
  const displayName = profile.displayName || profile.username

  return {
    title: `${displayName} (@${profile.username}) | CodeCave`,
    description: profile.bio || `${displayName}'s profile on CodeCave - a developer community platform.`,
    openGraph: {
      title: `${displayName} (@${profile.username})`,
      description: profile.bio || `${displayName}'s profile on CodeCave`,
      images: profile.avatarUrl ? [profile.avatarUrl] : undefined,
    },
    twitter: {
      card: 'summary',
      title: `${displayName} (@${profile.username})`,
      description: profile.bio || `${displayName}'s profile on CodeCave`,
      images: profile.avatarUrl ? [profile.avatarUrl] : undefined,
    },
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const data = await getProfileData(username)

  if (!data) {
    notFound()
  }

  const { profile, userSettings, posts, projects, stats } = data

  // TODO: In real app, determine if this is the current user's profile
  const isOwnProfile = false

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Scrollable */}
          <div className="lg:col-span-3 space-y-8">
            {/* Profile Hero Section - Now as a card */}
            <ProfileHero 
              profile={profile}
              userSettings={userSettings}
              isOwnProfile={isOwnProfile}
              isFollowing={false}
            />

            {/* Profile Summary */}
            <ProfileSummary 
              profile={profile}
              userSettings={userSettings}
              isOwnProfile={isOwnProfile}
            />

            {/* All Projects */}
            <ProjectsList projects={projects} />

            {/* Skills Matrix - Simplified */}
            <SkillsMatrix userSettings={userSettings} />

            {/* Content Stream */}
            <ContentStream 
              posts={posts}
              profile={profile}
            />

            {/* Connect Section */}
            <ConnectSection 
              profile={profile}
              userSettings={userSettings}
              isOwnProfile={isOwnProfile}
            />
          </div>

          {/* Sidebar - Fixed */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <ProfileSidebar 
                profile={profile}
                userSettings={userSettings}
                stats={stats}
                isOwnProfile={isOwnProfile}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}