import { Metadata } from 'next'
import { ConnectionsContainer } from '@/components/connections/connections-container'

export const metadata: Metadata = {
  title: 'Connections | CodeCave',
  description:
    'Discover developers, manage your network, and build meaningful connections in the CodeCave community.',
  openGraph: {
    title: 'Connections | CodeCave',
    description:
      'Discover developers, manage your network, and build meaningful connections in the CodeCave community.',
  },
  twitter: {
    card: 'summary',
    title: 'Connections | CodeCave',
    description:
      'Discover developers, manage your network, and build meaningful connections in the CodeCave community.',
  },
}

export default function ConnectionsPage() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-65px)]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="font-bold text-gray-900 text-3xl tracking-tight">
            Connections
          </h1>
          <p className="mt-2 text-gray-600">
            Discover developers, manage your network, and build meaningful
            connections
          </p>
        </div>

        <ConnectionsContainer />
      </div>
    </div>
  )
}
