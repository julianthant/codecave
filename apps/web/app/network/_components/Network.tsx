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
  UserPlus,
  UserMinus,
  Crown,
  Star,
  Globe,
  Lock,
  TrendingUp,
} from "lucide-react";

const following = [
  {
    id: "1",
    name: "Sarah Chen",
    username: "sarahbuilds",
    avatar: "/api/placeholder/40/40",
    verified: true,
    bio: "Senior Frontend Developer at TechCorp. React, TypeScript, and AI enthusiast.",
    followers: "12.5k",
    mutualConnections: 23,
    isFollowing: true,
    location: "San Francisco, CA",
  },
  {
    id: "2",
    name: "Alex Rodriguez",
    username: "alexcodes",
    avatar: "/api/placeholder/40/40",
    bio: "Full-stack developer building developer tools. Open source contributor.",
    followers: "8.3k",
    mutualConnections: 15,
    isFollowing: true,
    location: "Remote",
  },
  {
    id: "3",
    name: "Emma Johnson",
    username: "emmacreates",
    avatar: "/api/placeholder/40/40",
    bio: "UI/UX Designer turned Frontend Developer. Love creating beautiful interfaces.",
    followers: "5.7k",
    mutualConnections: 8,
    isFollowing: true,
    location: "New York, NY",
  },
];

const myGroups = [
  {
    id: "1",
    name: "React Developers",
    description:
      "A community for React developers to share knowledge and projects",
    members: "12.5k",
    avatar: "/api/placeholder/40/40",
    role: "member",
    isPrivate: false,
    lastActivity: "2 hours ago",
    newPosts: 5,
  },
  {
    id: "2",
    name: "TypeScript Masters",
    description: "Advanced TypeScript patterns and best practices",
    members: "8.9k",
    avatar: "/api/placeholder/40/40",
    role: "admin",
    isPrivate: false,
    lastActivity: "1 hour ago",
    newPosts: 12,
  },
  {
    id: "3",
    name: "AI/ML Engineers",
    description: "Machine learning practitioners and researchers",
    members: "15.2k",
    avatar: "/api/placeholder/40/40",
    role: "moderator",
    isPrivate: true,
    lastActivity: "3 hours ago",
    newPosts: 8,
  },
];

const suggestions = [
  {
    id: "1",
    type: "user",
    name: "Marcus Kim",
    username: "markusk",
    avatar: "/api/placeholder/40/40",
    bio: "Lead Engineer at StartupXYZ. Rust and systems programming.",
    mutualConnections: 12,
    reason: "Works at companies you've shown interest in",
  },
  {
    id: "2",
    type: "group",
    name: "Rust Programming",
    description: "Systems programming with Rust",
    members: "6.8k",
    avatar: "/api/placeholder/40/40",
    reason: "Based on your interests in systems programming",
  },
];

export default function Network() {
  const [activeTab, setActiveTab] = useState("following");
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
                New Post
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
            <Users className="mr-3 w-8 h-8 text-primary" />
            My Network
          </h1>
          <p className="text-muted-foreground">
            Manage your connections and discover new communities
          </p>
        </div>

        {/* Search */}
        <Card className="bg-card/50 mb-6 border-border/50">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
              <Input
                placeholder="Search your network..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent pl-10 border-border/50"
              />
            </div>
          </CardContent>
        </Card>

        <div className="gap-6 grid grid-cols-1 lg:grid-cols-12">
          {/* Main Content */}
          <main className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 bg-muted/50 mb-6 w-full">
                <TabsTrigger value="following" className="font-mono">
                  following
                </TabsTrigger>
                <TabsTrigger value="groups" className="font-mono">
                  groups
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="font-mono">
                  suggestions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="following" className="space-y-4">
                {following.map((person) => (
                  <Card
                    key={person.id}
                    className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="border-2 border-primary/30 w-12 h-12">
                          <AvatarImage src={person.avatar} />
                          <AvatarFallback className="bg-primary/20 font-mono text-primary">
                            {person.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{person.name}</h3>
                            {person.verified && (
                              <Badge
                                variant="secondary"
                                className="px-1 h-4 text-xs"
                              >
                                ✓
                              </Badge>
                            )}
                          </div>
                          <p className="mb-2 font-mono text-muted-foreground text-sm">
                            @{person.username}
                          </p>
                          <p className="mb-3 text-muted-foreground text-sm leading-relaxed">
                            {person.bio}
                          </p>

                          <div className="flex items-center space-x-4 mb-3 text-muted-foreground text-sm">
                            <span>{person.followers} followers</span>
                            <span>•</span>
                            <span>
                              {person.mutualConnections} mutual connections
                            </span>
                            <span>•</span>
                            <span>{person.location}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Message
                          </Button>
                          <Button
                            variant={person.isFollowing ? "outline" : "default"}
                            size="sm"
                          >
                            {person.isFollowing ? (
                              <>
                                <UserMinus className="mr-2 w-4 h-4" />
                                Unfollow
                              </>
                            ) : (
                              <>
                                <UserPlus className="mr-2 w-4 h-4" />
                                Follow
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="groups" className="space-y-4">
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

                          <div className="flex items-center space-x-4 mb-3 text-muted-foreground text-sm">
                            <span>{group.members} members</span>
                            <span>•</span>
                            <span>Active {group.lastActivity}</span>
                            {group.newPosts > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-primary">
                                  {group.newPosts} new posts
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Group
                          </Button>
                          {group.newPosts > 0 && (
                            <Button size="sm" className="accent-glow">
                              Catch Up
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="suggestions" className="space-y-4">
                {suggestions.map((suggestion) => (
                  <Card
                    key={suggestion.id}
                    className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="border-2 border-primary/30 w-12 h-12">
                          <AvatarImage src={suggestion.avatar} />
                          <AvatarFallback className="bg-primary/20 font-mono text-primary">
                            {suggestion.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{suggestion.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {suggestion.type === "user" ? "Person" : "Group"}
                            </Badge>
                          </div>

                          {suggestion.type === "user" ? (
                            <>
                              <p className="mb-2 font-mono text-muted-foreground text-sm">
                                @{suggestion.username}
                              </p>
                              <p className="mb-2 text-muted-foreground text-sm">
                                {suggestion.bio}
                              </p>
                              <p className="mb-3 text-muted-foreground text-xs">
                                {suggestion.mutualConnections} mutual
                                connections
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="mb-2 text-muted-foreground text-sm">
                                {suggestion.description}
                              </p>
                              <p className="mb-3 text-muted-foreground text-xs">
                                {suggestion.members} members
                              </p>
                            </>
                          )}

                          <p className="text-blue-400 text-xs">
                            {suggestion.reason}
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Dismiss
                          </Button>
                          <Button size="sm" className="accent-glow">
                            {suggestion.type === "user" ? "Follow" : "Join"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4">
            <div className="top-24 sticky space-y-4">
              {/* Network Stats */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <h3 className="font-semibold text-sm">Your Network</h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Following</span>
                      <span className="font-mono text-sm">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Followers</span>
                      <span className="font-mono text-sm">234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Groups</span>
                      <span className="font-mono text-sm">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Connections</span>
                      <span className="font-mono text-sm">1,245</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Growth Insights */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <h3 className="flex items-center font-semibold text-sm">
                    <TrendingUp className="mr-2 w-4 h-4 text-green-400" />
                    Growth This Week
                  </h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>New Followers</span>
                      <span className="font-mono text-green-400">+12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profile Views</span>
                      <span className="font-mono text-green-400">+89</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Post Engagement</span>
                      <span className="font-mono text-green-400">+23%</span>
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
