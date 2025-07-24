"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bell,
  Crown,
  Users,
  Monitor,
  Settings,
  Edit,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Star,
  GitBranch,
  Eye,
  ExternalLink,
  Code2,
  Activity,
  Award,
  Rocket,
  Terminal,
  Github,
  Twitter,
  Globe,
  User,
  Plus,
} from "lucide-react";

const userStats = {
  totalStars: 1247,
  totalForks: 189,
  totalRepos: 32,
  contributions: 2847,
  followers: 892,
  following: 156,
  joinDate: "March 2022",
  location: "San Francisco, CA",
  website: "johndeveloper.dev",
  bio: "Senior Full-stack Developer passionate about building developer tools and collaborative platforms. Currently building the future of coding communities at codecave.",
  company: "codecave",
  email: "john@codecave.dev",
};

const pinnedRepos = [
  {
    id: "1",
    name: "codecave-platform",
    description:
      "Social platform for developers to collaborate, share projects, and grow together",
    language: "TypeScript",
    stars: 342,
    forks: 45,
    isPrivate: false,
  },
  {
    id: "2",
    name: "neural-viz",
    description:
      "Interactive 3D visualization of neural network training in real-time",
    language: "JavaScript",
    stars: 156,
    forks: 23,
    isPrivate: false,
  },
  {
    id: "3",
    name: "rust-cli-tools",
    description: "Collection of high-performance CLI utilities built with Rust",
    language: "Rust",
    stars: 89,
    forks: 12,
    isPrivate: false,
  },
  {
    id: "4",
    name: "dev-portfolio",
    description: "Minimalistic portfolio template for developers",
    language: "TypeScript",
    stars: 67,
    forks: 8,
    isPrivate: false,
  },
];

const techStack = [
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Rust",
  "Go",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Vercel",
];

export default function Profile() {
  const [activeView, setActiveView] = useState("overview");

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
                  className="flex flex-col items-center space-y-0.5 px-2 py-1.5 h-auto text-primary transition-colors"
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
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 py-6 max-w-7xl">
        <div className="flex gap-6">
          {/* Left Sidebar - Profile Navigation */}
          <aside className="flex-shrink-0 w-60">
            <div className="top-20 sticky space-y-4">
              {/* Profile Card */}
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
                      <h1 className="font-semibold truncate">John Developer</h1>
                      <p className="font-mono text-muted-foreground text-sm truncate">
                        @johndeveloper
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {userStats.bio}
                    </p>

                    <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                      <MapPin className="w-3 h-3" />
                      <span>{userStats.location}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <LinkIcon className="w-3 h-3 text-muted-foreground" />
                      <a
                        href={`https://${userStats.website}`}
                        className="text-primary hover:text-accent text-sm"
                      >
                        {userStats.website}
                      </a>
                    </div>
                  </div>

                  <div className="gap-3 grid grid-cols-2 text-center">
                    <div className="space-y-1">
                      <p className="font-semibold text-primary">
                        {userStats.followers}
                      </p>
                      <p className="text-muted-foreground text-xs">Followers</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-accent">
                        {userStats.following}
                      </p>
                      <p className="text-muted-foreground text-xs">Following</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-2">
                  <nav className="space-y-1">
                    <Button
                      variant={activeView === "overview" ? "default" : "ghost"}
                      className="justify-start w-full"
                      size="sm"
                      onClick={() => setActiveView("overview")}
                    >
                      <User className="mr-3 w-4 h-4" />
                      Overview
                    </Button>
                    <Button
                      variant={
                        activeView === "repositories" ? "default" : "ghost"
                      }
                      className="justify-start w-full"
                      size="sm"
                      onClick={() => setActiveView("repositories")}
                    >
                      <Code2 className="mr-3 w-4 h-4" />
                      Repositories
                    </Button>
                    <Button
                      variant={activeView === "activity" ? "default" : "ghost"}
                      className="justify-start w-full"
                      size="sm"
                      onClick={() => setActiveView("activity")}
                    >
                      <Activity className="mr-3 w-4 h-4" />
                      Activity
                    </Button>
                    <Button
                      variant={
                        activeView === "achievements" ? "default" : "ghost"
                      }
                      className="justify-start w-full"
                      size="sm"
                      onClick={() => setActiveView("achievements")}
                    >
                      <Award className="mr-3 w-4 h-4" />
                      Achievements
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            <div className="space-y-6">
              {activeView === "overview" && (
                <>
                  {/* Stats Grid */}
                  <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
                    <Card className="bg-card/50 border-border/50">
                      <CardContent className="p-4 text-center">
                        <p className="font-bold text-primary text-2xl">
                          {userStats.totalRepos}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Repositories
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50">
                      <CardContent className="p-4 text-center">
                        <p className="font-bold text-accent text-2xl">
                          {userStats.totalStars}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Total Stars
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50">
                      <CardContent className="p-4 text-center">
                        <p className="font-bold text-info text-2xl">
                          {userStats.totalForks}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Total Forks
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50">
                      <CardContent className="p-4 text-center">
                        <p className="font-bold text-green-400 text-2xl">
                          {userStats.contributions}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Contributions
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Contribution Graph */}
                  <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                      <h2 className="flex items-center font-semibold">
                        <Activity className="mr-2 w-5 h-5 text-primary" />
                        Contribution Activity
                      </h2>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="gap-1 grid grid-cols-53">
                          {Array.from({ length: 371 }, (_, i) => {
                            // Use deterministic pattern based on index to avoid hydration mismatch
                            const intensity = (i * 11 + i * 5) % 10;
                            const bgClass =
                              intensity > 8
                                ? "bg-primary"
                                : intensity > 6
                                  ? "bg-primary/70"
                                  : intensity > 4
                                    ? "bg-primary/40"
                                    : "bg-muted";
                            const contributions = (i * 3) % 8;
                            return (
                              <div
                                key={i}
                                className={`w-2.5 h-2.5 rounded-sm ${bgClass}`}
                                title={`${contributions} contributions`}
                              />
                            );
                          })}
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground text-sm">
                          <span>
                            {userStats.contributions} contributions in the last
                            year
                          </span>
                          <div className="flex items-center space-x-2">
                            <span>Less</span>
                            <div className="flex space-x-1">
                              <div className="bg-muted rounded-sm w-2.5 h-2.5"></div>
                              <div className="bg-primary/40 rounded-sm w-2.5 h-2.5"></div>
                              <div className="bg-primary/70 rounded-sm w-2.5 h-2.5"></div>
                              <div className="bg-primary rounded-sm w-2.5 h-2.5"></div>
                            </div>
                            <span>More</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pinned Repositories */}
                  <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                      <h2 className="flex items-center font-semibold">
                        <Rocket className="mr-2 w-5 h-5 text-primary" />
                        Pinned Repositories
                      </h2>
                    </CardHeader>
                    <CardContent>
                      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                        {pinnedRepos.map((repo) => (
                          <Card
                            key={repo.id}
                            className="bg-muted/20 hover:bg-muted/40 border-border/30 transition-colors cursor-pointer"
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-primary text-sm">
                                  {repo.name}
                                </h3>
                                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                              </div>
                              <p className="mb-3 text-muted-foreground text-xs line-clamp-2 leading-relaxed">
                                {repo.description}
                              </p>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3 text-muted-foreground text-xs">
                                  <div className="flex items-center space-x-1">
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        repo.language === "TypeScript"
                                          ? "bg-blue-500"
                                          : repo.language === "JavaScript"
                                            ? "bg-yellow-500"
                                            : repo.language === "Rust"
                                              ? "bg-orange-500"
                                              : "bg-gray-500"
                                      }`}
                                    ></div>
                                    <span>{repo.language}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3" />
                                    <span>{repo.stars}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <GitBranch className="w-3 h-3" />
                                    <span>{repo.forks}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {activeView === "repositories" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl">Repositories</h2>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Plus className="mr-2 w-4 h-4" />
                      New Repository
                    </Button>
                  </div>
                  {pinnedRepos.map((repo) => (
                    <Card
                      key={repo.id}
                      className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-primary">
                                {repo.name}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                Public
                              </Badge>
                            </div>
                            <p className="mb-3 text-muted-foreground text-sm">
                              {repo.description}
                            </p>
                            <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                              <div className="flex items-center space-x-1">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    repo.language === "TypeScript"
                                      ? "bg-blue-500"
                                      : repo.language === "JavaScript"
                                        ? "bg-yellow-500"
                                        : repo.language === "Rust"
                                          ? "bg-orange-500"
                                          : "bg-gray-500"
                                  }`}
                                ></div>
                                <span>{repo.language}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3" />
                                <span>{repo.stars}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <GitBranch className="w-3 h-3" />
                                <span>{repo.forks}</span>
                              </div>
                              <span>Updated 2 days ago</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeView === "activity" && (
                <div className="space-y-4">
                  <h2 className="font-semibold text-xl">Recent Activity</h2>
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-4">
                      <p className="py-8 text-muted-foreground text-center">
                        Activity feed will be available soon
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeView === "achievements" && (
                <div className="space-y-4">
                  <h2 className="font-semibold text-xl">Achievements</h2>
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-4">
                      <p className="py-8 text-muted-foreground text-center">
                        Achievements system coming soon
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="flex-shrink-0 w-72">
            <div className="top-20 sticky space-y-4">
              {/* Tech Stack */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <h3 className="flex items-center font-semibold text-sm">
                    <Terminal className="mr-2 w-4 h-4 text-primary" />
                    Tech Stack
                  </h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-wrap gap-1">
                    {techStack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="font-mono text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <h3 className="font-semibold text-sm">Quick Actions</h3>
                </CardHeader>
                <CardContent className="space-y-2 p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start w-full text-xs"
                  >
                    <Edit className="mr-2 w-3 h-3" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start w-full text-xs"
                  >
                    <Settings className="mr-2 w-3 h-3" />
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start w-full text-xs"
                  >
                    <Eye className="mr-2 w-3 h-3" />
                    View as Public
                  </Button>
                </CardContent>
              </Card>

              {/* Status */}
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-green-400 rounded-full w-2 h-2 animate-pulse"></div>
                    <span className="font-medium text-green-400 text-sm">
                      Available for work
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Open to collaborating on interesting projects
                  </p>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
