import { Metadata } from 'next'
import { Suspense } from 'react'
import { FeedContainer } from '@/components/feed/posts/feed-container'
import { FeedLeftSidebar } from '@/components/feed/sidebar-left/feed-left-sidebar'
import { FeedRightSidebar } from '@/components/feed/sidebar-right/feed-right-sidebar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const metadata: Metadata = {
  title: 'Feed | CodeCave',
  description:
    'Discover the latest from the developer community - articles, code snippets, projects, and discussions',
  openGraph: {
    title: 'Developer Feed | CodeCave',
    description: 'Connect with developers and discover the latest in tech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Feed | CodeCave',
    description: 'Connect with developers and discover the latest in tech',
  },
}

export default function FeedPage() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-65px)]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-16">
          {/* Left Sidebar - Hidden on mobile, smaller than right */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="top-6 sticky space-y-3">
              <Suspense fallback={<LoadingSpinner />}>
                <FeedLeftSidebar />
              </Suspense>
            </div>
          </div>

          {/* Main Feed Content */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <FeedContainer />
              </Suspense>
            </div>
          </div>

          {/* Right Sidebar - Hidden on mobile and tablet, larger than left */}
          <div className="hidden xl:block xl:col-span-4">
            <div className="top-6 sticky space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <FeedRightSidebar />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Spacer for Navigation */}
      <div className="lg:hidden h-20" />
    </div>
  )
}
