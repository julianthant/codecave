import { Metadata } from 'next'
import { ProfilePageClient } from './profile-page-client'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params

  // For basic SEO - we'll fetch title from API in the client component
  return {
    title: `@${username} | CodeCave`,
    description: `${username}'s profile on CodeCave - a developer community platform.`,
    openGraph: {
      title: `@${username} | CodeCave`,
      description: `${username}'s profile on CodeCave`,
    },
    twitter: {
      card: 'summary',
      title: `@${username} | CodeCave`,
      description: `${username}'s profile on CodeCave`,
    },
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  return <ProfilePageClient username={username} />
}
