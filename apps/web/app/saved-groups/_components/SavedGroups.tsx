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
  MessageCircle,
  Lock,
  Globe,
  Plus,
  Bookmark,
  BookmarkCheck,
  Filter,
  Grid,
  List,
  Settings,
  Eye,
  UserPlus,
} from "lucide-react";

interface SavedGroup {
  id: string;
  name: string;
  description: string;
  avatar: string;
  coverImage?: string;
  memberCount: number;
  postCount: number;
  category: string;
  privacy: "Public" | "Private";
  activity: "High" | "Medium" | "Low";
  joinedDate: string;
  lastActivity: string;
  tags: string[];
  isSaved: boolean;
  isJoined: boolean;
  admins: Array<{
    name: string;
    avatar: string;
  }>;
}

const mockSavedGroups: SavedGroup[] = [
  {
    id: "1",
    name: "React Developers",
    description:
      "A community for React.js developers to share knowledge, best practices, and build amazing applications together.",
    avatar: "/api/placeholder/64/64",
    coverImage: "/api/placeholder/400/200",
    memberCount: 15420,
    postCount: 1234,
    category: "Frontend",
    privacy: "Public",
    activity: "High",
    joinedDate: "3 months ago",
    lastActivity: "2 hours ago",
    tags: ["React", "JavaScript", "Frontend", "Web Development"],
    isSaved: true,
    isJoined: true,
    admins: [
      { name: "Sarah Chen", avatar: "/api/placeholder/32/32" },
      { name: "Alex Rodriguez", avatar: "/api/placeholder/32/32" },
    ],
  },
  {
    id: "2",
    name: "AI & Machine Learning",
    description:
      "Discuss the latest trends in AI, share research papers, and collaborate on ML projects.",
    avatar: "/api/placeholder/64/64",
    memberCount: 8940,
    postCount: 567,
    category: "AI/ML",
    privacy: "Public",
    activity: "High",
    joinedDate: "6 months ago",
    lastActivity: "4 hours ago",
    tags: ["AI", "Machine Learning", "Deep Learning", "Python"],
    isSaved: true,
    isJoined: true,
    admins: [{ name: "Marcus Kim", avatar: "/api/placeholder/32/32" }],
  },
  {
    id: "3",
    name: "DevOps Engineers",
    description:
      "Best practices for CI/CD, infrastructure as code, monitoring, and cloud technologies.",
    avatar: "/api/placeholder/64/64",
    memberCount: 6780,
    postCount: 890,
    category: "DevOps",
    privacy: "Public",
    activity: "Medium",
    joinedDate: "2 months ago",
    lastActivity: "1 day ago",
    tags: ["DevOps", "CI/CD", "AWS", "Kubernetes", "Docker"],
    isSaved: true,
    isJoined: false,
    admins: [{ name: "Emma Johnson", avatar: "/api/placeholder/32/32" }],
  },
  {
    id: "4",
    name: "Startup Founders",
    description:
      "Private group for tech startup founders to discuss challenges, share resources, and network.",
    avatar: "/api/placeholder/64/64",
    memberCount: 2340,
    postCount: 456,
    category: "Business",
    privacy: "Private",
    activity: "Medium",
    joinedDate: "1 month ago",
    lastActivity: "3 days ago",
    tags: ["Startup", "Entrepreneurship", "Business", "Networking"],
    isSaved: true,
    isJoined: true,
    admins: [{ name: "David Wilson", avatar: "/api/placeholder/32/32" }],
  },
  {
    id: "5",
    name: "Rust Programming",
    description:
      "Learn Rust, share code, and discuss systems programming with the Rust community.",
    avatar: "/api/placeholder/64/64",
    memberCount: 4560,
    postCount: 234,
    category: "Programming",
    privacy: "Public",
    activity: "Low",
    joinedDate: "2 weeks ago",
    lastActivity: "1 week ago",
    tags: ["Rust", "Systems Programming", "Performance", "Memory Safety"],
    isSaved: true,
    isJoined: false,
    admins: [{ name: "Alexis Taylor", avatar: "/api/placeholder/32/32" }],
  },
];

export default function SavedGroups() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [activeTab, setActiveTab] = useState("joined");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [groups, setGroups] = useState(mockSavedGroups);

  const categories = Array.from(
    new Set(mockSavedGroups.map((g) => g.category))
  );

  const toggleSaved = (groupId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId ? { ...group, isSaved: !group.isSaved } : group
      )
    );
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case "High":
        return "text-green-400";
      case "Medium":
        return "text-yellow-400";
      case "Low":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      !selectedCategory || group.category === selectedCategory;

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "joined" && group.isJoined) ||
      (activeTab === "saved" && group.isSaved);

    return matchesSearch && matchesCategory && matchesTab;
  });

  const GridView = () => (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {filteredGroups.map((group) => (
        <Card
          key={group.id}
          className="bg-card/50 hover:bg-card/70 border-border/50 overflow-hidden transition-colors"
        >
          {group.coverImage && (
            <div className="relative bg-gradient-to-r from-primary/20 to-accent/20 h-32">
              <div className="top-2 right-2 absolute flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-background/80 hover:bg-background p-0 w-8 h-8"
                  onClick={() => toggleSaved(group.id)}
                >
                  {group.isSaved ? (
                    <BookmarkCheck className="w-4 h-4 text-accent" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          <CardContent className="p-4">
            <div className="flex items-start space-x-3 mb-3">
              <Avatar className="border-2 border-primary/30 w-12 h-12">
                <AvatarImage src={group.avatar} />
                <AvatarFallback className="bg-primary/20 font-mono text-primary">
                  {group.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold truncate">{group.name}</h3>
                  {group.privacy === "Private" ? (
                    <Lock className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <Globe className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {group.category}
                </Badge>
              </div>
            </div>

            <p className="mb-3 text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {group.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              {group.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {group.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{group.tags.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex justify-between items-center mb-3 text-muted-foreground text-xs">
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{group.memberCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>{group.postCount}</span>
              </div>
              <div
                className={`flex items-center space-x-1 ${getActivityColor(group.activity)}`}
              >
                <div className="bg-current rounded-full w-2 h-2" />
                <span>{group.activity}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              {group.isJoined ? (
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <Settings className="mr-1 w-3 h-3" />
                  Manage
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                >
                  <UserPlus className="mr-1 w-3 h-3" />
                  Join
                </Button>
              )}
              <Button size="sm" variant="outline" className="text-xs">
                <Eye className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-3">
      {filteredGroups.map((group) => (
        <Card
          key={group.id}
          className="bg-card/50 hover:bg-card/70 border-border/50 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="border-2 border-primary/30 w-16 h-16">
                <AvatarImage src={group.avatar} />
                <AvatarFallback className="bg-primary/20 font-mono text-primary">
                  {group.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold">{group.name}</h3>
                  {group.privacy === "Private" ? (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Globe className="w-4 h-4 text-muted-foreground" />
                  )}
                  <Badge variant="outline" className="text-xs">
                    {group.category}
                  </Badge>
                  <div
                    className={`flex items-center space-x-1 text-xs ${getActivityColor(group.activity)}`}
                  >
                    <div className="bg-current rounded-full w-2 h-2" />
                    <span>{group.activity} activity</span>
                  </div>
                </div>

                <p className="mb-2 text-muted-foreground text-sm line-clamp-1">
                  {group.description}
                </p>

                <div className="flex items-center space-x-6 text-muted-foreground text-xs">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{group.memberCount.toLocaleString()} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{group.postCount} posts</span>
                  </div>
                  <span>Joined {group.joinedDate}</span>
                  <span>Active {group.lastActivity}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 w-8 h-8"
                  onClick={() => toggleSaved(group.id)}
                >
                  {group.isSaved ? (
                    <BookmarkCheck className="w-4 h-4 text-accent" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </Button>

                {group.isJoined ? (
                  <Button size="sm" variant="outline">
                    <Settings className="mr-2 w-3 h-3" />
                    Manage
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <UserPlus className="mr-2 w-3 h-3" />
                    Join Group
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="top-0 z-50 sticky bg-background shadow-sm border-b border-border w-full">
        <div className="flex justify-between items-center mx-auto px-4 max-w-7xl h-14">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-accent" />
              <h1 className="font-semibold text-lg">Saved Groups</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? (
                <List className="w-4 h-4" />
              ) : (
                <Grid className="w-4 h-4" />
              )}
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 w-4 h-4" />
              Create Group
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 py-6 max-w-7xl">
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
                  <label className="font-medium text-sm">Search Groups</label>
                  <div className="relative">
                    <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                    <Input
                      placeholder="Search by name or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <label className="font-medium text-sm">Categories</label>
                  <div className="space-y-1">
                    <Button
                      variant={!selectedCategory ? "default" : "ghost"}
                      size="sm"
                      className="justify-start w-full text-xs"
                      onClick={() => setSelectedCategory("")}
                    >
                      All Categories
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={
                          selectedCategory === category ? "default" : "ghost"
                        }
                        size="sm"
                        className="justify-start w-full text-xs"
                        onClick={() =>
                          setSelectedCategory(
                            selectedCategory === category ? "" : category
                          )
                        }
                      >
                        {category}
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
                      Total Saved
                    </span>
                    <span className="font-semibold text-accent text-sm">
                      {groups.filter((g) => g.isSaved).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">
                      Joined Groups
                    </span>
                    <span className="font-semibold text-primary text-sm">
                      {groups.filter((g) => g.isJoined).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">
                      High Activity
                    </span>
                    <span className="font-semibold text-green-400 text-sm">
                      {groups.filter((g) => g.activity === "High").length}
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
                  All Groups ({groups.length})
                </TabsTrigger>
                <TabsTrigger value="joined">
                  Joined ({groups.filter((g) => g.isJoined).length})
                </TabsTrigger>
                <TabsTrigger value="saved">
                  Saved ({groups.filter((g) => g.isSaved).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {viewMode === "grid" ? <GridView /> : <ListView />}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
