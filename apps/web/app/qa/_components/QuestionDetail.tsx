"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Terminal,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Bookmark,
  Share2,
  Award,
  Clock,
  Eye,
  CheckCircle,
  Flag,
  Edit,
  Code2,
} from "lucide-react";

export default function QuestionDetail() {
  const { id } = useParams();
  const [questionVotes, setQuestionVotes] = useState(23);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  // Mock question data - in real app, fetch based on id
  const question = {
    id: "1",
    title: "How to optimize React re-renders with large datasets?",
    description: `I'm working on a dashboard application that displays large datasets (10,000+ rows). The performance is suffering due to frequent re-renders when the data updates.

Here's my current implementation:

\`\`\`jsx
const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  
  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.keys(filters).every(key => 
        !filters[key] || item[key] === filters[key]
      );
    });
  }, [data, filters]);

  return (
    <div>
      {filteredData.map(item => (
        <DataRow key={item.id} data={item} />
      ))}
    </div>
  );
};
\`\`\`

I've tried using React.memo on the DataRow component, but it's still not performing well. The issue seems to be that even small filter changes cause the entire list to re-render.

What are the best practices for handling large datasets in React? Should I be looking into virtualization, or are there other optimization techniques I should consider?`,
    author: {
      name: "Emma Johnson",
      username: "emmacreates",
      avatar: "/api/placeholder/40/40",
      reputation: 1250,
      badges: ["React Expert", "Performance Guru"],
    },
    tags: ["react", "performance", "optimization", "hooks"],
    votes: 23,
    views: 1234,
    bounty: 50,
    difficulty: "Intermediate",
    timestamp: "3 hours ago",
    answers: [
      {
        id: "1",
        content: `The main issue with your current approach is that you're rendering all 10,000 rows at once. Here are several optimization strategies:

## 1. Virtual Scrolling

Use a library like \`react-window\` or \`@tanstack/react-virtual\`:

\`\`\`jsx
import { FixedSizeList } from 'react-window';

const VirtualizedList = ({ items }) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={50}
    itemData={items}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <DataRow data={data[index]} />
      </div>
    )}
  </FixedSizeList>
);
\`\`\`

## 2. Pagination

Break your data into chunks:

\`\`\`jsx
const ITEMS_PER_PAGE = 100;

const PaginatedData = () => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const paginatedData = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);
  
  return (
    <>
      {paginatedData.map(item => <DataRow key={item.id} data={item} />)}
      <Pagination />
    </>
  );
};
\`\`\`

## 3. Better Memoization

Optimize your DataRow component:

\`\`\`jsx
const DataRow = React.memo(({ data }) => {
  return <div className="p-2 border-b">{data.name} - {data.value}</div>;
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id &&
         prevProps.data.updatedAt === nextProps.data.updatedAt;
  return prevProps.data.id === nextProps.data.id && 
         prevProps.data.updatedAt === nextProps.data.updatedAt;
});
\`\`\`

Virtual scrolling will give you the biggest performance boost for large datasets.`,
        author: {
          name: "Alex Rodriguez",
          username: "alexcodes",
          avatar: "/api/placeholder/40/40",
          reputation: 3450,
        },
        votes: 45,
        timestamp: "2 hours ago",
        isAccepted: true,
        comments: [
          {
            id: "1",
            content:
              "This is exactly what I needed! The react-window solution worked perfectly.",
            author: "emmacreates",
            timestamp: "1 hour ago",
          },
          {
            id: "2",
            content:
              "Great answer! I'd also recommend looking into react-query for data fetching optimizations.",
            author: "sarahexpert",
            timestamp: "45 minutes ago",
          },
        ],
      },
      {
        id: "2",
        content: `Another approach is to use **windowing** with intersection observer for infinite scrolling:

\`\`\`jsx
const InfiniteList = () => {
  const [visibleItems, setVisibleItems] = useState(50);
  
  const loadMore = useCallback(() => {
    setVisibleItems(prev => prev + 50);
  }, []);
  
  return (
    <>
      {data.slice(0, visibleItems).map(item => 
        <DataRow key={item.id} data={item} />
      )}
      <IntersectionObserver onIntersect={loadMore}>
        <div>Loading...</div>
      </IntersectionObserver>
    </>
  );
};
\`\`\`

This gives you better UX than traditional pagination while keeping performance optimized.`,
        author: {
          name: "Sarah Kim",
          username: "sarahperf",
          avatar: "/api/placeholder/40/40",
          reputation: 2890,
        },
        votes: 23,
        timestamp: "1 hour ago",
        isAccepted: false,
        comments: [],
      },
    ],
  };

  const handleVote = (direction: "up" | "down") => {
    if (userVote === direction) {
      setUserVote(null);
      setQuestionVotes((prev) => (direction === "up" ? prev - 1 : prev + 1));
    } else {
      const prevVote = userVote;
      setUserVote(direction);
      if (prevVote) {
        setQuestionVotes((prev) => (direction === "up" ? prev + 2 : prev - 2));
      } else {
        setQuestionVotes((prev) => (direction === "up" ? prev + 1 : prev - 1));
      }
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="top-0 z-50 sticky bg-background/95 backdrop-blur border-b border-border/50 w-full">
        <div className="flex items-center px-4 h-16 container">
          <div className="flex items-center space-x-4">
            <Link href="/qa">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Q&A
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
        </div>
      </header>

      <div className="mx-auto px-4 py-6 container">
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-12">
          {/* Main Content */}
          <main className="lg:col-span-9">
            {/* Question */}
            <Card className="bg-card/50 mb-6 border-border/50">
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  {/* Vote Section */}
                  <div className="flex flex-col items-center space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${userVote === "up" ? "text-primary" : ""}`}
                      onClick={() => handleVote("up")}
                    >
                      <ArrowUp className="w-5 h-5" />
                    </Button>
                    <span className="font-mono font-bold text-lg">
                      {questionVotes}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${userVote === "down" ? "text-red-400" : ""}`}
                      onClick={() => handleVote("down")}
                    >
                      <ArrowDown className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-0 w-8 h-8">
                      <Bookmark className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Question Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-4">
                      <h1 className="font-bold text-2xl">{question.title}</h1>
                      {question.bounty > 0 && (
                        <Badge
                          variant="outline"
                          className="border-yellow-500 text-yellow-400"
                        >
                          <Award className="mr-1 w-3 h-3" />+{question.bounty}{" "}
                          XP
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 mb-4 text-muted-foreground text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Asked {question.timestamp}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{question.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{question.answers.length} answers</span>
                      </div>
                    </div>

                    <div className="prose-invert mb-6 max-w-none prose">
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {question.description}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {question.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="font-mono text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm">
                          <Share2 className="mr-2 w-4 h-4" />
                          Share
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Flag className="mr-2 w-4 h-4" />
                          Flag
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="mr-2 w-4 h-4" />
                          Edit
                        </Button>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={question.author.avatar} />
                          <AvatarFallback>
                            {question.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium">{question.author.name}</p>
                          <p className="text-muted-foreground">
                            Rep: {question.author.reputation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answers Section */}
            <div className="mb-6">
              <h2 className="mb-4 font-semibold text-xl">
                {question.answers.length} Answers
              </h2>

              {question.answers.map((answer) => (
                <Card
                  key={answer.id}
                  className={`border-border/50 bg-card/50 mb-4 ${answer.isAccepted ? "border-l-4 border-l-green-500" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 w-8 h-8"
                        >
                          <ArrowUp className="w-5 h-5" />
                        </Button>
                        <span className="font-mono font-bold text-lg">
                          {answer.votes}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 w-8 h-8"
                        >
                          <ArrowDown className="w-5 h-5" />
                        </Button>
                        {answer.isAccepted && (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        )}
                      </div>

                      {/* Answer Content */}
                      <div className="flex-1">
                        {answer.isAccepted && (
                          <div className="flex items-center space-x-2 mb-3">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-green-500 text-sm">
                              Accepted Answer
                            </span>
                          </div>
                        )}

                        <div className="prose-invert mb-4 max-w-none prose">
                          <div className="text-sm leading-relaxed whitespace-pre-wrap">
                            {answer.content}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm">
                              <Share2 className="mr-2 w-4 h-4" />
                              Share
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Flag className="mr-2 w-4 h-4" />
                              Flag
                            </Button>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="text-sm text-right">
                              <p className="text-muted-foreground">
                                answered {answer.timestamp}
                              </p>
                            </div>
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={answer.author.avatar} />
                              <AvatarFallback>
                                {answer.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <p className="font-medium">
                                {answer.author.name}
                              </p>
                              <p className="text-muted-foreground">
                                Rep: {answer.author.reputation}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Comments */}
                        {answer.comments.length > 0 && (
                          <div className="pt-4 border-t border-border/50">
                            {answer.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="flex items-start space-x-2 mb-2 text-sm"
                              >
                                <span className="text-muted-foreground">–</span>
                                <div className="flex-1">
                                  <span>{comment.content}</span>
                                  <span className="ml-2 text-muted-foreground">
                                    – {comment.author} {comment.timestamp}
                                  </span>
                                </div>
                              </div>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                            >
                              Add comment
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Answer */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold text-lg">Your Answer</h3>
                <textarea
                  className="bg-background mb-4 p-3 border border-border rounded-md w-full h-48 resize-none"
                  placeholder="Write your answer here..."
                />
                <Button className="neon-glow">
                  <Code2 className="mr-2 w-4 h-4" />
                  Post Your Answer
                </Button>
              </CardContent>
            </Card>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3">
            <div className="top-24 sticky space-y-4">
              {/* Question Stats */}
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <h3 className="mb-3 font-semibold text-sm">Question Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Votes</span>
                      <span className="font-mono">{questionVotes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Views</span>
                      <span className="font-mono">{question.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Answers</span>
                      <span className="font-mono">
                        {question.answers.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bookmarks</span>
                      <span className="font-mono">15</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Questions */}
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <h3 className="mb-3 font-semibold text-sm">
                    Related Questions
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="#"
                      className="block text-primary hover:text-accent text-sm"
                    >
                      React performance optimization techniques
                    </a>
                    <a
                      href="#"
                      className="block text-primary hover:text-accent text-sm"
                    >
                      When to use React.memo vs useMemo
                    </a>
                    <a
                      href="#"
                      className="block text-primary hover:text-accent text-sm"
                    >
                      Virtual scrolling in React applications
                    </a>
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
