import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PostMetric } from '@/types/dashboard'
import { Eye, Heart, MessageCircle, Clock } from 'lucide-react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import Link from 'next/link'

interface RecentPostsProps {
  posts: PostMetric[]
  loading?: boolean
}

function RecentPostsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="w-32 h-5 bg-muted rounded animate-pulse" />
        <div className="w-48 h-4 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="w-full h-4 bg-muted rounded" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-3 bg-muted rounded" />
                <div className="w-12 h-3 bg-muted rounded" />
                <div className="w-12 h-3 bg-muted rounded" />
                <div className="w-20 h-3 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PostItem({ post }: { post: PostMetric }) {
  const publishedDate = parseISO(post.publishedAt)
  
  return (
    <div className="group space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <Link 
        href={`/post/${post.slug}`} 
        className="block"
      >
        <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h4>
      </Link>
      
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
        
        <div className="flex items-center gap-1 ml-auto">
          <Clock className="w-3 h-3" />
          <span>{formatDistanceToNow(publishedDate, { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  )
}

export function RecentPosts({ posts, loading = false }: RecentPostsProps) {
  if (loading) {
    return <RecentPostsSkeleton />
  }

  const sortedPosts = posts.sort((a, b) => 
    parseISO(b.publishedAt).getTime() - parseISO(a.publishedAt).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Recent Posts
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your latest published content
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No posts published yet</p>
              <p className="text-xs mt-1">Create your first post to get started!</p>
            </div>
          ) : (
            sortedPosts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))
          )}
        </div>
        
        {posts.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Link 
              href="/dashboard/posts" 
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              View all posts →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}