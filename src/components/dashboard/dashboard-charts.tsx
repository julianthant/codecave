import { ActivityChart } from './activity-chart'
import { EngagementChart } from './engagement-chart'
import { DashboardChartsProps } from '@/types/dashboard'

export function DashboardCharts({ 
  activityData, 
  engagementData, 
  loading = false 
}: DashboardChartsProps) {
  return (
    <div className="space-y-6">
      <ActivityChart data={activityData} loading={loading} />
      <EngagementChart data={engagementData} loading={loading} />
    </div>
  )
}