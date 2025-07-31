import { createClient } from "@/utils/supabase/server";
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

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Base query
    let postsQuery = supabase
      .from("posts")
      .select(
        `
        *,
        user:users!user_id (
          id,
          username,
          display_name,
          avatar_url,
          is_pro
        ),
        likes:likes(count),
        user_liked:likes!left(user_id)
      `
      )
      .eq("is_published", true)
      .limit(query.limit)
      .range(query.page * query.limit, (query.page + 1) * query.limit - 1);

    // Apply filters
    if (query.languages) {
      const languages = query.languages.split(",");
      postsQuery = postsQuery.contains("tags", languages);
    }

    if (query.tags) {
      const tags = query.tags.split(",");
      postsQuery = postsQuery.contains("tags", tags);
    }

    if (query.postTypes) {
      const types = query.postTypes.split(",");
      postsQuery = postsQuery.in("type", types);
    }

    // Apply time range filter
    if (query.timeRange && query.timeRange !== "all") {
      const hoursMap = {
        "24h": 24,
        "7d": 24 * 7,
        "30d": 24 * 30,
      };
      const hours = hoursMap[query.timeRange];
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
      postsQuery = postsQuery.gte("published_at", since);
    }

    // Apply search
    if (query.search) {
      postsQuery = postsQuery.textSearch("search_vector", query.search);
    }

    // Apply algorithm-specific ordering
    switch (query.algorithm) {
      case "following":
        if (!user) {
          return NextResponse.json({ posts: [], hasMore: false });
        }
        // Get following list
        const { data: following } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", user.id);

        const followingIds = following?.map((f) => f.following_id) || [];
        if (followingIds.length === 0) {
          return NextResponse.json({ posts: [], hasMore: false });
        }

        postsQuery = postsQuery
          .in("user_id", followingIds)
          .order("published_at", { ascending: false });
        break;

      case "trending":
        // Calculate trending score
        postsQuery = postsQuery
          .order("like_count", { ascending: false })
          .order("comment_count", { ascending: false })
          .order("published_at", { ascending: false });
        break;

      case "latest":
        postsQuery = postsQuery.order("published_at", { ascending: false });
        break;

      case "showcase":
        postsQuery = postsQuery
          .eq("type", "showcase")
          .order("published_at", { ascending: false });
        break;

      case "collaborations":
        postsQuery = postsQuery
          .eq("type", "collaboration")
          .order("published_at", { ascending: false });
        break;

      default: // 'algorithm'
        // For now, use a simple algorithm
        // In production, this would be more sophisticated
        postsQuery = postsQuery.order("published_at", { ascending: false });
    }

    const { data: posts, error } = await postsQuery;

    if (error) {
      console.error("Feed error:", error);
      return NextResponse.json(
        { error: "Failed to fetch posts" },
        { status: 500 }
      );
    }

    // Process posts to add user_liked flag
    const processedPosts =
      posts?.map((post) => ({
        ...post,
        user_liked: user
          ? post.user_liked?.some((like: any) => like.user_id === user.id)
          : false,
        likes: post.likes?.[0]?.count || 0,
      })) || [];

    // Determine if there are more posts
    const hasMore = processedPosts.length === query.limit;

    return NextResponse.json({
      posts: processedPosts,
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
