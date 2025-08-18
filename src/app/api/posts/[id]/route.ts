import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: post, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        user:users!user_id (
          id,
          username,
          display_name,
          avatar_url,
          banner_url,
          bio,
          is_pro,
          github_username,
          twitter_username,
          reputation_score
        ),
        likes:likes(count),
        user_liked:likes!left(user_id),
        comments:comments(count)
      `
      )
      .eq("id", id)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if post is published or user owns it
    if (!post.is_published && post.user_id !== user?.id) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Process post to add computed fields
    const processedPost = {
      ...post,
      user_liked: user
        ? post.user_liked?.some((like: { user_id: string }) => like.user_id === user.id)
        : false,
      likes: post.likes?.[0]?.count || 0,
      comments: post.comments?.[0]?.count || 0,
    };

    // Increment view count if viewing someone else's post and user is logged in
    if (user && user.id !== post.user_id) {
      // First check if user has already viewed this post recently
      const hasViewed = post.unique_viewers?.includes(user.id);
      
      if (!hasViewed) {
        // Update view count and add to unique viewers
        const newUniqueViewers = [...(post.unique_viewers || []), user.id];
        
        await supabase
          .from("posts")
          .update({
            view_count: post.view_count + 1,
            unique_viewers: newUniqueViewers
          })
          .eq("id", id);
          
        // Update the response data
        processedPost.view_count = post.view_count + 1;
        processedPost.unique_viewers = newUniqueViewers;
      }
    }

    return NextResponse.json(processedPost);
  } catch (error) {
    console.error("Get post error:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}