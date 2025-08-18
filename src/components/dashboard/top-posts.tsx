import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TopPerformingPost } from '@/types/dashboard'
import { TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import Link from 'next/link'

interface TopPostsProps {
  posts: TopPerformingPost[]
  loading?: boolean
}

function TopPostsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="w-40 h-5 bg-muted rounded animate-pulse" />
        <div className="w-56 h-4 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="w-full h-4 bg-muted rounded" />
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="w-16 h-4 bg-muted rounded" />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-3 bg-muted rounded" />
                  <div className="w-12 h-3 bg-muted rounded" />
                  <div className="w-12 h-3 bg-muted rounded" />
                </div>
                <div className="w-20 h-3 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function TopPostItem({ post, rank }: { post: TopPerformingPost; rank: number }) {
  const publishedDate = parseISO(post.publishedAt)
  
  const getRankBadge = (rank: number) => {
    const badges = {
      1: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400',
      2: 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400', 
      3: 'bg-amber-600/10 text-amber-700 border-amber-600/20 dark:text-amber-400'
    }
    
    return badges[rank as keyof typeof badges] || 'bg-muted text-muted-foreground'
  }
  
  return (
    <div className="group space-y-3 p-4 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-all">
      <div className="flex items-start justify-between gap-2">
        <Link 
          href={`/post/${post.id}`} 
          className="flex-1"
        >
          <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
            {post.title}
          </h4>
        </Link>
        <Badge 
          variant="outline" 
          className={`text-xs font-semibold shrink-0 ${getRankBadge(rank)}`}
        >
          #{rank}
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {post.tags.slice(0, 3).map((tag) => (
          <Badge 
            key={tag} 
            variant="secondary" 
            className="text-xs px-2 py-0.5 font-normal"
          >
            {tag}
          </Badge>
        ))}
        {post.tags.length > 3 && (
          <Badge variant="outline" className="text-xs px-2 py-0.5 font-normal">
            +{post.tags.length - 3}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{post.views.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{post.likes.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>{post.comments.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <TrendingUp className="w-3 h-3" />
            <span className="font-medium">{post.engagementRate}%</span>
          </div>
          <span className="text-muted-foreground">
            {formatDistanceToNow(publishedDate, { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  )
}

export function TopPosts({ posts, loading = false }: TopPostsProps) {
  if (loading) {
    return <TopPostsSkeleton />
  }

  const topPosts = posts.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          Top Performing Posts
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your highest-engagement content this period
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No performance data yet</p>
              <p className="text-xs mt-1">Publish more content to see analytics!</p>
            </div>
          ) : (
            topPosts.map((post, index) => (
              <TopPostItem 
                key={post.id} 
                post={post} 
                rank={index + 1} 
              />
            ))
          )}
        </div>
        
        {posts.length > 5 && (
          <div className="mt-6 pt-4 border-t">
            <Link 
              href="/dashboard/analytics" 
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              View detailed analytics →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}