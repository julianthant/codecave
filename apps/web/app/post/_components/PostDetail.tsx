import React, { useState } from 'react';
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VSCodeHighlighter } from "@/components/VSCodeHighlighter";
import { CommentSection } from "@/components/CommentSection";
import { 
  Heart, 
  Share2, 
  Bookmark, 
  ArrowLeft,
  Star,
  GitBranch,
  Bug,
  ExternalLink,
  Award,
  Clock,
  Eye,
  Users,
  Calendar
} from "lucide-react";

// Mock post data (in real app, this would come from API)
const mockPostData = {
  "1": {
    id: "1",
    type: "project" as const,
    author: {
      name: "Sarah Chen",
      username: "sarahbuilds",
      avatar: "/api/placeholder/40/40",
      verified: true,
      rank: "Senior" as const,
      specialties: ["React", "AI/ML", "TypeScript"],
      bio: "Full-stack developer passionate about AI-powered developer tools. Building the future of collaborative coding.",
      location: "San Francisco, CA",
      joinDate: "March 2021",
      followers: 1247,
      following: 892
    },
    timestamp: "2h",
    content: "Built a real-time collaborative code editor with AI-powered suggestions! 🚀 Features include live cursors, syntax highlighting for 50+ languages, and GPT-4 integration for smart completions.\n\nThis project started as a weekend hackathon idea but quickly grew into something much bigger. The real challenge was handling conflict resolution when multiple developers edit the same file simultaneously.\n\nKey technical challenges solved:\n• Real-time operational transformation\n• WebRTC peer-to-peer connections for low latency\n• AI context-aware code completions\n• Collaborative debugging sessions\n• Live code execution in sandboxed environments",
    hashtags: ["react", "ai", "collaboration", "editor", "typescript"],
    codeSnippet: {
      id: "cs1",
      language: "typescript",
      title: "Real-time collaboration hook",
      code: `const useCollaboration = (roomId: string) => {
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    const socket = io('/collaboration');
    socket.emit('join-room', roomId);
    
    socket.on('cursor-update', setCursors);
    socket.on('user-joined', setUsers);
    
    return () => socket.disconnect();
  }, [roomId]);
  
  return { cursors, users };
};`
    },
    project: {
      name: "CodeCollab",
      description: "Real-time collaborative code editor with AI assistance",
      tech: ["TypeScript", "React", "Socket.io", "OpenAI", "Monaco Editor"],
      stars: 1247,
      forks: 89,
      issues: 12,
      link: "https://github.com/sarahbuilds/codecollab",
      status: "active" as const,
      difficulty: "Advanced" as const,
      license: "MIT",
      lastUpdate: "2 days ago"
    },
    likes: 342,
    comments: 87,
    shares: 23,
    views: 2847,
    isLiked: true,
    isBookmarked: false
  }
};

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState(mockPostData[postId as keyof typeof mockPostData]);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(true);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Post Not Found</h1>
          <p className="text-muted-foreground">The post you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Feed
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleBookmark = () => {
    setPost(prev => ({
      ...prev,
      isBookmarked: !prev.isBookmarked
    }));
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Junior': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Mid': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Senior': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Lead': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Architect': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Feed
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-foreground">codecave</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Post Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <Avatar className="h-12 w-12 border-2 border-primary/30">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary font-mono">
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-lg">{post.author.name}</span>
                      {post.author.verified && (
                        <Badge variant="secondary" className="h-5 px-2 text-xs">✓</Badge>
                      )}
                      <Badge variant="outline" className={`text-xs px-2 h-5 ${getRankColor(post.author.rank)}`}>
                        {post.author.rank}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span className="font-mono">@{post.author.username}</span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span className="font-mono">{post.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-6">
                  <div className="prose prose-sm max-w-none">
                    {post.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-sm leading-relaxed mb-3 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  {/* Hashtags */}
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.hashtags.map((tag) => (
                        <span key={tag} className="text-primary hover:text-accent cursor-pointer text-sm font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Code Snippet */}
                {post.codeSnippet && (
                  <Card className="mb-6 border-l-4 border-l-primary bg-[#1e1e1e]/90">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="font-mono text-xs border-[#3e3e42] text-[#cccccc]">
                            {post.codeSnippet.language}
                          </Badge>
                          {post.codeSnippet.title && (
                            <span className="text-sm font-medium text-[#cccccc]">{post.codeSnippet.title}</span>
                          )}
                        </div>
                      </div>
                      <VSCodeHighlighter 
                        code={post.codeSnippet.code} 
                        language={post.codeSnippet.language} 
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Project Details */}
                {post.project && (
                  <Card className="mb-6 border-l-4 border-l-accent">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            <h3 className="font-semibold text-lg">{post.project.name}</h3>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">{post.project.description}</p>
                          
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {post.project.tech.map((tech) => (
                                <Badge key={tech} variant="secondary" className="text-xs font-mono">{tech}</Badge>
                              ))}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span className="font-mono">{post.project.stars} stars</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <GitBranch className="h-4 w-4 text-blue-400" />
                                <span className="font-mono">{post.project.forks} forks</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Bug className="h-4 w-4 text-red-400" />
                                <span className="font-mono">{post.project.issues} issues</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-green-400" />
                                <span className="text-muted-foreground">{post.project.lastUpdate}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Post Actions */}
                <div className="pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-6">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`h-10 px-4 ${post.isLiked ? 'text-red-400' : 'text-muted-foreground'}`}
                        onClick={handleLike}
                      >
                        <Heart className={`h-5 w-5 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span className="font-mono">{post.likes}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-10 px-4 text-primary"
                        onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
                      >
                        <Users className="h-5 w-5 mr-2" />
                        <span className="font-mono">{post.comments} comments</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-10 px-4 text-muted-foreground hover:text-primary">
                        <Share2 className="h-5 w-5 mr-2" />
                        <span className="font-mono">{post.shares} shares</span>
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-10 px-4 ${post.isBookmarked ? 'text-accent' : 'text-muted-foreground'}`}
                      onClick={handleBookmark}
                    >
                      <Bookmark className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>

                  {/* Comments Section */}
                  <CommentSection
                    postId={post.id}
                    isExpanded={isCommentsExpanded}
                    onToggle={() => setIsCommentsExpanded(!isCommentsExpanded)}
                    commentCount={post.comments}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Author Sidebar */}
          <div className="space-y-4">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/30">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary font-mono">
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{post.author.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono">@{post.author.username}</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{post.author.bio}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Joined {post.author.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span><strong>{post.author.followers}</strong> followers</span>
                    <span><strong>{post.author.following}</strong> following</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {post.author.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">{specialty}</Badge>
                  ))}
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Follow
                </Button>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-sm">More from {post.author.name}</h3>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  <div className="p-2 bg-muted/30 rounded border border-border/30 hover:bg-muted/50 cursor-pointer">
                    <h4 className="text-sm font-medium mb-1">Building a Rust-based JSON parser</h4>
                    <p className="text-xs text-muted-foreground">Performance optimization tips...</p>
                  </div>
                  <div className="p-2 bg-muted/30 rounded border border-border/30 hover:bg-muted/50 cursor-pointer">
                    <h4 className="text-sm font-medium mb-1">AI code review automation</h4>
                    <p className="text-xs text-muted-foreground">How we improved code quality...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
