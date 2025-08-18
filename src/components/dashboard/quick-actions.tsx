import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  PlusCircle, 
  Settings, 
  BarChart3, 
  Users, 
  Edit3, 
  Zap,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface QuickActionProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  href: string
  variant?: 'default' | 'primary'
}

function QuickActionItem({ 
  icon: Icon, 
  title, 
  description, 
  href, 
  variant = 'default' 
}: QuickActionProps) {
  return (
    <Link href={href}>
      <div className="group p-4 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-all cursor-pointer">
        <div className="flex items-start gap-3">
          <div className={`shrink-0 p-2 rounded-lg ${
            variant === 'primary' 
              ? 'bg-primary/10 text-primary' 
              : 'bg-muted text-muted-foreground'
          }`}>
            <Icon className="w-4 h-4" />
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                {title}
              </h4>
              <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

interface QuickActionsProps {
  loading?: boolean
}

function QuickActionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="w-28 h-5 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-lg border animate-pulse">
              <div className="w-8 h-8 bg-muted rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="w-24 h-4 bg-muted rounded" />
                <div className="w-full h-3 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const quickActions: QuickActionProps[] = [
  {
    icon: PlusCircle,
    title: 'Write New Post',
    description: 'Create and share new content with the community',
    href: '/write',
    variant: 'primary'
  },
  {
    icon: Edit3,
    title: 'Draft Posts',
    description: 'Continue working on your saved drafts',
    href: '/dashboard/drafts'
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'View detailed performance metrics and insights',
    href: '/dashboard/analytics'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with other developers and join discussions',
    href: '/community'
  },
  {
    icon: Settings,
    title: 'Profile Settings',
    description: 'Update your profile and preferences',
    href: '/settings'
  },
  {
    icon: Zap,
    title: 'Pro Features',
    description: 'Unlock advanced analytics and customization',
    href: '/pro'
  }
]

export function QuickActions({ loading = false }: QuickActionsProps) {
  if (loading) {
    return <QuickActionsSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quickActions.map((action, index) => (
            <QuickActionItem
              key={index}
              icon={action.icon}
              title={action.title}
              description={action.description}
              href={action.href}
              variant={action.variant}
            />
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <Link href="/help">
            <Button variant="outline" size="sm" className="w-full">
              Need help getting started?
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}