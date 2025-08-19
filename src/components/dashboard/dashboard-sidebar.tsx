import { Users, Target, Trophy } from 'lucide-react'
import { QuickActions } from './quick-actions'
import { TopPosts } from './top-posts'
import { ProgressIndicators } from './progress-indicators'
import { DashboardSidebarProps, ProgressGoal } from '@/types/dashboard'

export function DashboardSidebar({ 
  topPosts, 
  progressGoals, 
  loading = false 
}: DashboardSidebarProps) {
  // Mock progress goals if not provided
  const defaultGoals: ProgressGoal[] = [
    {
      id: 'followers',
      title: 'Follower Milestone',
      description: 'Build your community reach',
      current: 1247,
      target: 1500,
      icon: Users,
      color: '#ff6600',
      unit: ''
    },
    {
      id: 'posts',
      title: 'Content Creation',
      description: 'Share valuable knowledge',
      current: 24,
      target: 30,
      icon: Target,
      color: '#3b82f6',
      unit: ''
    },
    {
      id: 'engagement',
      title: 'Engagement Goal',
      description: 'Connect with your audience',
      current: 8.5,
      target: 12,
      icon: Trophy,
      color: '#10b981',
      unit: '%'
    }
  ]

  const goals = progressGoals || defaultGoals

  // Mock metrics for progress indicators
  const mockMetrics = {
    totalViews: 15400,
    followers: goals[0]?.current || 1247,
    totalPosts: goals[1]?.current || 24,
    engagementRate: goals[2]?.current || 8.5
  }

  return (
    <div className="space-y-6">
      <QuickActions loading={loading} />
      <TopPosts posts={topPosts} loading={loading} />
      <ProgressIndicators metrics={mockMetrics} loading={loading} />
    </div>
  )
}