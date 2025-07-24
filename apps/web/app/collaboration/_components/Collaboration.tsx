"use client";
import React, { useState } from "react";
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
  Clock,
  Star,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Code2,
  GitBranch,
  Calendar,
  MapPin,
  Zap,
  Target,
  Rocket,
  Monitor,
  Coffee,
  DollarSign,
} from "lucide-react";

const collaborationOpportunities = [
  {
    id: "1",
    title: "Looking for Frontend Developer - AI SaaS Platform",
    description:
      "Building an AI-powered analytics platform. Need someone experienced with React, TypeScript, and modern UI libraries. This will be a 3-month collaboration with potential for equity.",
    author: {
      name: "Sarah Chen",
      username: "sarahbuilds",
      avatar: "/api/placeholder/40/40",
      verified: true,
    },
    type: "equity",
    commitment: "Part-time",
    duration: "3 months",
    skills: ["React", "TypeScript", "Tailwind CSS", "Figma"],
    applications: 23,
    likes: 156,
    comments: 34,
    shares: 12,
    timestamp: "2 hours ago",
    status: "open",
    remote: true,
  },
  {
    id: "2",
    title: "Open Source Contributor Wanted - CLI Tool",
    description:
      "Maintaining a popular Rust CLI tool with 10k+ GitHub stars. Looking for contributors to help with new features and bug fixes. Great for building your open source portfolio!",
    author: {
      name: "Alex Rodriguez",
      username: "alexcodes",
      avatar: "/api/placeholder/40/40",
    },
    type: "volunteer",
    commitment: "Flexible",
    duration: "Ongoing",
    skills: ["Rust", "CLI", "Git", "Open Source"],
    applications: 45,
    likes: 298,
    comments: 67,
    shares: 34,
    timestamp: "5 hours ago",
    status: "open",
    remote: true,
  },
  {
    id: "3",
    title: "Co-founder Needed - Developer Tools Startup",
    description:
      "Have a solid MVP and early traction for a developer productivity tool. Seeking a technical co-founder to scale the platform. Opportunity for significant equity and technical leadership.",
    author: {
      name: "Emma Johnson",
      username: "emmacreates",
      avatar: "/api/placeholder/40/40",
    },
    type: "co-founder",
    commitment: "Full-time",
    duration: "Long-term",
    skills: ["Node.js", "React", "DevOps", "Leadership"],
    applications: 12,
    likes: 423,
    comments: 89,
    shares: 56,
    timestamp: "1 day ago",
    status: "open",
    remote: false,
    location: "San Francisco, CA",
  },
];

const activeProjects = [
  {
    id: "1",
    name: "VibeCoding Platform",
    description:
      "Social platform for developers to collaborate and share projects",
    teamSize: 4,
    tech: ["React", "Node.js", "PostgreSQL"],
    progress: 75,
    status: "seeking-backend",
    needsSkills: ["Backend", "API Design"],
    timeline: "2 months remaining",
  },
  {
    id: "2",
    name: "Neural Network Visualizer",
    description: "3D visualization tool for machine learning models",
    teamSize: 2,
    tech: ["Three.js", "Python", "TensorFlow"],
    progress: 45,
    status: "seeking-designer",
    needsSkills: ["UI/UX", "3D Design"],
    timeline: "4 months remaining",
  },
];

const hackathons = [
  {
    id: "1",
    name: "AI Innovation Hackathon",
    date: "Nov 15-17, 2024",
    prize: "$10,000",
    participants: 500,
    theme: "AI Tools for Developers",
    status: "registration-open",
  },
  {
    id: "2",
    name: "Climate Tech Challenge",
    date: "Dec 2-4, 2024",
    prize: "$15,000",
    participants: 300,
    theme: "Sustainable Technology",
    status: "forming-teams",
  },
];

export default function Collaboration() {
  const [activeTab, setActiveTab] = useState("opportunities");
  const [filter, setFilter] = useState("all");

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
                Start Collaboration
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
            Collaboration Hub
          </h1>
          <p className="text-muted-foreground">
            Find teammates, join projects, and build amazing things together
          </p>
        </div>

        <div className="gap-6 grid grid-cols-1 lg:grid-cols-12">
          {/* Main Content */}
          <main className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 bg-muted/50 mb-6 w-full">
                <TabsTrigger value="opportunities" className="font-mono">
                  opportunities
                </TabsTrigger>
                <TabsTrigger value="projects" className="font-mono">
                  projects
                </TabsTrigger>
                <TabsTrigger value="hackathons" className="font-mono">
                  hackathons
                </TabsTrigger>
                <TabsTrigger value="create" className="font-mono">
                  create
                </TabsTrigger>
              </TabsList>

              {/* Filters */}
              <Card className="bg-card/50 mb-6 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                      <Input
                        placeholder="Search by skills, project type, or keywords..."
                        className="pl-10"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant={filter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("all")}
                      >
                        All
                      </Button>
                      <Button
                        variant={filter === "paid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("paid")}
                      >
                        Paid
                      </Button>
                      <Button
                        variant={filter === "equity" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("equity")}
                      >
                        Equity
                      </Button>
                      <Button
                        variant={filter === "volunteer" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("volunteer")}
                      >
                        Volunteer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <TabsContent value="opportunities" className="space-y-4">
                {collaborationOpportunities.map((opportunity) => (
                  <Card
                    key={opportunity.id}
                    className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="border-2 border-primary/30 w-10 h-10">
                          <AvatarImage src={opportunity.author.avatar} />
                          <AvatarFallback className="bg-primary/20 font-mono text-primary">
                            {opportunity.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {opportunity.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={
                                opportunity.type === "equity"
                                  ? "border-green-500 text-green-400"
                                  : opportunity.type === "paid"
                                    ? "border-blue-500 text-blue-400"
                                    : opportunity.type === "co-founder"
                                      ? "border-purple-500 text-purple-400"
                                      : "border-gray-500 text-gray-400"
                              }
                            >
                              {opportunity.type}
                            </Badge>
                            {opportunity.status === "open" && (
                              <Badge
                                variant="outline"
                                className="border-green-500 text-green-400"
                              >
                                Open
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 mb-3 text-muted-foreground text-sm">
                            <span className="font-mono">
                              @{opportunity.author.username}
                            </span>
                            <span>•</span>
                            <span>{opportunity.timestamp}</span>
                            {opportunity.author.verified && (
                              <Badge
                                variant="secondary"
                                className="px-1 h-4 text-xs"
                              >
                                ✓
                              </Badge>
                            )}
                          </div>

                          <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
                            {opportunity.description}
                          </p>

                          <div className="gap-4 grid grid-cols-2 mb-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Commitment:
                              </span>
                              <span className="ml-2 font-mono">
                                {opportunity.commitment}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Duration:
                              </span>
                              <span className="ml-2 font-mono">
                                {opportunity.duration}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Location:
                              </span>
                              <span className="ml-2 font-mono">
                                {opportunity.remote
                                  ? "Remote"
                                  : opportunity.location}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Applications:
                              </span>
                              <span className="ml-2 font-mono">
                                {opportunity.applications}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {opportunity.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="font-mono text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-6">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="px-2 h-8 text-muted-foreground"
                              >
                                <Heart className="mr-2 w-4 h-4" />
                                <span className="font-mono">
                                  {opportunity.likes}
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="px-2 h-8 text-muted-foreground"
                              >
                                <MessageCircle className="mr-2 w-4 h-4" />
                                <span className="font-mono">
                                  {opportunity.comments}
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="px-2 h-8 text-muted-foreground"
                              >
                                <Share2 className="mr-2 w-4 h-4" />
                                <span className="font-mono">
                                  {opportunity.shares}
                                </span>
                              </Button>
                            </div>

                            <Button size="sm" className="accent-glow">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                {activeProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="mb-2 font-semibold text-lg">
                            {project.name}
                          </h3>
                          <p className="mb-3 text-muted-foreground text-sm">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.tech.map((tech) => (
                              <Badge
                                key={tech}
                                variant="secondary"
                                className="font-mono text-xs"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>

                          <div className="gap-4 grid grid-cols-2 mb-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Team Size:
                              </span>
                              <span className="ml-2 font-mono">
                                {project.teamSize} members
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Timeline:
                              </span>
                              <span className="ml-2 font-mono">
                                {project.timeline}
                              </span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="bg-muted rounded-full w-full h-2">
                              <div
                                className="bg-primary rounded-full h-2 transition-all"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          {project.needsSkills.length > 0 && (
                            <div className="mb-4">
                              <p className="mb-2 text-muted-foreground text-sm">
                                Currently seeking:
                              </p>
                              <div className="flex space-x-1">
                                {project.needsSkills.map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="outline"
                                    className="border-green-500/30 text-green-400 text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <Button size="sm" variant="outline">
                          Join Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="hackathons" className="space-y-4">
                {hackathons.map((hackathon) => (
                  <Card
                    key={hackathon.id}
                    className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {hackathon.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="border-purple-500 text-purple-400"
                            >
                              Hackathon
                            </Badge>
                          </div>

                          <div className="gap-4 grid grid-cols-2 mb-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{hackathon.date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <span>{hackathon.prize} prize pool</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span>{hackathon.participants} participants</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Target className="w-4 h-4 text-muted-foreground" />
                              <span>{hackathon.theme}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Learn More
                          </Button>
                          <Button size="sm" className="accent-glow">
                            {hackathon.status === "registration-open"
                              ? "Register"
                              : "Find Team"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="create" className="space-y-6">
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <h2 className="font-semibold text-xl">
                      Start a Collaboration
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Post your project idea and find the perfect teammates
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block mb-2 font-medium text-sm">
                        Project Title
                      </label>
                      <Input placeholder="e.g., Looking for React Developer - E-commerce Platform" />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium text-sm">
                        Description
                      </label>
                      <textarea
                        className="bg-background p-3 border border-border rounded-md w-full resize-none"
                        rows={4}
                        placeholder="Describe your project, what you're building, and what kind of help you need..."
                      />
                    </div>

                    <div className="gap-4 grid grid-cols-2">
                      <div>
                        <label className="block mb-2 font-medium text-sm">
                          Collaboration Type
                        </label>
                        <select className="bg-background p-2 border border-border rounded-md w-full">
                          <option>Equity-based</option>
                          <option>Paid</option>
                          <option>Co-founder</option>
                          <option>Volunteer/Open Source</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-sm">
                          Commitment
                        </label>
                        <select className="bg-background p-2 border border-border rounded-md w-full">
                          <option>Part-time</option>
                          <option>Full-time</option>
                          <option>Flexible</option>
                          <option>Project-based</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 font-medium text-sm">
                        Required Skills
                      </label>
                      <Input placeholder="e.g., React, TypeScript, UI/UX Design (comma separated)" />
                    </div>

                    <Button className="w-full neon-glow">
                      <Rocket className="mr-2 w-4 h-4" />
                      Post Collaboration
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4">
            <div className="top-24 sticky space-y-4">
              {/* Quick Stats */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <h3 className="flex items-center font-semibold text-sm">
                    <Zap className="mr-2 w-4 h-4 text-accent" />
                    This Week
                  </h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">New Opportunities</span>
                      <span className="font-mono text-sm">47</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Successful Matches</span>
                      <span className="font-mono text-sm">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active Projects</span>
                      <span className="font-mono text-sm">156</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Success Stories */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <h3 className="flex items-center font-semibold text-sm">
                    <Star className="mr-2 w-4 h-4 text-yellow-400" />
                    Success Stories
                  </h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium">TaskFlow App</p>
                      <p className="text-muted-foreground text-xs">
                        Found co-founder through VibeCoding, now at $50k MRR
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">DevTools CLI</p>
                      <p className="text-muted-foreground text-xs">
                        Open source project gained 15k+ stars with community
                        help
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <h3 className="flex items-center font-semibold text-sm">
                    <Target className="mr-2 w-4 h-4 text-blue-400" />
                    Collaboration Tips
                  </h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2 text-muted-foreground text-xs">
                    <p>• Be specific about what skills you need</p>
                    <p>• Set clear expectations and timeline</p>
                    <p>• Show your existing work and progress</p>
                    <p>• Communicate compensation transparently</p>
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
