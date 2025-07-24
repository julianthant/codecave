"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VSCodeHighlighter } from "@/components/VSCodeHighlighter";
import { CommentSection } from "@/components/CommentSection";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Users,
  TrendingUp,
  Search,
  Home,
  User,
  Settings,
  Bell,
  GitBranch,
  Star,
  ExternalLink,
  Coffee,
  Zap,
  Play,
  Copy,
  Eye,
  Clock,
  Award,
  Monitor,
  Bug,
  Lightbulb,
  Target,
  Rocket,
  Crown,
  Leaf,
} from "lucide-react";

interface CodeSnippet {
  id: string;
  language: string;
  code: string;
  title?: string;
}

interface LiveSession {
  id: string;
  title: string;
  participants: number;
  tech: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "pair-programming" | "code-review" | "debugging" | "learning";
}

interface Post {
  id: string;
  type: "project" | "question" | "collaboration" | "achievement" | "general";
  author: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
    rank: "Junior" | "Mid" | "Senior" | "Lead" | "Architect";
    specialties: string[];
  };
  timestamp: string;
  content: string;
  hashtags: string[];
  codeSnippet?: CodeSnippet;
  project?: {
    name: string;
    description: string;
    tech: string[];
    stars: number;
    forks: number;
    issues: number;
    link: string;
    status: "active" | "completed" | "seeking-contributors";
    difficulty: "Beginner" | "Intermediate" | "Advanced";
  };
  liveSession?: LiveSession;
  achievement?: {
    title: string;
    description: string;
    points: number;
  };
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

const mockPosts: Post[] = [
  {
    id: "1",
    type: "project",
    author: {
      name: "Sarah Chen",
      username: "sarahbuilds",
      avatar: "/api/placeholder/40/40",
      verified: true,
      rank: "Senior",
      specialties: ["React", "AI/ML", "TypeScript"],
    },
    timestamp: "2h",
    content:
      "Built a real-time collaborative code editor with AI-powered suggestions! 🚀 Features include live cursors, syntax highlighting for 50+ languages, and GPT-4 integration for smart completions.",
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
};`,
    },
    project: {
      name: "CodeCollab",
      description: "Real-time collaborative code editor with AI assistance",
      tech: ["TypeScript", "React", "Socket.io", "OpenAI", "Monaco Editor"],
      stars: 1247,
      forks: 89,
      issues: 12,
      link: "https://github.com/sarahbuilds/codecollab",
      status: "active",
      difficulty: "Advanced",
    },
    likes: 342,
    comments: 87,
    shares: 23,
    isLiked: true,
  },
  {
    id: "2",
    type: "collaboration",
    author: {
      name: "Alex Rodriguez",
      username: "alexcodes",
      avatar: "/api/placeholder/40/40",
      rank: "Mid",
      specialties: ["Python", "Backend", "DevOps"],
    },
    timestamp: "4h",
    content:
      "🤝 Seeking contributors for my microservices monitoring tool! Perfect for developers wanting to learn Kubernetes, Prometheus, and Go. Looking for 2-3 passionate developers.",
    hashtags: ["kubernetes", "monitoring", "collaboration", "go", "devops"],
    project: {
      name: "ServiceWatch",
      description: "Kubernetes-native microservices monitoring and alerting",
      tech: ["Go", "Kubernetes", "Prometheus", "Grafana", "Docker"],
      stars: 234,
      forks: 45,
      issues: 8,
      link: "https://github.com/alexcodes/servicewatch",
      status: "seeking-contributors",
      difficulty: "Intermediate",
    },
    liveSession: {
      id: "ls1",
      title: "ServiceWatch Architecture Discussion",
      participants: 5,
      tech: ["Go", "Kubernetes"],
      difficulty: "Intermediate",
      type: "code-review",
    },
    likes: 156,
    comments: 34,
    shares: 12,
  },
  {
    id: "3",
    type: "question",
    author: {
      name: "Emma Johnson",
      username: "emmacreates",
      avatar: "/api/placeholder/40/40",
      rank: "Junior",
      specialties: ["JavaScript", "Frontend", "UI/UX"],
    },
    timestamp: "6h",
    content:
      "🤔 How do you handle state management in large React apps? Working on a project with 200+ components and Redux feels overkill. Considering Zustand or Jotai.",
    hashtags: ["react", "statemanagement", "frontend", "help"],
    codeSnippet: {
      id: "cs2",
      language: "javascript",
      title: "Current state structure",
      code: `// Current approach - getting messy
const [user, setUser] = useState(null);
const [projects, setProjects] = useState([]);
const [notifications, setNotifications] = useState([]);
const [theme, setTheme] = useState('dark');
const [sidebar, setSidebar] = useState(false);

// Should I switch to a global store?`,
    },
    likes: 89,
    comments: 45,
    shares: 8,
  },
  {
    id: "4",
    type: "achievement",
    author: {
      name: "Marcus Kim",
      username: "markusk",
      avatar: "/api/placeholder/40/40",
      verified: true,
      rank: "Lead",
      specialties: ["Rust", "Systems", "Performance"],
    },
    timestamp: "8h",
    content:
      "🎉 Just hit 10,000 GitHub stars across all my projects! Started coding 6 years ago and never imagined I'd reach this milestone. Thank you to the amazing dev community!",
    hashtags: ["milestone", "github", "achievement", "thankyou"],
    achievement: {
      title: "10K Star Contributor",
      description: "Reached 10,000 total GitHub stars",
      points: 1000,
    },
    likes: 892,
    comments: 156,
    shares: 67,
    isBookmarked: true,
  },
];

const trendingTech = [
  { name: "Bun", growth: "+156%", category: "Runtime" },
  { name: "Astro", growth: "+89%", category: "Framework" },
  { name: "Tauri", growth: "+67%", category: "Desktop" },
  { name: "Drizzle", growth: "+145%", category: "ORM" },
];

const codeOfTheDay = {
  language: "rust",
  title: "Efficient String Interning",
  difficulty: "Advanced",
  challenge:
    "Implement a string interning system that avoids duplicate string allocations",
  instruction:
    "Study this pattern and try to implement a similar system in your preferred language",
  code: `use std::collections::HashMap;

struct StringInterner {
    map: HashMap<String, usize>,
    strings: Vec<String>,
}

impl StringInterner {
    fn intern(&mut self, s: &str) -> usize {
        if let Some(&id) = self.map.get(s) {
            id
        } else {
            let id = self.strings.len();
            self.strings.push(s.to_string());
            self.map.insert(s.to_string(), id);
            id
        }
    }
}`,
};

export default function Index() {
  const [posts, setPosts] = useState(mockPosts);
  const [activeView, setActiveView] = useState("feed");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleBookmark = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  };

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (expandedComments.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  const handlePostClick = (postId: string) => {
    // Navigate to individual post page
    window.location.href = `/post/${postId}`;
  };

  const handlePostCardClick = (e: React.MouseEvent, postId: string) => {
    // Only navigate if not clicking on interactive elements
    const target = e.target as HTMLElement;
    const isInteractiveElement =
      target.closest("button") ||
      target.closest("a") ||
      target.closest("input");

    if (!isInteractiveElement) {
      handlePostClick(postId);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Minimalistic Header */}
      <header className="top-0 z-50 sticky bg-background border-b border-border w-full">
        <div className="mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center h-12">
            {/* Left: Logo as Home Button */}
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex justify-center items-center bg-primary rounded w-6 h-6">
                <span className="font-bold text-primary-foreground text-sm">
                  C
                </span>
              </div>
              <span className="font-semibold text-foreground">codecave</span>
            </Link>

            {/* Center: Search */}
            <div className="flex-1 mx-8 max-w-md">
              <div className="relative">
                <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                <Input
                  placeholder="Search"
                  className="bg-muted/20 focus:bg-background py-1.5 pr-4 pl-10 border-0 rounded-md focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground text-sm transition-all"
                />
              </div>
            </div>

            {/* Right: Navigation Icons */}
            <nav className="flex items-center space-x-0.5">
              <Link href="/network">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center space-y-0.5 px-2 py-1.5 h-auto text-muted-foreground hover:text-primary transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span className="font-medium text-[10px] leading-none">
                    Network
                  </span>
                </Button>
              </Link>

              <Link href="/premium">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center space-y-0.5 px-2 py-1.5 h-auto text-muted-foreground hover:text-primary transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  <span className="font-medium text-[10px] leading-none">
                    Premium
                  </span>
                </Button>
              </Link>

              <Link href="/collaboration">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center space-y-0.5 px-2 py-1.5 h-auto text-muted-foreground hover:text-primary transition-colors"
                >
                  <Monitor className="w-4 h-4" />
                  <span className="font-medium text-[10px] leading-none">
                    Collaborate
                  </span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="relative flex flex-col items-center space-y-0.5 px-2 py-1.5 h-auto text-muted-foreground hover:text-primary transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="font-medium text-[10px] leading-none">
                  Notifications
                </span>
                <span className="top-0.5 right-1 absolute bg-accent rounded-full w-2 h-2"></span>
              </Button>

              <div className="group relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center space-y-0.5 px-2 py-1.5 h-auto text-muted-foreground hover:text-primary transition-colors"
                >
                  <Avatar className="w-4 h-4">
                    <AvatarImage src="/api/placeholder/16/16" />
                    <AvatarFallback className="bg-primary/20 text-[8px] text-primary">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-[10px] leading-none">
                    Me
                  </span>
                </Button>

                {/* Profile Dropdown */}
                <div className="invisible group-hover:visible top-full right-0 z-50 absolute bg-card opacity-0 group-hover:opacity-100 shadow-lg mt-2 border border-border rounded-md w-48 transition-all duration-200">
                  <div className="p-3 border-b border-border">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/api/placeholder/32/32" />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">John Developer</p>
                        <p className="text-muted-foreground text-xs">
                          @johndeveloper
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block hover:bg-muted px-3 py-2 text-sm transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Your Profile</span>
                      </div>
                    </Link>
                    <button className="hover:bg-muted px-3 py-2 w-full text-sm text-left transition-colors">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </div>
                    </button>
                    <div className="my-1 border-t border-border"></div>
                    <button className="hover:bg-muted px-3 py-2 w-full text-sm text-left transition-colors">
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 py-6 max-w-7xl">
        <div className="flex gap-6">
          {/* Left Sidebar - Navigation & Profile */}
          <aside className="flex-shrink-0 w-60">
            <div className="top-20 sticky space-y-4">
              {/* Developer Profile Card */}
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="border-2 border-primary/30 w-12 h-12">
                      <AvatarImage src="/api/placeholder/48/48" />
                      <AvatarFallback className="bg-primary/20 font-mono text-primary">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold truncate">John Developer</p>
                      </div>
                      <p className="font-mono text-muted-foreground text-sm truncate">
                        @johndeveloper
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="gap-3 grid grid-cols-3 mb-4 text-center">
                    <div className="space-y-1">
                      <p className="font-semibold text-primary">1.2k</p>
                      <p className="text-muted-foreground text-xs">Repos</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-accent">8.9k</p>
                      <p className="text-muted-foreground text-xs">Stars</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-info">234</p>
                      <p className="text-muted-foreground text-xs">Followers</p>
                    </div>
                  </div>

                  {/* Contribution Graph */}
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs">
                      Contribution Activity
                    </p>
                    <div className="gap-1 grid grid-cols-12">
                      {Array.from({ length: 84 }, (_, i) => {
                        // Create a deterministic pattern based on index
                        const value = (i * 17 + 7) % 100; // pseudo-random but deterministic
                        const bgClass =
                          value > 70
                            ? "bg-primary"
                            : value > 40
                              ? "bg-primary/50"
                              : "bg-muted";

                        return (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-sm ${bgClass}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation & View Selector */}
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-2">
                  <nav className="space-y-1">
                    <Button
                      variant={activeView === "feed" ? "default" : "ghost"}
                      className="justify-start w-full"
                      size="sm"
                      onClick={() => setActiveView("feed")}
                    >
                      <Home className="mr-3 w-4 h-4" />
                      Feed
                    </Button>
                    <Button
                      variant={activeView === "grass" ? "default" : "ghost"}
                      className="justify-start w-full"
                      size="sm"
                      onClick={() => setActiveView("grass")}
                    >
                      <Leaf className="mr-3 w-4 h-4" />
                      Touch Grass
                    </Button>

                    <Link href="/projects">
                      <Button
                        variant="ghost"
                        className="justify-start w-full"
                        size="sm"
                      >
                        <Rocket className="mr-3 w-4 h-4" />
                        Projects
                      </Button>
                    </Link>
                    <Link href="/qa">
                      <Button
                        variant="ghost"
                        className="justify-start w-full"
                        size="sm"
                      >
                        <Lightbulb className="mr-3 w-4 h-4" />
                        Q&A
                      </Button>
                    </Link>
                    <Link href="/saved-groups">
                      <Button
                        variant="ghost"
                        className="justify-start w-full"
                        size="sm"
                      >
                        <Bookmark className="mr-3 w-4 h-4" />
                        Saved
                      </Button>
                    </Link>
                  </nav>
                </CardContent>
              </Card>

              {/* Code Review Queue */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <h3 className="flex items-center font-semibold text-sm">
                    <Bug className="mr-2 w-4 h-4 text-orange-400" />
                    Review Requests
                  </h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-muted/30 p-2 border border-border/30 rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          Authentication Bug
                        </p>
                        <p className="text-muted-foreground text-xs">
                          React • @sarah_dev
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="border-red-500/30 text-red-400 text-xs"
                        >
                          High
                        </Badge>
                        <div className="flex items-center space-x-1 text-muted-foreground text-xs">
                          <Clock className="w-3 h-3" />
                          <span>2h</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-muted/30 p-2 border border-border/30 rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">API Optimization</p>
                        <p className="text-muted-foreground text-xs">
                          Node.js • @alex_backend
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="border-yellow-500/30 text-yellow-400 text-xs"
                        >
                          Med
                        </Badge>
                        <div className="flex items-center space-x-1 text-muted-foreground text-xs">
                          <Clock className="w-3 h-3" />
                          <span>4h</span>
                        </div>
                      </div>
                    </div>

                    <Link href="/review-requests">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        <Eye className="mr-2 w-3 h-3" />
                        View All (5)
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="flex-1 mx-6 max-w-xl">
            <div className="space-y-6">
              {activeView === "feed" && (
                <>
                  {/* Create Post */}
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="border-2 border-primary/30 w-9 h-9">
                          <AvatarImage src="/api/placeholder/36/36" />
                          <AvatarFallback className="bg-primary/20 font-mono text-primary text-sm">
                            JD
                          </AvatarFallback>
                        </Avatar>
                        <Input
                          placeholder="What are you building today?"
                          className="flex-1 bg-transparent shadow-none border-0 placeholder:text-muted-foreground/70"
                        />
                        <Button size="sm" className="px-6 accent-glow">
                          Post
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Posts */}
                  {posts.map((post) => (
                    <Card
                      key={post.id}
                      className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors cursor-pointer"
                      onClick={(e) => handlePostCardClick(e, post.id)}
                    >
                      <CardContent className="p-4">
                        {/* Post Header */}
                        <div className="flex items-start space-x-3 mb-4">
                          <Avatar className="border-2 border-primary/30 w-10 h-10">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback className="bg-primary/20 font-mono text-primary">
                              {post.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">
                                {post.author.name}
                              </span>
                              {post.author.verified && (
                                <Badge
                                  variant="secondary"
                                  className="px-1 h-4 text-xs"
                                >
                                  ✓
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                              <span className="font-mono">
                                @{post.author.username}
                              </span>
                              <span>•</span>
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                          <p className="text-sm leading-relaxed">
                            {post.content}
                          </p>
                          {/* Hashtags */}
                          {post.hashtags && post.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {post.hashtags.map((tag) => (
                                <span
                                  key={tag}
                                  className="font-mono text-primary hover:text-accent text-sm cursor-pointer"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Code Snippet with VS Code Theme */}
                        {post.codeSnippet && (
                          <Card className="bg-[#1e1e1e]/90 mb-4 border-l-4 border-l-primary">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant="outline"
                                    className="border-[#3e3e42] font-mono text-[#cccccc] text-xs"
                                  >
                                    {post.codeSnippet.language}
                                  </Badge>
                                  {post.codeSnippet.title && (
                                    <span className="font-medium text-[#cccccc] text-sm">
                                      {post.codeSnippet.title}
                                    </span>
                                  )}
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="px-2 h-6 text-[#cccccc] hover:text-white"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="px-2 h-6 text-[#cccccc] hover:text-white"
                                  >
                                    <Play className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <VSCodeHighlighter
                                code={post.codeSnippet.code}
                                language={post.codeSnippet.language}
                              />
                            </CardContent>
                          </Card>
                        )}

                        {/* Project Card */}
                        {post.project && (
                          <Card className="mb-4 border-l-4 border-l-accent">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="font-semibold">
                                      {post.project.name}
                                    </h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="px-2 h-6"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <p className="mb-3 text-muted-foreground text-sm">
                                    {post.project.description}
                                  </p>
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {post.project.tech.map((tech) => (
                                      <Badge
                                        key={tech}
                                        variant="secondary"
                                        className="font-mono text-xs"
                                      >
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                                    <div className="flex items-center space-x-1">
                                      <Star className="w-3 h-3" />
                                      <span className="font-mono">
                                        {post.project.stars}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <GitBranch className="w-3 h-3" />
                                      <span className="font-mono">
                                        {post.project.forks}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Bug className="w-3 h-3" />
                                      <span className="font-mono">
                                        {post.project.issues}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Achievement */}
                        {post.achievement && (
                          <Card className="bg-yellow-500/5 mb-4 border-l-4 border-l-yellow-500">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Award className="w-4 h-4 text-yellow-400" />
                                <span className="font-medium text-yellow-400 text-sm">
                                  ACHIEVEMENT UNLOCKED
                                </span>
                              </div>
                              <h4 className="mb-1 font-semibold">
                                {post.achievement.title}
                              </h4>
                              <p className="mb-2 text-muted-foreground text-sm">
                                {post.achievement.description}
                              </p>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant="outline"
                                  className="border-yellow-500 text-yellow-400"
                                >
                                  +{post.achievement.points} XP
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Post Actions */}
                        <div className="space-y-4 pt-3 border-t border-border/50">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-6">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-8 px-2 ${post.isLiked ? "text-red-400" : "text-muted-foreground"}`}
                                onClick={() => handleLike(post.id)}
                              >
                                <Heart
                                  className={`h-4 w-4 mr-2 ${post.isLiked ? "fill-current" : ""}`}
                                />
                                <span className="font-mono">{post.likes}</span>
                              </Button>
                              <CommentSection
                                postId={post.id}
                                isExpanded={expandedComments.has(post.id)}
                                onToggle={() => toggleComments(post.id)}
                                commentCount={post.comments}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="px-2 h-8 text-muted-foreground hover:text-primary"
                              >
                                <Share2 className="mr-2 w-4 h-4" />
                                <span className="font-mono">{post.shares}</span>
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-8 px-2 ${post.isBookmarked ? "text-accent" : "text-muted-foreground"}`}
                              onClick={() => handleBookmark(post.id)}
                            >
                              <Bookmark
                                className={`h-4 w-4 ${post.isBookmarked ? "fill-current" : ""}`}
                              />
                            </Button>
                          </div>

                          {/* Expanded Comments Section */}
                          {expandedComments.has(post.id) && (
                            <div className="mt-4">
                              <CommentSection
                                postId={post.id}
                                isExpanded={true}
                                onToggle={() => toggleComments(post.id)}
                                commentCount={post.comments}
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}

              {activeView === "grass" && (
                <div className="space-y-4">
                  <Card className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3 mb-4">
                        <Avatar className="border-2 border-green-500/30 w-10 h-10">
                          <AvatarImage src="/api/placeholder/40/40" />
                          <AvatarFallback className="bg-green-500/20 font-mono text-green-400">
                            MK
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">Marcus Kim</span>
                            <Badge
                              variant="outline"
                              className="border-green-500/30 text-green-400"
                            >
                              grass
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                            <span className="font-mono">@markusk</span>
                            <span>•</span>
                            <span>3h</span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm leading-relaxed">
                          Finally took a break from coding today! Went hiking
                          with my dog and realized I haven `apos;` t seen the
                          sunset in weeks 🌅 Sometimes we get so caught up in
                          solving problems that we forget to step outside and
                          breathe. How do you all balance screen time with real
                          life?
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="font-mono text-primary hover:text-accent text-sm cursor-pointer">
                            #worklifebalance
                          </span>
                          <span className="font-mono text-primary hover:text-accent text-sm cursor-pointer">
                            #hiking
                          </span>
                          <span className="font-mono text-primary hover:text-accent text-sm cursor-pointer">
                            #mentalhealth
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-border/50">
                        <div className="flex items-center space-x-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 h-8 text-muted-foreground"
                          >
                            <Heart className="mr-2 w-4 h-4" />
                            <span className="font-mono">42</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 h-8 text-muted-foreground"
                          >
                            <MessageCircle className="mr-2 w-4 h-4" />
                            <span className="font-mono">8</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 h-8 text-muted-foreground"
                          >
                            <Share2 className="mr-2 w-4 h-4" />
                            <span className="font-mono">3</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="flex-shrink-0 w-72">
            <div className="top-20 sticky space-y-4">
              {/* Trending Tech */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <h3 className="flex items-center font-semibold text-sm">
                    <TrendingUp className="mr-2 w-4 h-4 text-primary" />
                    Trending Tech
                  </h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    {trendingTech.map((tech) => (
                      <div
                        key={tech.name}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-mono font-medium text-sm">
                            {tech.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {tech.category}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-green-500/30 text-green-400 text-xs"
                        >
                          {tech.growth}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <h3 className="flex items-center font-semibold text-sm">
                    <Zap className="mr-2 w-4 h-4 text-accent" />
                    Quick Actions
                  </h3>
                </CardHeader>
                <CardContent className="space-y-2 p-4 pt-0">
                  <Link href="/find-collaborators">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start w-full text-xs"
                    >
                      <Users className="mr-2 w-3 h-3" />
                      Find Collaborators
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start w-full text-xs"
                  >
                    <Monitor className="mr-2 w-3 h-3" />
                    Start Live Session
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start w-full text-xs"
                  >
                    <Lightbulb className="mr-2 w-3 h-3" />
                    Ask Question
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start w-full text-xs"
                  >
                    <Target className="mr-2 w-3 h-3" />
                    Code Challenge
                  </Button>
                </CardContent>
              </Card>

              {/* Daily Challenge */}
              <Card className="bg-card/50 border-border/50 border-l-4 border-l-accent">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <h3 className="flex items-center font-semibold text-sm">
                      <Coffee className="mr-2 w-4 h-4 text-accent" />
                      Daily Challenge
                    </h3>
                    <Badge
                      variant="outline"
                      className="border-accent/30 text-accent text-xs"
                    >
                      {codeOfTheDay.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <div>
                      <h4 className="mb-2 font-medium text-sm">
                        {codeOfTheDay.title}
                      </h4>
                      <p className="mb-3 text-muted-foreground text-sm leading-relaxed">
                        {codeOfTheDay.challenge}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        💡 {codeOfTheDay.instruction}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                      >
                        <Play className="mr-1 w-3 h-3" />
                        Start Challenge
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                      >
                        <Lightbulb className="mr-1 w-3 h-3" />
                        Hint
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
