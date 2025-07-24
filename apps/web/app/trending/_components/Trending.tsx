"use client";
import { useState } from "react";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Terminal,
  Bell,
  Plus,
  TrendingUp,
  Clock,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Flame,
  Zap,
  Rocket,
  Eye,
  Calendar,
} from "lucide-react";

const trendingNews = [
  {
    id: "1",
    title: "React 19 Beta Released: New Features and Breaking Changes",
    summary:
      "React team announces React 19 beta with significant improvements to concurrent features, new hooks, and server components enhancements.",
    source: "React Blog",
    author: "React Team",
    timestamp: "2 hours ago",
    category: "Framework",
    tags: ["react", "javascript", "frontend"],
    likes: 1247,
    comments: 89,
    shares: 156,
    views: 12543,
    url: "https://react.dev/blog/react-19-beta",
    trending: true,
    breaking: true,
  },
  {
    id: "2",
    title: "GitHub Copilot Chat Now Available in VS Code",
    summary:
      "AI-powered coding assistant adds conversational interface directly in your IDE, making it easier to get coding help and explanations.",
    source: "GitHub Blog",
    author: "GitHub Team",
    timestamp: "4 hours ago",
    category: "AI/Tools",
    tags: ["github", "ai", "vscode", "productivity"],
    likes: 892,
    comments: 67,
    shares: 134,
    views: 8932,
    url: "https://github.blog/copilot-chat-vscode",
    trending: true,
  },
  {
    id: "3",
    title: "Vercel Announces Edge Runtime Performance Improvements",
    summary:
      "New optimizations reduce cold start times by 40% and improve overall Edge Function performance across all regions.",
    source: "Vercel Blog",
    author: "Vercel Team",
    timestamp: "6 hours ago",
    category: "Infrastructure",
    tags: ["vercel", "edge", "performance", "serverless"],
    likes: 456,
    comments: 23,
    shares: 78,
    views: 4567,
    url: "https://vercel.com/blog/edge-runtime-improvements",
  },
  {
    id: "4",
    title: "TypeScript 5.3 Introduces Import Attributes",
    summary:
      "Latest TypeScript release adds support for import attributes, improved type narrowing, and better integration with modern JavaScript features.",
    source: "TypeScript Blog",
    author: "TypeScript Team",
    timestamp: "8 hours ago",
    category: "Language",
    tags: ["typescript", "javascript", "tooling"],
    likes: 723,
    comments: 45,
    shares: 91,
    views: 6789,
    url: "https://devblogs.microsoft.com/typescript/announcing-typescript-5-3/",
  },
  {
    id: "5",
    title: "Bun 1.0.15 Adds Node.js Compatibility Improvements",
    summary:
      "JavaScript runtime continues to improve compatibility with Node.js ecosystem while maintaining superior performance benchmarks.",
    source: "Bun Blog",
    author: "Jarred Sumner",
    timestamp: "12 hours ago",
    category: "Runtime",
    tags: ["bun", "nodejs", "javascript", "performance"],
    likes: 634,
    comments: 78,
    shares: 112,
    views: 5432,
    url: "https://bun.sh/blog/bun-v1.0.15",
  },
];

const techEvents = [
  {
    id: "1",
    name: "Next.js Conf 2024",
    date: "Oct 25, 2024",
    type: "Conference",
    description:
      "The official conference for Next.js featuring the latest updates, best practices, and community talks.",
    attendees: "5k+",
    status: "upcoming",
  },
  {
    id: "2",
    name: "React Summit US",
    date: "Nov 19-21, 2024",
    type: "Conference",
    description:
      "The biggest React conference in the US with 3 days of talks, workshops, and networking.",
    attendees: "3k+",
    status: "upcoming",
  },
  {
    id: "3",
    name: "DockerCon 2024",
    date: "Dec 5-7, 2024",
    type: "Conference",
    description:
      "Learn about the latest in containerization, DevOps, and cloud-native development.",
    attendees: "8k+",
    status: "upcoming",
  },
];

const weeklyStats = [
  { name: "JavaScript", growth: "+12%", category: "Language" },
  { name: "Python", growth: "+8%", category: "Language" },
  { name: "TypeScript", growth: "+15%", category: "Language" },
  { name: "React", growth: "+10%", category: "Framework" },
  { name: "Next.js", growth: "+18%", category: "Framework" },
  { name: "Docker", growth: "+7%", category: "DevOps" },
  { name: "Kubernetes", growth: "+9%", category: "DevOps" },
  { name: "VS Code", growth: "+5%", category: "Tool" },
];

export default function Trending() {
  const [activeTab, setActiveTab] = useState("news");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(
    new Set()
  );

  const handleLike = (postId: string) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

  const handleBookmark = (postId: string) => {
    const newBookmarked = new Set(bookmarkedPosts);
    if (newBookmarked.has(postId)) {
      newBookmarked.delete(postId);
    } else {
      newBookmarked.add(postId);
    }
    setBookmarkedPosts(newBookmarked);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="top-0 z-50 sticky bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b border-border/50 w-full">
        <div className="flex items-center px-4 h-16 container">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2 font-mono">
              <Terminal className="w-6 h-6 text-primary neon-glow" />
              <span className="font-bold text-xl tracking-tight">
                <span className="text-primary">vibe</span>
                <span className="text-accent">coding</span>
                <span className="text-muted-foreground animate-pulse">_</span>
              </span>
            </div>
          </div>

          <div className="flex flex-1 justify-end">
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="-top-1 -right-1 absolute bg-accent rounded-full w-2 h-2"></span>
              </Button>
              <Button size="sm" className="neon-glow">
                <Plus className="mr-2 w-4 h-4" />
                Share News
              </Button>
              <Avatar className="border-2 border-primary/30 w-9 h-9">
                <AvatarImage src="/api/placeholder/36/36" />
                <AvatarFallback className="bg-primary/20 font-mono text-primary">
                  JD
                </AvatarFallback>
              </Avatar>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 py-6 container">
        <div className="mb-6">
          <h1 className="flex items-center mb-2 font-bold text-3xl">
            <TrendingUp className="mr-3 w-8 h-8 text-primary" />
            Tech Trending
          </h1>
          <p className="text-muted-foreground">
            Stay updated with the latest in technology, frameworks, and
            developer tools
          </p>
        </div>

        <div className="gap-6 grid grid-cols-1 lg:grid-cols-12">
          {/* Main Content */}
          <main className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 bg-muted/50 mb-6 w-full">
                <TabsTrigger value="news" className="font-mono">
                  news
                </TabsTrigger>
                <TabsTrigger value="events" className="font-mono">
                  events
                </TabsTrigger>
                <TabsTrigger value="discussions" className="font-mono">
                  discussions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="news" className="space-y-4">
                {trendingNews.map((news) => (
                  <Card
                    key={news.id}
                    className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {news.trending && (
                              <Badge
                                variant="outline"
                                className="border-red-500 text-red-400"
                              >
                                <Flame className="mr-1 w-3 h-3" />
                                Trending
                              </Badge>
                            )}
                            {news.breaking && (
                              <Badge
                                variant="outline"
                                className="border-yellow-500 text-yellow-400"
                              >
                                <Zap className="mr-1 w-3 h-3" />
                                Breaking
                              </Badge>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {news.category}
                            </Badge>
                          </div>

                          <h3 className="mb-2 font-semibold hover:text-primary text-lg cursor-pointer">
                            {news.title}
                          </h3>

                          <p className="mb-3 text-muted-foreground text-sm leading-relaxed">
                            {news.summary}
                          </p>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {news.tags.map((tag) => (
                              <span
                                key={tag}
                                className="font-mono text-primary hover:text-accent text-sm cursor-pointer"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{news.timestamp}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span>by {news.author}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{news.views.toLocaleString()}</span>
                              </div>
                            </div>

                            <Button variant="ghost" size="sm">
                              <ExternalLink className="mr-2 w-4 h-4" />
                              Read More
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Post Actions */}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-center space-x-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-2 ${likedPosts.has(news.id) ? "text-red-400" : "text-muted-foreground"}`}
                            onClick={() => handleLike(news.id)}
                          >
                            <Heart
                              className={`h-4 w-4 mr-2 ${likedPosts.has(news.id) ? "fill-current" : ""}`}
                            />
                            <span className="font-mono">
                              {news.likes + (likedPosts.has(news.id) ? 1 : 0)}
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 h-8 text-muted-foreground"
                          >
                            <MessageCircle className="mr-2 w-4 h-4" />
                            <span className="font-mono">{news.comments}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 h-8 text-muted-foreground"
                          >
                            <Share2 className="mr-2 w-4 h-4" />
                            <span className="font-mono">{news.shares}</span>
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 px-2 ${bookmarkedPosts.has(news.id) ? "text-accent" : "text-muted-foreground"}`}
                          onClick={() => handleBookmark(news.id)}
                        >
                          <Bookmark
                            className={`h-4 w-4 ${bookmarkedPosts.has(news.id) ? "fill-current" : ""}`}
                          />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                {techEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="flex justify-center items-center bg-primary/20 rounded-lg w-12 h-12">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {event.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="border-blue-500 text-blue-400"
                            >
                              {event.type}
                            </Badge>
                          </div>

                          <p className="mb-3 text-muted-foreground text-sm">
                            {event.description}
                          </p>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span>{event.attendees} attendees</span>
                              </div>
                            </div>

                            <Button size="sm" variant="outline">
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="discussions" className="space-y-4">
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
                    <h3 className="mb-2 font-semibold">
                      Community Discussions
                    </h3>
                    <p className="mb-4 text-muted-foreground text-sm">
                      Join conversations about the latest tech trends and
                      developments
                    </p>
                    <Button>Start a Discussion</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4">
            <div className="top-24 sticky space-y-4">
              {/* Weekly Tech Stats */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <h3 className="flex items-center font-semibold text-sm">
                    <TrendingUp className="mr-2 w-4 h-4 text-primary" />
                    Weekly Growth
                  </h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    {weeklyStats.map((stat) => (
                      <div
                        key={stat.name}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-mono font-medium text-sm">
                            {stat.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {stat.category}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-green-500/30 text-green-400 text-xs"
                        >
                          {stat.growth}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Hot Topics */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <h3 className="flex items-center font-semibold text-sm">
                    <Flame className="mr-2 w-4 h-4 text-red-400" />
                    Hot Topics
                  </h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-mono text-primary hover:text-accent cursor-pointer">
                        #react19
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        1.2k posts
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-mono text-primary hover:text-accent cursor-pointer">
                        #githubcopilot
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        890 posts
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-mono text-primary hover:text-accent cursor-pointer">
                        #typescript53
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        567 posts
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-mono text-primary hover:text-accent cursor-pointer">
                        #bunjs
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        434 posts
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-mono text-primary hover:text-accent cursor-pointer">
                        #verceledge
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        298 posts
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit News */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <h3 className="flex items-center font-semibold text-sm">
                    <Plus className="mr-2 w-4 h-4 text-accent" />
                    Share Tech News
                  </h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="mb-3 text-muted-foreground text-sm">
                    Found something interesting? Share it with the community!
                  </p>
                  <Button className="w-full accent-glow" size="sm">
                    <Rocket className="mr-2 w-4 h-4" />
                    Submit News
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
