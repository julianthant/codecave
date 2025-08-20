import { Metadata } from 'next'
import { CollaborationsContainer } from '@/components/collaborations/collaborations-container'

export const metadata: Metadata = {
  title: 'Collaborations | CodeCave',
  description:
    'Find collaboration opportunities, connect with developers for projects, and build amazing things together.',
  openGraph: {
    title: 'Collaborations | CodeCave',
    description:
      'Find collaboration opportunities, connect with developers for projects, and build amazing things together.',
  },
  twitter: {
    card: 'summary',
    title: 'Collaborations | CodeCave',
    description:
      'Find collaboration opportunities, connect with developers for projects, and build amazing things together.',
  },
}

export default function CollaborationsPage() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-65px)]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="font-bold text-gray-900 text-3xl tracking-tight">
            Collaborations
          </h1>
          <p className="mt-2 text-gray-600">
            Find collaboration opportunities, team up on projects, and build
            amazing things together
          </p>
        </div>

        <CollaborationsContainer />
      </div>
    </div>
  )
}
