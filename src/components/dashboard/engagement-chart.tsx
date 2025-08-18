'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { EngagementMetric } from '@/types/dashboard'
import { format, parseISO } from 'date-fns'
import { TrendingUp } from 'lucide-react'

interface EngagementChartProps {
  data: EngagementMetric[]
  loading?: boolean
}

function EngagementChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="w-36 h-5 bg-muted rounded animate-pulse" />
        <div className="w-48 h-4 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="w-full h-[250px] bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  )
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
    color: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length && label) {
    const date = parseISO(label)
    
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm mb-2">
          {format(date, 'MMM dd, yyyy')}
        </p>
        <div className="space-y-1">
          {payload.map((entry) => (
            <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize text-muted-foreground">
                {entry.dataKey}:
              </span>
              <span className="font-medium">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  return null
}

export function EngagementChart({ data, loading = false }: EngagementChartProps) {
  if (loading) {
    return <EngagementChartSkeleton />
  }

  const totalEngagement = data.reduce((sum, item) => sum + item.engagement, 0)
  const avgEngagement = Math.round(totalEngagement / data.length)
  const lastWeekData = data.slice(-7)
  const lastWeekAvg = Math.round(
    lastWeekData.reduce((sum, item) => sum + item.engagement, 0) / lastWeekData.length
  )
  const weeklyChange = avgEngagement > 0 
    ? Math.round(((lastWeekAvg - avgEngagement) / avgEngagement) * 100)
    : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Engagement Trends
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Interactions and reach over time
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold">
              {avgEngagement.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">avg daily</span>
              {weeklyChange !== 0 && (
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    weeklyChange > 0 
                      ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/20' 
                      : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/20'
                  }`}
                >
                  {weeklyChange > 0 ? '+' : ''}{weeklyChange}%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-muted/30"
              />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = parseISO(value)
                  return format(date, 'MM/dd')
                }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Bar 
                dataKey="engagement" 
                fill="hsl(var(--primary))"
                radius={[2, 2, 0, 0]}
                className="fill-primary/80 hover:fill-primary"
              />
              
              <Bar 
                dataKey="reach" 
                fill="hsl(var(--chart-2))"
                radius={[2, 2, 0, 0]}
                className="fill-chart-2/60 hover:fill-chart-2/80"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Engagement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-2))' }} />
            <span className="text-muted-foreground">Reach</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}