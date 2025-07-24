import React, { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VSCodeHighlighter } from "@/components/VSCodeHighlighter";
import { 
  ArrowLeft, 
  Bug, 
  Clock, 
  Code2,
  GitBranch,
  MessageCircle,
  Eye,
  CheckCircle,
  AlertCircle,
  Play,
  ExternalLink,
  Star,
  Users,
  Calendar,
  Filter,
  Plus
} from "lucide-react";

interface ReviewRequest {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    rank: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Architect';
  };
  repository: string;
  branch: string;
  files: string[];
  language: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Review' | 'Approved' | 'Changes Requested';
  createdAt: string;
  updatedAt: string;
  comments: number;
  linesChanged: number;
  codeSnippet?: {
    file: string;
    code: string;
  };
  reviewers: Array<{
    name: string;
    avatar: string;
    status: 'Pending' | 'Approved' | 'Changes Requested';
  }>;
}

const mockReviewRequests: ReviewRequest[] = [
  {
    id: "1",
    title: "Fix authentication bug in user login flow",
    description: "Users are experiencing intermittent login failures. The issue appears to be related to token refresh logic when multiple tabs are open.",
    author: {
      name: "Sarah Chen",
      username: "sarahbuilds",
      avatar: "/api/placeholder/40/40",
      rank: "Senior"
    },
    repository: "codecave/auth-service",
    branch: "fix/token-refresh",
    files: ["src/auth/tokenManager.ts", "src/middleware/auth.ts", "tests/auth.test.ts"],
    language: "typescript",
    priority: "High",
    status: "Open",
    createdAt: "2h ago",
    updatedAt: "1h ago", 
    comments: 3,
    linesChanged: 45,
    codeSnippet: {
      file: "src/auth/tokenManager.ts",
      code: `class TokenManager {
  private refreshPromise: Promise<string> | null = null;

  async refreshToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh();
    
    try {
      const newToken = await this.refreshPromise;
      this.refreshPromise = null;
      return newToken;
    } catch (error) {
      this.refreshPromise = null;
      throw error;
    }
  }
}`
    },
    reviewers: [
      { name: "Alex Rodriguez", avatar: "/api/placeholder/32/32", status: "Pending" },
      { name: "Marcus Kim", avatar: "/api/placeholder/32/32", status: "Pending" }
    ]
  },
  {
    id: "2", 
    title: "Optimize database queries for user dashboard",
    description: "Dashboard loading times are too slow. Implemented query optimization and added proper indexing.",
    author: {
      name: "Alex Rodriguez",
      username: "alexcodes",
      avatar: "/api/placeholder/40/40",
      rank: "Mid"
    },
    repository: "codecave/dashboard-api",
    branch: "perf/optimize-queries",
    files: ["src/services/userService.ts", "migrations/add-indexes.sql"],
    language: "typescript",
    priority: "Medium",
    status: "In Review",
    createdAt: "4h ago",
    updatedAt: "30m ago",
    comments: 7,
    linesChanged: 23,
    reviewers: [
      { name: "Sarah Chen", avatar: "/api/placeholder/32/32", status: "Approved" },
      { name: "Emma Johnson", avatar: "/api/placeholder/32/32", status: "Changes Requested" }
    ]
  },
  {
    id: "3",
    title: "Add rate limiting to API endpoints",
    description: "Implement rate limiting middleware to prevent API abuse and improve system stability.",
    author: {
      name: "Marcus Kim", 
      username: "markusk",
      avatar: "/api/placeholder/40/40",
      rank: "Lead"
    },
    repository: "codecave/api-gateway",
    branch: "feature/rate-limiting",
    files: ["src/middleware/rateLimit.ts", "src/config/rateLimits.ts", "docs/api-limits.md"],
    language: "typescript",
    priority: "Medium",
    status: "Approved",
    createdAt: "1d ago",
    updatedAt: "6h ago",
    comments: 12,
    linesChanged: 78,
    reviewers: [
      { name: "Sarah Chen", avatar: "/api/placeholder/32/32", status: "Approved" },
      { name: "Alex Rodriguez", avatar: "/api/placeholder/32/32", status: "Approved" }
    ]
  }
];

export default function ReviewRequests() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('');

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Junior': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Mid': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Senior': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Lead': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Architect': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'border-red-500 text-red-400 bg-red-500/10';
      case 'High': return 'border-orange-500 text-orange-400 bg-orange-500/10';
      case 'Medium': return 'border-yellow-500 text-yellow-400 bg-yellow-500/10';
      case 'Low': return 'border-green-500 text-green-400 bg-green-500/10';
      default: return 'border-gray-500 text-gray-400 bg-gray-500/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'border-blue-500 text-blue-400 bg-blue-500/10';
      case 'In Review': return 'border-yellow-500 text-yellow-400 bg-yellow-500/10';
      case 'Approved': return 'border-green-500 text-green-400 bg-green-500/10';
      case 'Changes Requested': return 'border-orange-500 text-orange-400 bg-orange-500/10';
      default: return 'border-gray-500 text-gray-400 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <Clock className="h-3 w-3" />;
      case 'In Review': return <Eye className="h-3 w-3" />;
      case 'Approved': return <CheckCircle className="h-3 w-3" />;
      case 'Changes Requested': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const filteredRequests = mockReviewRequests.filter(request => {
    const matchesTab = activeTab === 'all' || request.status.toLowerCase().replace(' ', '-') === activeTab;
    const matchesPriority = !selectedPriority || request.priority === selectedPriority;
    return matchesTab && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Bug className="h-5 w-5 text-orange-400" />
              <h1 className="text-lg font-semibold">Review Requests</h1>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Request Review
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="space-y-4">
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-3">
                <h2 className="font-semibold text-sm flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-primary" />
                  Filters
                </h2>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                {/* Priority Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <div className="space-y-1">
                    {['Critical', 'High', 'Medium', 'Low'].map((priority) => (
                      <Button
                        key={priority}
                        variant={selectedPriority === priority ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => setSelectedPriority(selectedPriority === priority ? '' : priority)}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          priority === 'Critical' ? 'bg-red-400' :
                          priority === 'High' ? 'bg-orange-400' :
                          priority === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'
                        }`} />
                        {priority}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Open Requests</span>
                    <span className="text-sm font-semibold text-blue-400">{mockReviewRequests.filter(r => r.status === 'Open').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">In Review</span>
                    <span className="text-sm font-semibold text-yellow-400">{mockReviewRequests.filter(r => r.status === 'In Review').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">High Priority</span>
                    <span className="text-sm font-semibold text-orange-400">{mockReviewRequests.filter(r => r.priority === 'High').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All ({mockReviewRequests.length})</TabsTrigger>
                <TabsTrigger value="open">Open ({mockReviewRequests.filter(r => r.status === 'Open').length})</TabsTrigger>
                <TabsTrigger value="in-review">In Review ({mockReviewRequests.filter(r => r.status === 'In Review').length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({mockReviewRequests.filter(r => r.status === 'Approved').length})</TabsTrigger>
                <TabsTrigger value="changes-requested">Changes ({mockReviewRequests.filter(r => r.status === 'Changes Requested').length})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <Card key={request.id} className="border-border/50 bg-card/50 hover:bg-card/70 transition-colors">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold">{request.title}</h3>
                                <Badge variant="outline" className={`text-xs px-2 h-5 ${getPriorityColor(request.priority)}`}>
                                  {request.priority}
                                </Badge>
                                <Badge variant="outline" className={`text-xs px-2 h-5 ${getStatusColor(request.status)}`}>
                                  {getStatusIcon(request.status)}
                                  <span className="ml-1">{request.status}</span>
                                </Badge>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-6 w-6 border border-primary/30">
                                    <AvatarImage src={request.author.avatar} />
                                    <AvatarFallback className="bg-primary/20 text-primary font-mono text-xs">
                                      {request.author.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-mono">@{request.author.username}</span>
                                  <Badge variant="outline" className={`text-[10px] px-1 h-4 ${getRankColor(request.author.rank)}`}>
                                    {request.author.rank}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <GitBranch className="h-3 w-3" />
                                  <span className="font-mono">{request.repository}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{request.createdAt}</span>
                                </div>
                              </div>
                              
                              <p className="text-sm text-muted-foreground leading-relaxed">{request.description}</p>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-2" />
                                Review
                              </Button>
                              <Button size="sm" variant="ghost">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Code Snippet */}
                          {request.codeSnippet && (
                            <Card className="border-l-4 border-l-primary bg-[#1e1e1e]/90">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <Code2 className="h-4 w-4 text-[#cccccc]" />
                                    <span className="text-sm font-medium text-[#cccccc]">{request.codeSnippet.file}</span>
                                  </div>
                                </div>
                                <VSCodeHighlighter 
                                  code={request.codeSnippet.code} 
                                  language={request.language} 
                                />
                              </CardContent>
                            </Card>
                          )}

                          {/* Files and Stats */}
                          <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1">
                                {request.files.slice(0, 3).map((file) => (
                                  <Badge key={file} variant="secondary" className="text-xs font-mono">{file.split('/').pop()}</Badge>
                                ))}
                                {request.files.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">+{request.files.length - 3} more</Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span>{request.linesChanged} lines changed</span>
                                <div className="flex items-center space-x-1">
                                  <MessageCircle className="h-3 w-3" />
                                  <span>{request.comments} comments</span>
                                </div>
                                <span>Updated {request.updatedAt}</span>
                              </div>
                            </div>

                            {/* Reviewers */}
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <div className="flex -space-x-2">
                                {request.reviewers.map((reviewer, index) => (
                                  <Avatar key={index} className="h-6 w-6 border-2 border-background">
                                    <AvatarImage src={reviewer.avatar} />
                                    <AvatarFallback className="bg-primary/20 text-primary font-mono text-xs">
                                      {reviewer.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                            </div>
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
