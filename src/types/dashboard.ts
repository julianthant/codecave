import { LucideIcon } from 'lucide-react'

// Base interfaces for dashboard data
export interface DashboardMetrics {
  totalViews: number
  followers: number
  totalPosts: number
  engagementRate: number
}

export interface MetricChange {
  value: number
  type: 'increase' | 'decrease' | 'neutral'
  label: string
}

export interface DashboardCardProps {
  title: string
  value: string | number
  change?: MetricChange
  icon?: LucideIcon
  className?: string
}

export interface ActivityDataPoint {
  date: string // ISO date string
  views: number
  likes: number
  comments: number
}

export interface EngagementMetric {
  date: string // ISO date string
  engagement: number
  reach: number
}

export interface PostMetric {
  id: string
  title: string
  slug: string
  views: number
  likes: number
  comments: number
  publishedAt: string // ISO date string
}

export interface TopPerformingPost extends PostMetric {
  engagementRate: number
  tags: string[]
}

export interface ProgressGoal {
  id: string
  title: string
  description: string
  current: number
  target: number
  icon: LucideIcon
  color: string
  unit?: string
}

// API response types
export interface DashboardData {
  metrics: DashboardMetrics
  activityData: ActivityDataPoint[]
  engagementData: EngagementMetric[]
  recentPosts: PostMetric[]
  topPosts: TopPerformingPost[]
}

// Component prop types
export interface DashboardMetricsProps {
  metrics: DashboardMetrics
  loading?: boolean
}

export interface DashboardChartsProps {
  activityData: ActivityDataPoint[]
  engagementData: EngagementMetric[]
  loading?: boolean
}

export interface DashboardSidebarProps {
  topPosts: TopPerformingPost[]
  progressGoals?: ProgressGoal[]
  loading?: boolean
}