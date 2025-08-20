'use client'

import { useProfile } from '@/hooks/use-profile'
import { ProfileHero } from '@/components/profile/profile-hero'
import { ProfileSummary } from '@/components/profile/profile-summary'
import { ProjectsList } from '@/components/profile/projects-list'
import { ContentStream } from '@/components/profile/content-stream'
import { SkillsMatrix } from '@/components/profile/skills-matrix'
import { ConnectSection } from '@/components/profile/connect-section'
import { ProfileSidebar } from '@/components/profile/profile-sidebar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface ProfilePageClientProps {
  username: string
}

export function ProfilePageClient({ username }: ProfilePageClientProps) {
  const { data, isLoading, error } = useProfile(username)

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-65px)] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-65px)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">
            {error.message === 'Profile not found'
              ? `The user @${username} could not be found.`
              : 'There was an error loading this profile. Please try again.'}
          </p>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const { profile, userSettings, posts, projects, stats, isOwnProfile } = data

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-65px)]">
      {/* Main Content Layout */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="gap-8 grid grid-cols-1 lg:grid-cols-4">
          {/* Main Content - Scrollable */}
          <div className="space-y-8 lg:col-span-3">
            {/* Profile Hero Section */}
            <ProfileHero
              profile={profile}
              userSettings={userSettings}
              isOwnProfile={isOwnProfile}
              isFollowing={false} // TODO: Determine from connections data
            />

            {/* Profile Summary */}
            <ProfileSummary
              profile={profile}
              userSettings={userSettings}
              isOwnProfile={isOwnProfile}
            />

            {/* All Projects */}
            {projects && projects.length > 0 && (
              <ProjectsList projects={projects} />
            )}

            {/* Skills Matrix */}
            {userSettings && (
              <SkillsMatrix userSettings={userSettings} />
            )}

            {/* Content Stream */}
            {posts && posts.length > 0 && (
              <ContentStream posts={posts} profile={profile} />
            )}

            {/* Connect Section */}
            <ConnectSection
              profile={profile}
              userSettings={userSettings}
              isOwnProfile={isOwnProfile}
            />
          </div>

          {/* Sidebar - Fixed */}
          <div className="lg:col-span-1">
            <div className="lg:top-8 lg:sticky">
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