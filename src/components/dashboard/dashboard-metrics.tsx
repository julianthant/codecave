import { Eye, Users, FileText, TrendingUp } from 'lucide-react'
import { MetricCard } from './metric-card'
import { DashboardMetricsProps, MetricChange } from '@/types/dashboard'

export function DashboardMetrics({ metrics, loading = false }: DashboardMetricsProps) {
  // Calculate mock changes - in real app, this would come from API
  const getMetricChange = (): MetricChange => {
    const change = Math.floor(Math.random() * 20) - 5 // Random change between -5% and 15%
    return {
      value: change,
      type: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'neutral',
      label: 'vs last month'
    }
  }

  const metricCards = [
    {
      title: 'Total Views',
      value: metrics.totalViews,
      change: getMetricChange(),
      icon: Eye,
    },
    {
      title: 'Followers',
      value: metrics.followers,
      change: getMetricChange(),
      icon: Users,
    },
    {
      title: 'Posts',
      value: metrics.totalPosts,
      change: getMetricChange(),
      icon: FileText,
    },
    {
      title: 'Engagement Rate',
      value: `${metrics.engagementRate}%`,
      change: getMetricChange(),
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((card, index) => (
        <MetricCard
          key={index}
          title={card.title}
          value={card.value}
          change={card.change}
          icon={card.icon}
          loading={loading}
        />
      ))}
    </div>
  )
}