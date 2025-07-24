"use client";
import { useState } from "react";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Terminal,
  Bell,
  Plus,
  Users,
  Search,
  TrendingUp,
  Crown,
  MessageSquare,
  Globe,
  Lock,
  Settings,
  Star,
} from "lucide-react";

const myGroups = [
  {
    id: "1",
    name: "React Developers",
    description:
      "A community for React developers to share knowledge, projects, and help each other grow",
    members: 12543,
    avatar: "/api/placeholder/40/40",
    role: "member",
    isPrivate: false,
    lastActivity: "2 hours ago",
    tags: ["react", "javascript", "frontend"],
  },
  {
    id: "2",
    name: "Rust Programming",
    description: "Systems programming with Rust - from beginners to experts",
    members: 8234,
    avatar: "/api/placeholder/40/40",
    role: "admin",
    isPrivate: false,
    lastActivity: "5 hours ago",
    tags: ["rust", "systems", "performance"],
  },
  {
    id: "3",
    name: "AI/ML Engineers",
    description:
      "Machine learning practitioners sharing insights, models, and research",
    members: 15672,
    avatar: "/api/placeholder/40/40",
    role: "moderator",
    isPrivate: true,
    lastActivity: "1 day ago",
    tags: ["ai", "ml", "python", "tensorflow"],
  },
];

const suggestedGroups = [
  {
    id: "4",
    name: "TypeScript Wizards",
    description:
      "Advanced TypeScript patterns, best practices, and type-level programming",
    members: 9876,
    avatar: "/api/placeholder/40/40",
    isPrivate: false,
    tags: ["typescript", "advanced", "patterns"],
  },
  {
    id: "5",
    name: "DevOps & Cloud",
    description:
      "Infrastructure, deployment, monitoring, and cloud architecture discussions",
    members: 11234,
    avatar: "/api/placeholder/40/40",
    isPrivate: false,
    tags: ["devops", "aws", "kubernetes", "docker"],
  },
  {
    id: "6",
    name: "Indie Hackers",
    description: "Solo developers building and launching their own products",
    members: 6543,
    avatar: "/api/placeholder/40/40",
    isPrivate: false,
    tags: ["startup", "indie", "saas", "business"],
  },
];

const popularGroups = [
  {
    id: "7",
    name: "Open Source Contributors",
    description:
      "Contributing to open source projects, finding maintainers, and building communities",
    members: 23456,
    avatar: "/api/placeholder/40/40",
    isPrivate: false,
    growth: "+234 this week",
    tags: ["opensource", "contributing", "community"],
  },
  {
    id: "8",
    name: "Freelance Developers",
    description:
      "Tips, contracts, client management, and growing your freelance business",
    members: 18923,
    avatar: "/api/placeholder/40/40",
    isPrivate: false,
    growth: "+189 this week",
    tags: ["freelance", "business", "clients"],
  },
];

export default function Groups() {
  const [activeTab, setActiveTab] = useState("my-groups");
  const [searchTerm, setSearchTerm] = useState("");

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
                Create Group
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
          <h1 className="mb-2 font-bold text-3xl">Developer Groups</h1>
          <p className="text-muted-foreground">
            Connect with like-minded developers, share knowledge, and build
            together
          </p>
        </div>

        {/* Search */}
        <Card className="bg-card/50 mb-6 border-border/50">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
              <Input
                placeholder="Search groups by name, technology, or interest..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent pl-10 border-border/50"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 bg-muted/50 mb-6 w-full">
            <TabsTrigger value="my-groups" className="font-mono">
              my groups
            </TabsTrigger>
            <TabsTrigger value="discover" className="font-mono">
              discover
            </TabsTrigger>
            <TabsTrigger value="popular" className="font-mono">
              popular
            </TabsTrigger>
            <TabsTrigger value="create" className="font-mono">
              create
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-groups" className="space-y-4">
            {myGroups.map((group) => (
              <Card
                key={group.id}
                className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="border-2 border-primary/30 w-12 h-12">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback className="bg-primary/20 font-mono text-primary">
                        {group.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{group.name}</h3>
                        {group.isPrivate ? (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Globe className="w-4 h-4 text-muted-foreground" />
                        )}
                        {group.role === "admin" && (
                          <Badge
                            variant="outline"
                            className="border-yellow-500 text-yellow-400"
                          >
                            <Crown className="mr-1 w-3 h-3" />
                            Admin
                          </Badge>
                        )}
                        {group.role === "moderator" && (
                          <Badge
                            variant="outline"
                            className="border-blue-500 text-blue-400"
                          >
                            <Star className="mr-1 w-3 h-3" />
                            Mod
                          </Badge>
                        )}
                      </div>

                      <p className="mb-3 text-muted-foreground text-sm">
                        {group.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {group.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="font-mono text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>
                              {group.members.toLocaleString()} members
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>Active {group.lastActivity}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          {group.role === "admin" && (
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="discover" className="space-y-4">
            <div className="mb-4">
              <h2 className="mb-2 font-semibold text-xl">Suggested for You</h2>
              <p className="text-muted-foreground text-sm">
                Based on your interests and tech stack
              </p>
            </div>

            {suggestedGroups.map((group) => (
              <Card
                key={group.id}
                className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="border-2 border-primary/30 w-12 h-12">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback className="bg-primary/20 font-mono text-primary">
                        {group.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{group.name}</h3>
                        {group.isPrivate ? (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Globe className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>

                      <p className="mb-3 text-muted-foreground text-sm">
                        {group.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {group.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="font-mono text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                          <Users className="w-4 h-4" />
                          <span>{group.members.toLocaleString()} members</span>
                        </div>

                        <Button size="sm" className="accent-glow">
                          Join Group
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            <div className="mb-4">
              <h2 className="mb-2 font-semibold text-xl">Trending Groups</h2>
              <p className="text-muted-foreground text-sm">
                Most active and fastest growing communities
              </p>
            </div>

            {popularGroups.map((group) => (
              <Card
                key={group.id}
                className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="border-2 border-primary/30 w-12 h-12">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback className="bg-primary/20 font-mono text-primary">
                        {group.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{group.name}</h3>
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-400"
                        >
                          <TrendingUp className="mr-1 w-3 h-3" />
                          Trending
                        </Badge>
                      </div>

                      <p className="mb-3 text-muted-foreground text-sm">
                        {group.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {group.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="font-mono text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>
                              {group.members.toLocaleString()} members
                            </span>
                          </div>
                          <div className="font-mono text-green-400 text-xs">
                            {group.growth}
                          </div>
                        </div>

                        <Button size="sm" className="accent-glow">
                          Join Group
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <h2 className="font-semibold text-xl">Create a New Group</h2>
                <p className="text-muted-foreground text-sm">
                  Start a community around your interests, technology, or
                  project
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium text-sm">
                    Group Name
                  </label>
                  <Input placeholder="e.g., Next.js Developers" />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-sm">
                    Description
                  </label>
                  <Input placeholder="Brief description of your group's purpose..." />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-sm">Tags</label>
                  <Input placeholder="e.g., nextjs, react, frontend (comma separated)" />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="font-medium text-sm">Privacy</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="privacy"
                      value="public"
                      defaultChecked
                    />
                    <label className="text-sm">Public</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="privacy" value="private" />
                    <label className="text-sm">Private</label>
                  </div>
                </div>

                <Button className="w-full neon-glow">
                  <Plus className="mr-2 w-4 h-4" />
                  Create Group
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
