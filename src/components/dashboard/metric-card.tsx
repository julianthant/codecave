import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardCardProps } from '@/types/dashboard'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps extends DashboardCardProps {
  loading?: boolean
}

function MetricCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="space-y-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="w-24 h-4 bg-muted rounded" />
          <div className="w-6 h-6 bg-muted rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="w-16 h-8 bg-muted rounded" />
          <div className="w-20 h-4 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  className, 
  loading = false 
}: MetricCardProps) {
  if (loading) {
    return <MetricCardSkeleton />
  }

  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`
      }
      return val.toLocaleString()
    }
    return val
  }

  const getTrendIcon = () => {
    if (!change) return null
    
    switch (change.type) {
      case 'increase':
        return <TrendingUp className="w-3 h-3" />
      case 'decrease':
        return <TrendingDown className="w-3 h-3" />
      default:
        return <Minus className="w-3 h-3" />
    }
  }

  const getTrendColor = () => {
    if (!change) return ''
    
    switch (change.type) {
      case 'increase':
        return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/20'
      case 'decrease':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/20'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="space-y-0 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && (
            <Icon className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold tracking-tight">
            {formatValue(value)}
          </div>
          {change && (
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs font-medium flex items-center gap-1 w-fit",
                getTrendColor()
              )}
            >
              {getTrendIcon()}
              <span>
                {change.value > 0 ? '+' : ''}{change.value}% {change.label}
              </span>
            </Badge>
          )}
        </div>
      </CardContent>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-muted/5 pointer-events-none" />
    </Card>
  )
}