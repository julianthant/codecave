import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardMetrics } from '@/types/dashboard'
import { Target, Trophy, Users, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressIndicatorsProps {
  metrics: DashboardMetrics
  loading?: boolean
}

interface ProgressGoal {
  id: string
  title: string
  description: string
  current: number
  target: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  unit?: string
}

function ProgressIndicatorsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="w-28 h-5 bg-muted rounded animate-pulse" />
        <div className="w-40 h-4 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="w-32 h-4 bg-muted rounded" />
                <div className="w-16 h-4 bg-muted rounded" />
              </div>
              <div className="w-full h-2 bg-muted rounded" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ProgressBar({ 
  current, 
  target, 
  color, 
  className 
}: { 
  current: number
  target: number
  color: string
  className?: string 
}) {
  const percentage = Math.min((current / target) * 100, 100)
  
  return (
    <div className={cn("w-full bg-muted rounded-full h-2", className)}>
      <div 
        className="h-2 rounded-full transition-all duration-700 ease-out"
        style={{ 
          width: `${percentage}%`,
          backgroundColor: color
        }}
      />
    </div>
  )
}

function GoalItem({ goal }: { goal: ProgressGoal }) {
  const percentage = Math.min((goal.current / goal.target) * 100, 100)
  const isCompleted = goal.current >= goal.target
  const Icon = goal.icon
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg shrink-0"
            style={{ 
              backgroundColor: `${goal.color}20`,
              color: goal.color 
            }}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">{goal.title}</h4>
              {isCompleted && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400"
                >
                  Complete!
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{goal.description}</p>
          </div>
        </div>
        
        <div className="text-right shrink-0">
          <div className="text-sm font-medium">
            {goal.current.toLocaleString()}{goal.unit} / {goal.target.toLocaleString()}{goal.unit}
          </div>
          <div className="text-xs text-muted-foreground">
            {percentage.toFixed(0)}%
          </div>
        </div>
      </div>
      
      <ProgressBar 
        current={goal.current}
        target={goal.target}
        color={goal.color}
      />
    </div>
  )
}

export function ProgressIndicators({ metrics, loading = false }: ProgressIndicatorsProps) {
  if (loading) {
    return <ProgressIndicatorsSkeleton />
  }

  const goals: ProgressGoal[] = [
    {
      id: 'followers',
      title: 'Follower Milestone',
      description: 'Build your community reach',
      current: metrics.followers,
      target: Math.ceil(metrics.followers / 100) * 100 + 100,
      icon: Users,
      color: 'hsl(var(--primary))',
      unit: ''
    },
    {
      id: 'posts',
      title: 'Content Creation',
      description: 'Share valuable knowledge',
      current: metrics.totalPosts,
      target: Math.ceil(metrics.totalPosts / 10) * 10 + 10,
      icon: Target,
      color: 'hsl(var(--chart-2))',
      unit: ''
    },
    {
      id: 'engagement',
      title: 'Engagement Rate',
      description: 'Connect with your audience',
      current: metrics.engagementRate,
      target: Math.max(metrics.engagementRate + 2, 10),
      icon: Zap,
      color: 'hsl(var(--chart-3))',
      unit: '%'
    }
  ]

  const completedGoals = goals.filter(goal => goal.current >= goal.target).length
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Progress Goals
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Track your growth milestones
          </p>
          {completedGoals > 0 && (
            <Badge 
              variant="secondary" 
              className="bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400"
            >
              {completedGoals}/{goals.length} completed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => (
            <GoalItem key={goal.id} goal={goal} />
          ))}
        </div>
        
        {completedGoals === goals.length && (
          <div className="mt-6 pt-4 border-t text-center">
            <div className="text-sm text-green-600 dark:text-green-400 font-medium">
              🎉 All goals completed! Keep up the great work!
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              New milestones will be set automatically
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}