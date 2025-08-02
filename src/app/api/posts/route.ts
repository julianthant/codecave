import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().default(0),
  limit: z.coerce.number().min(1).max(50).default(20),
  algorithm: z
    .enum([
      "algorithm",
      "following",
      "trending",
      "latest",
      "showcase",
      "collaborations",
    ])
    .default("algorithm"),
  languages: z.string().optional(),
  tags: z.string().optional(),
  postTypes: z.string().optional(),
  timeRange: z.enum(["24h", "7d", "30d", "all"]).optional(),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = querySchema.parse(searchParams);

    // Return mock data for testing
    const mockPosts = [
      {
        id: "1",
        title: "Building a Modern React Component Library",
        type: "article",
        content: "Learn how to create reusable components with TypeScript and Tailwind CSS",
        published_at: new Date().toISOString(),
        like_count: 15,
        comment_count: 3,
        view_count: 120,
        tags: ["react", "typescript", "tailwind"],
        blocks: [
          {
            type: "text",
            content: "In this article, we'll explore how to build a modern React component library using TypeScript and Tailwind CSS. We'll cover best practices for component design, documentation, and testing."
          },
          {
            type: "code",
            content: {
              language: "typescript",
              code: "interface ButtonProps {\n  variant: 'primary' | 'secondary';\n  size: 'sm' | 'md' | 'lg';\n  children: React.ReactNode;\n}\n\nexport const Button = ({ variant, size, children }: ButtonProps) => {\n  return (\n    <button className={`btn btn-${variant} btn-${size}`}>\n      {children}\n    </button>\n  );\n};",
              filename: "Button.tsx"
            }
          }
        ],
        user: {
          id: "user1",
          username: "alexdev",
          display_name: "Alex Developer",
          avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          is_pro: true
        },
        likes: 15,
        user_liked: false
      },
      {
        id: "2",
        title: "Looking for Frontend Developer - AI Startup",
        type: "collaboration",
        content: "We're building the next generation of AI tools and need a skilled React developer",
        published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        like_count: 8,
        comment_count: 12,
        view_count: 89,
        tags: ["job", "react", "ai", "startup"],
        blocks: [
          {
            type: "text",
            content: "We're a stealth-mode AI startup looking for a talented frontend developer to join our team. You'll be working on cutting-edge AI interfaces and user experiences."
          },
          {
            type: "collaborator",
            content: {
              requirements: ["3+ years React experience", "TypeScript proficiency", "UI/UX design sense"],
              skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
              timeline: "3-6 months",
              budget_range: "$50-80/hour",
              contact_method: "DM on platform"
            }
          }
        ],
        user: {
          id: "user2",
          username: "sarahceo",
          display_name: "Sarah Chen",
          avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          is_pro: false
        },
        likes: 8,
        user_liked: false
      },
      {
        id: "3",
        title: "My Personal Portfolio Website",
        type: "showcase",
        content: "Built with Next.js 14, Tailwind CSS, and Framer Motion",
        published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        like_count: 24,
        comment_count: 7,
        view_count: 203,
        tags: ["nextjs", "portfolio", "tailwind", "framer-motion"],
        blocks: [
          {
            type: "text",
            content: "I just finished rebuilding my portfolio website from scratch. It features smooth animations, dark mode support, and a clean, minimal design. Check it out and let me know what you think!"
          }
        ],
        user: {
          id: "user3",
          username: "mikecodes",
          display_name: "Mike Rodriguez",
          avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          is_pro: false
        },
        likes: 24,
        user_liked: false
      },
      {
        id: "4",
        title: "Quick CSS Grid Snippet",
        type: "snippet",
        content: "Responsive grid layout with auto-fit columns",
        published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        like_count: 31,
        comment_count: 5,
        view_count: 156,
        tags: ["css", "grid", "responsive"],
        blocks: [
          {
            type: "text",
            content: "Here's a handy CSS Grid snippet for creating responsive layouts that automatically adjust the number of columns based on available space."
          },
          {
            type: "code",
            content: {
              language: "css",
              code: ".grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1rem;\n  padding: 1rem;\n}\n\n.grid-item {\n  background: #f0f0f0;\n  padding: 1rem;\n  border-radius: 8px;\n}",
              filename: "responsive-grid.css"
            }
          }
        ],
        user: {
          id: "user4",
          username: "cssguru",
          display_name: "CSS Guru",
          avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
          is_pro: true
        },
        likes: 31,
        user_liked: false
      }
    ];

    // Filter posts based on query parameters
    let filteredPosts = mockPosts;

    if (query.postTypes) {
      const types = query.postTypes.split(",");
      filteredPosts = filteredPosts.filter(post => types.includes(post.type));
    }

    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply pagination
    const startIndex = query.page * query.limit;
    const endIndex = startIndex + query.limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    // Sort based on algorithm
    switch (query.algorithm) {
      case "trending":
        paginatedPosts.sort((a, b) => b.like_count - a.like_count);
        break;
      case "latest":
        paginatedPosts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
        break;
      default:
        // Keep default order
        break;
    }

    const hasMore = endIndex < filteredPosts.length;

    return NextResponse.json({
      posts: paginatedPosts,
      hasMore,
      page: query.page,
    });
  } catch (error) {
    console.error("Feed error:", error);
    return NextResponse.json(
      { error: "Invalid request parameters" },
      { status: 400 }
    );
  }
}
