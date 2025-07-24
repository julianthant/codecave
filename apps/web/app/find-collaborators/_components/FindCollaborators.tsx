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
  Search,
  Users,
  MapPin,
  Clock,
  Star,
  Filter,
  MessageCircle,
  Plus,
} from "lucide-react";

interface Collaborator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  rank: "Junior" | "Mid" | "Senior" | "Lead" | "Architect";
  location: string;
  timezone: string;
  bio: string;
  skills: string[];
  lookingFor: string[];
  availableHours: string;
  projects: number;
  rating: number;
  responseTime: string;
  verified?: boolean;
}

const mockCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "Alex Rodriguez",
    username: "alexcodes",
    avatar: "/api/placeholder/48/48",
    rank: "Senior",
    location: "New York, NY",
    timezone: "EST",
    bio: "Full-stack developer passionate about building scalable web applications. Love mentoring junior developers and exploring new technologies.",
    skills: ["React", "Node.js", "TypeScript", "Python", "AWS"],
    lookingFor: ["Frontend Projects", "Mentoring", "Open Source"],
    availableHours: "10-15 hrs/week",
    projects: 12,
    rating: 4.9,
    responseTime: "< 2 hours",
    verified: true,
  },
  {
    id: "2",
    name: "Sarah Kim",
    username: "sarah_builds",
    avatar: "/api/placeholder/48/48",
    rank: "Lead",
    location: "San Francisco, CA",
    timezone: "PST",
    bio: "AI/ML engineer with 8+ years experience. Currently working on MLOps and looking to collaborate on innovative AI projects.",
    skills: ["Python", "TensorFlow", "PyTorch", "Kubernetes", "MLOps"],
    lookingFor: ["AI/ML Projects", "Research", "Technical Writing"],
    availableHours: "5-10 hrs/week",
    projects: 8,
    rating: 5.0,
    responseTime: "< 1 hour",
    verified: true,
  },
  {
    id: "3",
    name: "Marcus Chen",
    username: "marcuscode",
    avatar: "/api/placeholder/48/48",
    rank: "Mid",
    location: "Toronto, CA",
    timezone: "EST",
    bio: "Backend developer specializing in microservices and distributed systems. Always excited to work on challenging architectural problems.",
    skills: ["Go", "Rust", "Docker", "PostgreSQL", "Redis"],
    lookingFor: ["Backend Projects", "System Design", "Code Review"],
    availableHours: "15-20 hrs/week",
    projects: 15,
    rating: 4.7,
    responseTime: "< 4 hours",
  },
  {
    id: "4",
    name: "Emma Johnson",
    username: "emmacreates",
    avatar: "/api/placeholder/48/48",
    rank: "Junior",
    location: "Austin, TX",
    timezone: "CST",
    bio: "Frontend developer and UI/UX enthusiast. Looking to gain more experience and contribute to meaningful projects.",
    skills: ["React", "JavaScript", "CSS", "Figma", "Vue.js"],
    lookingFor: ["Learning", "Frontend Projects", "UI/UX"],
    availableHours: "20+ hrs/week",
    projects: 3,
    rating: 4.5,
    responseTime: "< 6 hours",
  },
];

export default function FindCollaborators() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");

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

  const allSkills = Array.from(
    new Set(mockCollaborators.flatMap((c) => c.skills))
  );

  const filteredCollaborators = mockCollaborators.filter((collaborator) => {
    const matchesSearch =
      collaborator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaborator.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaborator.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => collaborator.skills.includes(skill));

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "verified" && collaborator.verified) ||
      (activeTab === "available" &&
        collaborator.availableHours !== "0 hrs/week");

    return matchesSearch && matchesSkills && matchesTab;
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="top-0 z-50 sticky bg-background shadow-sm border-b border-border w-full">
        <div className="flex justify-between items-center mx-auto px-4 max-w-6xl h-14">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <h1 className="font-semibold text-lg">Find Collaborators</h1>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 w-4 h-4" />
            Post Project
          </Button>
        </div>
      </header>

      <div className="mx-auto px-4 py-6 max-w-6xl">
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="space-y-4">
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-3">
                <h2 className="flex items-center font-semibold text-sm">
                  <Filter className="mr-2 w-4 h-4 text-primary" />
                  Filters
                </h2>
              </CardHeader>
              <CardContent className="space-y-4 p-4 pt-0">
                {/* Search */}
                <div className="space-y-2">
                  <label className="font-medium text-sm">Search</label>
                  <div className="relative">
                    <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                    <Input
                      placeholder="Skills, name, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Skills Filter */}
                <div className="space-y-2">
                  <label className="font-medium text-sm">Skills</label>
                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                    {allSkills.map((skill) => (
                      <Button
                        key={skill}
                        variant={
                          selectedSkills.includes(skill) ? "default" : "outline"
                        }
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          setSelectedSkills((prev) =>
                            prev.includes(skill)
                              ? prev.filter((s) => s !== skill)
                              : [...prev, skill]
                          );
                        }}
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">
                      Available Now
                    </span>
                    <span className="font-semibold text-green-400 text-sm">
                      {
                        mockCollaborators.filter(
                          (c) => c.availableHours !== "0 hrs/week"
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">
                      Verified Developers
                    </span>
                    <span className="font-semibold text-primary text-sm">
                      {mockCollaborators.filter((c) => c.verified).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">
                      Total Collaborators
                    </span>
                    <span className="font-semibold text-sm">
                      {mockCollaborators.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6 lg:col-span-3">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">
                  All ({mockCollaborators.length})
                </TabsTrigger>
                <TabsTrigger value="verified">
                  Verified ({mockCollaborators.filter((c) => c.verified).length}
                  )
                </TabsTrigger>
                <TabsTrigger value="available">
                  Available (
                  {
                    mockCollaborators.filter(
                      (c) => c.availableHours !== "0 hrs/week"
                    ).length
                  }
                  )
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-4">
                  {filteredCollaborators.map((collaborator) => (
                    <Card
                      key={collaborator.id}
                      className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="border-2 border-primary/30 w-12 h-12">
                            <AvatarImage src={collaborator.avatar} />
                            <AvatarFallback className="bg-primary/20 font-mono text-primary">
                              {collaborator.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">
                                {collaborator.name}
                              </h3>
                              {collaborator.verified && (
                                <Badge
                                  variant="secondary"
                                  className="px-1 h-4 text-xs"
                                >
                                  ✓
                                </Badge>
                              )}
                              <Badge
                                variant="outline"
                                className={`text-xs px-2 h-5 ${getRankColor(collaborator.rank)}`}
                              >
                                {collaborator.rank}
                              </Badge>
                              <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                                <Star className="fill-current w-3 h-3 text-yellow-400" />
                                <span className="font-mono">
                                  {collaborator.rating}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 mb-3 text-muted-foreground text-sm">
                              <span className="font-mono">
                                @{collaborator.username}
                              </span>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>
                                  {collaborator.location} (
                                  {collaborator.timezone})
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{collaborator.availableHours}</span>
                              </div>
                            </div>

                            <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
                              {collaborator.bio}
                            </p>

                            <div className="space-y-3">
                              {/* Skills */}
                              <div>
                                <span className="block mb-1 text-muted-foreground text-xs">
                                  Skills
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {collaborator.skills.map((skill) => (
                                    <Badge
                                      key={skill}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Looking For */}
                              <div>
                                <span className="block mb-1 text-muted-foreground text-xs">
                                  Looking For
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {collaborator.lookingFor.map((item) => (
                                    <Badge
                                      key={item}
                                      variant="outline"
                                      className="border-primary/30 text-primary text-xs"
                                    >
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              <MessageCircle className="mr-2 w-3 h-3" />
                              Contact
                            </Button>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
                          <div className="flex items-center space-x-4 text-muted-foreground text-xs">
                            <span>
                              {collaborator.projects} projects completed
                            </span>
                            <span>Responds in {collaborator.responseTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
