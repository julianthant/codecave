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
  User,
  Plus,
  Lightbulb,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Calendar,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
} from "lucide-react";

const questions = [
  {
    id: "1",
    title:
      "How to properly handle state management in large React applications?",
    content:
      "I'm working on a React app with 200+ components and finding Redux to be overkill. What are the best practices for state management at this scale? Should I consider Zustand, Jotai, or stick with Context API?",
    author: {
      name: "Emma Johnson",
      username: "emmacreates",
      avatar: "/api/placeholder/32/32",
      rank: "Junior",
      reputation: 245,
    },
    tags: ["react", "state-management", "redux", "zustand", "frontend"],
    votes: 23,
    answers: 8,
    views: 1247,
    createdAt: "2 hours ago",
    hasAcceptedAnswer: false,
    status: "Open",
    difficulty: "Intermediate",
    bounty: null,
  },
  {
    id: "2",
    title: "Best practices for securing API endpoints in Node.js microservices",
    content:
      "I'm building a microservices architecture with Node.js and need to implement proper security measures. What are the essential security practices I should follow for API endpoints, authentication, and data validation?",
    author: {
      name: "Alex Rodriguez",
      username: "alexcodes",
      avatar: "/api/placeholder/32/32",
      rank: "Mid",
      reputation: 892,
    },
    tags: ["nodejs", "security", "microservices", "api", "authentication"],
    votes: 45,
    answers: 12,
    views: 2156,
    createdAt: "5 hours ago",
    hasAcceptedAnswer: true,
    status: "Solved",
    difficulty: "Advanced",
    bounty: 50,
  },
  {
    id: "3",
    title: "Understanding Rust ownership and borrowing concepts",
    content:
      "I'm new to Rust and struggling with the ownership system. Can someone explain the difference between borrowing and moving values, and when to use references vs owned values?",
    author: {
      name: "David Kim",
      username: "rustlearner",
      avatar: "/api/placeholder/32/32",
      rank: "Junior",
      reputation: 156,
    },
    tags: ["rust", "ownership", "borrowing", "memory-management", "beginner"],
    votes: 34,
    answers: 15,
    views: 3421,
    createdAt: "1 day ago",
    hasAcceptedAnswer: true,
    status: "Solved",
    difficulty: "Beginner",
    bounty: null,
  },
  {
    id: "4",
    title: "Docker container optimization for production deployment",
    content:
      "My Docker images are getting quite large (>2GB) and deployment is slow. What are the best strategies for optimizing Docker containers for production use?",
    author: {
      name: "Sarah Chen",
      username: "sarahbuilds",
      avatar: "/api/placeholder/32/32",
      rank: "Senior",
      reputation: 1567,
    },
    tags: ["docker", "deployment", "optimization", "production", "devops"],
    votes: 67,
    answers: 9,
    views: 1890,
    createdAt: "2 days ago",
    hasAcceptedAnswer: false,
    status: "Open",
    difficulty: "Intermediate",
    bounty: 100,
  },
  {
    id: "5",
    title: "Machine learning model performance optimization in Python",
    content:
      "I have a TensorFlow model that's training very slowly on large datasets. Are there specific techniques or libraries I should use to speed up training without sacrificing accuracy?",
    author: {
      name: "Marcus Kim",
      username: "markusk",
      avatar: "/api/placeholder/32/32",
      rank: "Lead",
      reputation: 2134,
    },
    tags: [
      "python",
      "tensorflow",
      "machine-learning",
      "optimization",
      "performance",
    ],
    votes: 89,
    answers: 6,
    views: 2678,
    createdAt: "3 days ago",
    hasAcceptedAnswer: false,
    status: "Open",
    difficulty: "Advanced",
    bounty: 200,
  },
];

const tags = [
  "javascript",
  "python",
  "react",
  "nodejs",
  "typescript",
  "rust",
  "go",
  "docker",
  "kubernetes",
  "aws",
  "machine-learning",
  "frontend",
  "backend",
  "security",
  "performance",
  "database",
  "api",
  "microservices",
];

export default function QA() {
  const [activeView, setActiveView] = useState("questions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Junior":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Mid":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Senior":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Lead":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Architect":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "border-green-500/30 text-green-400";
      case "Intermediate":
        return "border-yellow-500/30 text-yellow-400";
      case "Advanced":
        return "border-red-500/30 text-red-400";
      default:
        return "border-gray-500/30 text-gray-400";
    }
  };

  const getStatusIcon = (status: string, hasAcceptedAnswer: boolean) => {
    if (hasAcceptedAnswer)
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === "Open")
      return <AlertCircle className="w-4 h-4 text-blue-400" />;
    return <Clock className="w-4 h-4 text-yellow-400" />;
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => question.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

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
          {/* Left Sidebar */}
          <aside className="flex-shrink-0 w-60">
            <div className="top-20 sticky space-y-4">
              {/* Navigation */}
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-2">
                  <nav className="space-y-1">
                    <Button
                      variant={activeView === "questions" ? "default" : "ghost"}
                      className="justify-start w-full"
                      size="sm"
                      onClick={() => setActiveView("questions")}
                    >
                      <Lightbulb className="mr-3 w-4 h-4" />
                      Questions
                    </Button>
                    <Button
                      variant={activeView === "tags" ? "default" : "ghost"}
                      className="justify-start w-full"
                      size="sm"
                      onClick={() => setActiveView("tags")}
                    >
                      <Star className="mr-3 w-4 h-4" />
                      Tags
                    </Button>
                    <Button
                      variant={
                        activeView === "leaderboard" ? "default" : "ghost"
                      }
                      className="justify-start w-full"
                      size="sm"
                      onClick={() => setActiveView("leaderboard")}
                    >
                      <Award className="mr-3 w-4 h-4" />
                      Leaderboard
                    </Button>
                  </nav>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <h3 className="flex items-center font-semibold text-sm">
                    <Filter className="mr-2 w-4 h-4 text-primary" />
                    Filters
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4 p-4 pt-0">
                  {/* Search */}
                  <div className="space-y-2">
                    <label className="font-medium text-xs">
                      Search Questions
                    </label>
                    <Input
                      placeholder="Search by title or content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  {/* Sort */}
                  <div className="space-y-2">
                    <label className="font-medium text-xs">Sort By</label>
                    <div className="space-y-1">
                      {["newest", "votes", "answers", "views"].map((sort) => (
                        <Button
                          key={sort}
                          variant={sortBy === sort ? "default" : "ghost"}
                          size="sm"
                          className="justify-start w-full text-xs capitalize"
                          onClick={() => setSortBy(sort)}
                        >
                          {sort}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Popular Tags */}
                  <div className="space-y-2">
                    <label className="font-medium text-xs">Popular Tags</label>
                    <div className="flex flex-wrap gap-1">
                      {tags.slice(0, 8).map((tag) => (
                        <Button
                          key={tag}
                          variant={
                            selectedTags.includes(tag) ? "default" : "outline"
                          }
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => {
                            setSelectedTags((prev) =>
                              prev.includes(tag)
                                ? prev.filter((t) => t !== tag)
                                : [...prev, tag]
                            );
                          }}
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-bold text-2xl">Questions & Answers</h1>
                  <p className="text-muted-foreground">
                    {filteredQuestions.length} questions
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="mr-2 w-4 h-4" />
                  Ask Question
                </Button>
              </div>

              {/* Questions List */}
              {activeView === "questions" && (
                <div className="space-y-4">
                  {filteredQuestions.map((question) => (
                    <Card
                      key={question.id}
                      className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="flex space-x-4">
                          {/* Stats */}
                          <div className="flex flex-col items-center space-y-2 min-w-[80px] text-center">
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="w-3 h-3 text-green-400" />
                              <span className="font-mono text-sm">
                                {question.votes}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-3 h-3 text-blue-400" />
                              <span className="font-mono text-sm">
                                {question.answers}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-3 h-3 text-muted-foreground" />
                              <span className="font-mono text-xs">
                                {question.views}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-primary hover:text-accent transition-colors">
                                {question.title}
                              </h3>
                              <div className="flex items-center space-x-2 ml-4">
                                {getStatusIcon(
                                  question.status,
                                  question.hasAcceptedAnswer
                                )}
                                {question.bounty && (
                                  <Badge
                                    variant="outline"
                                    className="border-accent text-accent"
                                  >
                                    +{question.bounty}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p className="mb-3 text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                              {question.content}
                            </p>

                            <div className="flex flex-wrap gap-1 mb-3">
                              {question.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <Avatar className="border border-primary/30 w-6 h-6">
                                  <AvatarImage src={question.author.avatar} />
                                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                    {question.author.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm">
                                    {question.author.name}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${getRankColor(question.author.rank)}`}
                                  >
                                    {question.author.rank}
                                  </Badge>
                                  <span className="text-muted-foreground text-xs">
                                    {question.author.reputation} rep
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 text-muted-foreground text-xs">
                                <Badge
                                  variant="outline"
                                  className={getDifficultyColor(
                                    question.difficulty
                                  )}
                                >
                                  {question.difficulty}
                                </Badge>
                                <span>{question.createdAt}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Tags View */}
              {activeView === "tags" && (
                <div className="space-y-4">
                  <div className="gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {tags.map((tag) => (
                      <Card
                        key={tag}
                        className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors cursor-pointer"
                      >
                        <CardContent className="p-4 text-center">
                          <h3 className="mb-2 font-semibold text-primary">
                            {tag}
                          </h3>
                          <div className="space-y-1 text-muted-foreground text-sm">
                            <p>
                              {Math.floor((tag.length * 7 + 20) % 100) + 20}{" "}
                              questions
                            </p>
                            <p>
                              {Math.floor((tag.length * 3 + 10) % 50) + 10} this
                              week
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Leaderboard View */}
              {activeView === "leaderboard" && (
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-8 text-center">
                    <Award className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
                    <h3 className="mb-2 font-semibold">
                      Leaderboard coming soon
                    </h3>
                    <p className="text-muted-foreground">
                      Track top contributors and experts in the community
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
