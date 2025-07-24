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
  Star,
  GitBranch,
  Eye,
  ExternalLink,
  Filter,
  Grid,
  List,
  Rocket,
  Users2,
  TrendingUp,
} from "lucide-react";

const projects = [
  {
    id: "1",
    name: "codecave-platform",
    description:
      "A comprehensive social platform for developers to collaborate, share projects, and grow together in their coding journey",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 342,
    forks: 45,
    issues: 12,
    contributors: 8,
    status: "Active",
    visibility: "Public",
    lastUpdate: "2 hours ago",
    tags: ["social", "developers", "collaboration", "platform"],
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    difficulty: "Advanced",
    category: "Web Development",
  },
  {
    id: "2",
    name: "neural-viz",
    description:
      "Interactive 3D visualization tool for neural network training with real-time performance monitoring",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stars: 156,
    forks: 23,
    issues: 5,
    contributors: 4,
    status: "Active",
    visibility: "Public",
    lastUpdate: "1 day ago",
    tags: ["machine-learning", "visualization", "3d", "neural-networks"],
    tech: ["Three.js", "Python", "TensorFlow", "WebGL"],
    difficulty: "Advanced",
    category: "Machine Learning",
  },
  {
    id: "3",
    name: "rust-cli-tools",
    description:
      "Collection of high-performance command-line utilities built with Rust for developer productivity",
    language: "Rust",
    languageColor: "#dea584",
    stars: 89,
    forks: 12,
    issues: 3,
    contributors: 2,
    status: "Active",
    visibility: "Public",
    lastUpdate: "3 days ago",
    tags: ["cli", "tools", "productivity", "rust"],
    tech: ["Rust", "CLI", "Cross-platform"],
    difficulty: "Intermediate",
    category: "Tools & Utilities",
  },
  {
    id: "4",
    name: "api-gateway-service",
    description:
      "Microservices API gateway with load balancing, authentication, and monitoring capabilities",
    language: "Go",
    languageColor: "#00ADD8",
    stars: 67,
    forks: 8,
    issues: 2,
    contributors: 3,
    status: "Maintenance",
    visibility: "Private",
    lastUpdate: "1 week ago",
    tags: ["microservices", "api", "gateway", "golang"],
    tech: ["Go", "Docker", "Kubernetes", "Redis"],
    difficulty: "Advanced",
    category: "Backend",
  },
  {
    id: "5",
    name: "dev-portfolio-template",
    description:
      "Modern, minimalistic portfolio template for developers with dark mode and responsive design",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 234,
    forks: 56,
    issues: 8,
    contributors: 12,
    status: "Active",
    visibility: "Public",
    lastUpdate: "5 days ago",
    tags: ["portfolio", "template", "responsive", "dark-mode"],
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    difficulty: "Beginner",
    category: "Web Development",
  },
  {
    id: "6",
    name: "blockchain-explorer",
    description:
      "Comprehensive blockchain explorer with transaction tracking and analytics dashboard",
    language: "Python",
    languageColor: "#3572A5",
    stars: 123,
    forks: 18,
    issues: 6,
    contributors: 5,
    status: "Active",
    visibility: "Public",
    lastUpdate: "4 days ago",
    tags: ["blockchain", "explorer", "analytics", "crypto"],
    tech: ["Python", "Flask", "Redis", "PostgreSQL"],
    difficulty: "Advanced",
    category: "Blockchain",
  },
];

const categories = [
  "All",
  "Web Development",
  "Machine Learning",
  "Tools & Utilities",
  "Backend",
  "Blockchain",
];
const statusOptions = ["All", "Active", "Maintenance", "Archived"];

export default function Projects() {
  const [activeView, setActiveView] = useState("projects");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All" || project.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All" || project.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const GridView = () => (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {filteredProjects.map((project) => (
        <Card
          key={project.id}
          className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors cursor-pointer"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-primary">{project.name}</h3>
                  <Badge
                    variant="outline"
                    className={
                      project.visibility === "Public"
                        ? "border-green-500/30 text-green-400"
                        : "border-orange-500/30 text-orange-400"
                    }
                  >
                    {project.visibility}
                  </Badge>
                </div>
                <p className="mb-3 text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3 text-muted-foreground text-xs">
                    <div className="flex items-center space-x-1">
                      <div
                        className="rounded-full w-2 h-2"
                        style={{ backgroundColor: project.languageColor }}
                      ></div>
                      <span>{project.language}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>{project.stars}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitBranch className="w-3 h-3" />
                      <span>{project.forks}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border/30">
              <span className="text-muted-foreground text-xs">
                Updated {project.lastUpdate}
              </span>
              <Badge
                variant="outline"
                className={
                  project.status === "Active"
                    ? "border-green-500/30 text-green-400"
                    : project.status === "Maintenance"
                      ? "border-yellow-500/30 text-yellow-400"
                      : "border-gray-500/30 text-gray-400"
                }
              >
                {project.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-3">
      {filteredProjects.map((project) => (
        <Card
          key={project.id}
          className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-primary">{project.name}</h3>
                  <Badge
                    variant="outline"
                    className={
                      project.visibility === "Public"
                        ? "border-green-500/30 text-green-400"
                        : "border-orange-500/30 text-orange-400"
                    }
                  >
                    {project.visibility}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      project.status === "Active"
                        ? "border-green-500/30 text-green-400"
                        : project.status === "Maintenance"
                          ? "border-yellow-500/30 text-yellow-400"
                          : "border-gray-500/30 text-gray-400"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>

                <p className="mb-2 text-muted-foreground text-sm line-clamp-1">
                  {project.description}
                </p>

                <div className="flex items-center space-x-6 text-muted-foreground text-xs">
                  <div className="flex items-center space-x-1">
                    <div
                      className="rounded-full w-2 h-2"
                      style={{ backgroundColor: project.languageColor }}
                    ></div>
                    <span>{project.language}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>{project.stars} stars</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitBranch className="w-3 h-3" />
                    <span>{project.forks} forks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users2 className="w-3 h-3" />
                    <span>{project.contributors} contributors</span>
                  </div>
                  <span>Updated {project.lastUpdate}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 w-3 h-3" />
                  View
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

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
                      variant={activeView === "projects" ? "default" : "ghost"}
                      className="justify-start w-full"
                      size="sm"
                      onClick={() => setActiveView("projects")}
                    >
                      <Rocket className="mr-3 w-4 h-4" />
                      Projects
                    </Button>
                    <Button
                      variant={activeView === "starred" ? "default" : "ghost"}
                      className="justify-start w-full"
                      size="sm"
                      onClick={() => setActiveView("starred")}
                    >
                      <Star className="mr-3 w-4 h-4" />
                      Starred
                    </Button>
                    <Button
                      variant={activeView === "trending" ? "default" : "ghost"}
                      className="justify-start w-full"
                      size="sm"
                      onClick={() => setActiveView("trending")}
                    >
                      <TrendingUp className="mr-3 w-4 h-4" />
                      Trending
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
                      Search Projects
                    </label>
                    <Input
                      placeholder="Search by name or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="font-medium text-xs">Category</label>
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={
                            selectedCategory === category ? "default" : "ghost"
                          }
                          size="sm"
                          className="justify-start w-full text-xs"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="font-medium text-xs">Status</label>
                    <div className="space-y-1">
                      {statusOptions.map((status) => (
                        <Button
                          key={status}
                          variant={
                            selectedStatus === status ? "default" : "ghost"
                          }
                          size="sm"
                          className="justify-start w-full text-xs"
                          onClick={() => setSelectedStatus(status)}
                        >
                          {status}
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
                  <h1 className="font-bold text-2xl">Projects</h1>
                  <p className="text-muted-foreground">
                    {filteredProjects.length} of {projects.length} projects
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setViewMode(viewMode === "grid" ? "list" : "grid")
                    }
                  >
                    {viewMode === "grid" ? (
                      <List className="w-4 h-4" />
                    ) : (
                      <Grid className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="mr-2 w-4 h-4" />
                    New Project
                  </Button>
                </div>
              </div>

              {/* Projects Content */}
              {activeView === "projects" &&
                (viewMode === "grid" ? <GridView /> : <ListView />)}

              {activeView === "starred" && (
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-8 text-center">
                    <Star className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
                    <h3 className="mb-2 font-semibold">
                      No starred projects yet
                    </h3>
                    <p className="text-muted-foreground">
                      Star interesting projects to keep track of them
                    </p>
                  </CardContent>
                </Card>
              )}

              {activeView === "trending" && (
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-8 text-center">
                    <TrendingUp className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
                    <h3 className="mb-2 font-semibold">
                      Trending projects coming soon
                    </h3>
                    <p className="text-muted-foreground">
                      Discover popular projects in the developer community
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
