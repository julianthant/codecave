import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics'
import { DashboardCharts } from '@/components/dashboard/dashboard-charts'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { RecentPosts } from '@/components/dashboard/recent-posts'
import { DashboardData } from '@/types/dashboard'

// Mock data fetching function - replace with real API calls
async function getDashboardData(): Promise<DashboardData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const mockData: DashboardData = {
    metrics: {
      totalViews: 15420,
      followers: 1247,
      totalPosts: 24,
      engagementRate: 8.5,
    },
    activityData: [
      { date: '2025-01-01', views: 450, likes: 32, comments: 12 },
      { date: '2025-01-02', views: 520, likes: 45, comments: 18 },
      { date: '2025-01-03', views: 380, likes: 28, comments: 8 },
      { date: '2025-01-04', views: 680, likes: 52, comments: 22 },
      { date: '2025-01-05', views: 720, likes: 61, comments: 26 },
      { date: '2025-01-06', views: 590, likes: 43, comments: 15 },
      { date: '2025-01-07', views: 640, likes: 48, comments: 19 },
      { date: '2025-01-08', views: 710, likes: 55, comments: 24 },
      { date: '2025-01-09', views: 480, likes: 35, comments: 13 },
      { date: '2025-01-10', views: 650, likes: 47, comments: 20 },
      { date: '2025-01-11', views: 580, likes: 42, comments: 16 },
      { date: '2025-01-12', views: 760, likes: 63, comments: 28 },
      { date: '2025-01-13', views: 690, likes: 51, comments: 23 },
      { date: '2025-01-14', views: 620, likes: 46, comments: 18 },
      { date: '2025-01-15', views: 740, likes: 58, comments: 25 },
      { date: '2025-01-16', views: 560, likes: 41, comments: 14 },
      { date: '2025-01-17', views: 680, likes: 49, comments: 21 },
      { date: '2025-01-18', views: 800, likes: 67, comments: 30 },
    ],
    engagementData: [
      { date: '2025-01-01', engagement: 340, reach: 1200 },
      { date: '2025-01-02', engagement: 420, reach: 1450 },
      { date: '2025-01-03', engagement: 280, reach: 980 },
      { date: '2025-01-04', engagement: 520, reach: 1650 },
      { date: '2025-01-05', engagement: 610, reach: 1820 },
      { date: '2025-01-06', engagement: 450, reach: 1380 },
      { date: '2025-01-07', engagement: 490, reach: 1520 },
      { date: '2025-01-08', engagement: 580, reach: 1720 },
      { date: '2025-01-09', engagement: 380, reach: 1150 },
      { date: '2025-01-10', engagement: 510, reach: 1580 },
      { date: '2025-01-11', engagement: 460, reach: 1420 },
      { date: '2025-01-12', engagement: 640, reach: 1950 },
      { date: '2025-01-13', engagement: 570, reach: 1680 },
      { date: '2025-01-14', engagement: 490, reach: 1520 },
      { date: '2025-01-15', engagement: 620, reach: 1850 },
      { date: '2025-01-16', engagement: 440, reach: 1320 },
      { date: '2025-01-17', engagement: 550, reach: 1650 },
      { date: '2025-01-18', engagement: 720, reach: 2100 },
    ],
    recentPosts: [
      {
        id: '1',
        title: 'Building a Modern React Dashboard with TypeScript',
        slug: 'building-modern-react-dashboard',
        views: 2340,
        likes: 156,
        comments: 24,
        publishedAt: '2025-01-15T10:30:00Z',
      },
      {
        id: '2',
        title: 'Next.js 15 App Router: Complete Guide',
        slug: 'nextjs-15-app-router-guide',
        views: 1890,
        likes: 142,
        comments: 18,
        publishedAt: '2025-01-12T14:20:00Z',
      },
      {
        id: '3',
        title: 'Mastering Tailwind CSS Grid Layouts',
        slug: 'mastering-tailwind-grid-layouts',
        views: 1560,
        likes: 98,
        comments: 12,
        publishedAt: '2025-01-10T09:15:00Z',
      },
      {
        id: '4',
        title: 'Database Design Best Practices for Modern Apps',
        slug: 'database-design-best-practices',
        views: 2180,
        likes: 187,
        comments: 31,
        publishedAt: '2025-01-08T16:45:00Z',
      },
      {
        id: '5',
        title: 'Authentication in Next.js with Supabase',
        slug: 'nextjs-supabase-authentication',
        views: 1720,
        likes: 124,
        comments: 19,
        publishedAt: '2025-01-05T11:30:00Z',
      },
    ],
    topPosts: [
      {
        id: '1',
        title: 'Building a Modern React Dashboard with TypeScript',
        slug: 'building-modern-react-dashboard',
        views: 2340,
        likes: 156,
        comments: 24,
        publishedAt: '2025-01-15T10:30:00Z',
        engagementRate: 7.7,
        tags: ['react', 'typescript', 'dashboard'],
      },
      {
        id: '4',
        title: 'Database Design Best Practices for Modern Apps',
        slug: 'database-design-best-practices',
        views: 2180,
        likes: 187,
        comments: 31,
        publishedAt: '2025-01-08T16:45:00Z',
        engagementRate: 10.0,
        tags: ['database', 'design', 'architecture'],
      },
      {
        id: '2',
        title: 'Next.js 15 App Router: Complete Guide',
        slug: 'nextjs-15-app-router-guide',
        views: 1890,
        likes: 142,
        comments: 18,
        publishedAt: '2025-01-12T14:20:00Z',
        engagementRate: 8.5,
        tags: ['nextjs', 'routing', 'guide'],
      },
    ],
  }

  return mockData
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  // Fetch dashboard data
  const dashboardData = await getDashboardData()

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-65px)]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <DashboardHeader />

        <div className="space-y-6">
          {/* Metrics Grid */}
          <DashboardMetrics metrics={dashboardData.metrics} />

          {/* Main Content Grid */}
          <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
            {/* Left Column - Charts and Recent Posts */}
            <div className="space-y-6 lg:col-span-2">
              <DashboardCharts
                activityData={dashboardData.activityData}
                engagementData={dashboardData.engagementData}
              />
              <RecentPosts posts={dashboardData.recentPosts} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <DashboardSidebar topPosts={dashboardData.topPosts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
