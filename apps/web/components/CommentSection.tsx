import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share2,
  Reply,
  MoreHorizontal,
} from "lucide-react";

interface Comment {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
    rank: "Junior" | "Mid" | "Senior" | "Lead" | "Architect";
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
  isLiked?: boolean;
}

interface CommentSectionProps {
  postId: string;
  isExpanded: boolean;
  onToggle: () => void;
  commentCount: number;
}

// Enhanced mock comments with better data
const mockComments: Record<string, Comment[]> = {
  "1": [
    {
      id: "c1",
      author: {
        name: "Alex Rodriguez",
        username: "alexcodes",
        avatar: "/api/placeholder/32/32",
        rank: "Mid",
      },
      content:
        "This implementation looks solid! The operational transformation approach for conflict resolution is exactly what we needed for our collaborative editor. How are you handling the edge cases when users disconnect mid-edit?",
      timestamp: "1h",
      likes: 12,
      replies: [
        {
          id: "c1r1",
          author: {
            name: "Sarah Chen",
            username: "sarahbuilds",
            avatar: "/api/placeholder/32/32",
            verified: true,
            rank: "Senior",
          },
          content:
            "Great question! We maintain a heartbeat system and buffer operations for 30 seconds. If a user disconnects, their pending operations get rolled back gracefully without affecting other users.",
          timestamp: "45m",
          likes: 8,
          replies: [],
        },
      ],
    },
    {
      id: "c2",
      author: {
        name: "Emma Johnson",
        username: "emmacreates",
        avatar: "/api/placeholder/32/32",
        rank: "Junior",
      },
      content:
        "Would love to contribute to this project! I have experience with WebRTC and could help with the real-time sync features. This is exactly the kind of collaborative tool the dev community needs.",
      timestamp: "2h",
      likes: 6,
      replies: [],
    },
    {
      id: "c3",
      author: {
        name: "Marcus Kim",
        username: "markusk",
        avatar: "/api/placeholder/32/32",
        verified: true,
        rank: "Lead",
      },
      content:
        "Impressive work! Have you considered implementing differential synchronization as a fallback? It could help with larger files where operational transformation becomes computationally expensive.",
      timestamp: "3h",
      likes: 15,
      replies: [],
    },
  ],
  "2": [
    {
      id: "c4",
      author: {
        name: "David Wilson",
        username: "devdavid",
        avatar: "/api/placeholder/32/32",
        rank: "Senior",
      },
      content:
        "This monitoring tool could be game-changing for our K8s clusters. The Prometheus integration looks clean. Are you planning to add custom alerting rules?",
      timestamp: "2h",
      likes: 4,
      replies: [],
    },
  ],
};

export function CommentSection({
  postId,
  isExpanded,
  onToggle,
  commentCount,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const comments = mockComments[postId] || [];

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

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment("");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmitReply = (commentId: string) => {
    if (replyText.trim()) {
      // Add reply logic here
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const toggleCommentLike = (commentId: string) => {
    const newLiked = new Set(likedComments);
    if (likedComments.has(commentId)) {
      newLiked.delete(commentId);
    } else {
      newLiked.add(commentId);
    }
    setLikedComments(newLiked);
  };

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="px-2 h-8 text-muted-foreground hover:text-foreground transition-colors"
        onClick={onToggle}
      >
        <MessageCircle className="mr-2 w-4 h-4" />
        <span className="font-mono">{commentCount}</span>
      </Button>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* Comment toggle button */}
      <Button
        variant="ghost"
        size="sm"
        className="px-2 h-8 text-primary hover:text-primary/80 transition-colors"
        onClick={onToggle}
      >
        <MessageCircle className="fill-current mr-2 w-4 h-4" />
        <span className="font-mono">{commentCount} comments</span>
      </Button>

      {/* New comment input */}
      <Card className="bg-muted/20 border-border/30">
        <CardContent className="p-3">
          <div className="flex space-x-3">
            <Avatar className="border border-primary/30 w-8 h-8">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback className="bg-primary/20 font-mono text-primary text-xs">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Input
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-background/50 focus:bg-background border-0 focus:ring-1 focus:ring-primary/30 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleSubmitComment();
                  }
                }}
              />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-xs">
                  ⌘+Enter to post
                </span>
                <Button
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="bg-primary hover:bg-primary/90 h-7 text-primary-foreground"
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            {/* Main comment */}
            <div className="flex space-x-3">
              <Avatar className="border border-primary/30 w-9 h-9">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback className="bg-primary/20 font-mono text-primary text-xs">
                  {comment.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <Card className="bg-background/50 border-border/30">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-sm">
                        {comment.author.name}
                      </span>
                      {comment.author.verified && (
                        <Badge
                          variant="secondary"
                          className="px-1 h-3 text-[10px]"
                        >
                          ✓
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1 h-4 ${getRankColor(comment.author.rank)}`}
                      >
                        {comment.author.rank}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        @{comment.author.username}
                      </span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-muted-foreground text-xs">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-foreground text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </CardContent>
                </Card>

                {/* Comment actions */}
                <div className="flex items-center space-x-4 mt-2 ml-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 px-2 transition-colors ${
                      likedComments.has(comment.id)
                        ? "text-red-400 hover:text-red-300"
                        : "text-muted-foreground hover:text-red-400"
                    }`}
                    onClick={() => toggleCommentLike(comment.id)}
                  >
                    <Heart
                      className={`h-3 w-3 mr-1 ${likedComments.has(comment.id) ? "fill-current" : ""}`}
                    />
                    <span className="font-mono text-xs">
                      {comment.likes + (likedComments.has(comment.id) ? 1 : 0)}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2 h-6 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === comment.id ? null : comment.id
                      )
                    }
                  >
                    <Reply className="mr-1 w-3 h-3" />
                    <span className="text-xs">Reply</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2 h-6 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Share2 className="mr-1 w-3 h-3" />
                    <span className="text-xs">Share</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-1 h-6 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </div>

                {/* Reply input */}
                {replyingTo === comment.id && (
                  <Card className="bg-muted/10 mt-3 ml-3 border-border/30">
                    <CardContent className="p-3">
                      <div className="flex space-x-2">
                        <Avatar className="border border-primary/30 w-6 h-6">
                          <AvatarImage src="/api/placeholder/24/24" />
                          <AvatarFallback className="bg-primary/20 font-mono text-[10px] text-primary">
                            JD
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder={`Reply to ${comment.author.name}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="bg-background/50 border-0 focus:ring-1 focus:ring-primary/30 text-sm"
                            autoFocus
                          />
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setReplyingTo(null)}
                              className="px-3 h-7 text-xs"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSubmitReply(comment.id)}
                              disabled={!replyText.trim()}
                              className="bg-primary hover:bg-primary/90 px-3 h-7 text-primary-foreground text-xs"
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="space-y-3 mt-3 ml-6">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex space-x-3">
                        <Avatar className="border border-primary/30 w-7 h-7">
                          <AvatarImage src={reply.author.avatar} />
                          <AvatarFallback className="bg-primary/20 font-mono text-[10px] text-primary">
                            {reply.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <Card className="bg-background/30 border-border/30">
                            <CardContent className="p-2">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold text-xs">
                                  {reply.author.name}
                                </span>
                                {reply.author.verified && (
                                  <Badge
                                    variant="secondary"
                                    className="px-1 h-3 text-[8px]"
                                  >
                                    ✓
                                  </Badge>
                                )}
                                <Badge
                                  variant="outline"
                                  className={`text-[8px] px-1 h-3 ${getRankColor(reply.author.rank)}`}
                                >
                                  {reply.author.rank}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">
                                  @{reply.author.username}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  •
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {reply.timestamp}
                                </span>
                              </div>
                              <p className="text-xs leading-relaxed">
                                {reply.content}
                              </p>
                            </CardContent>
                          </Card>
                          <div className="flex items-center space-x-3 mt-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-5 px-1 transition-colors ${
                                likedComments.has(reply.id)
                                  ? "text-red-400 hover:text-red-300"
                                  : "text-muted-foreground hover:text-red-400"
                              }`}
                              onClick={() => toggleCommentLike(reply.id)}
                            >
                              <Heart
                                className={`h-2 w-2 mr-1 ${likedComments.has(reply.id) ? "fill-current" : ""}`}
                              />
                              <span className="font-mono text-[10px]">
                                {reply.likes +
                                  (likedComments.has(reply.id) ? 1 : 0)}
                              </span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="px-1 h-5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Reply className="mr-1 w-2 h-2" />
                              <span className="text-[10px]">Reply</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
