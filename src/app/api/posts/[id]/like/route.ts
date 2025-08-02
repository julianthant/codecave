import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Insert like
    const { error: likeError } = await supabase
      .from("likes")
      .insert({
        user_id: user.id,
        post_id: id,
      });

    if (likeError) {
      // Check if it's a duplicate key error (user already liked this post)
      if (likeError.code === "23505") {
        return NextResponse.json(
          { error: "Post already liked" },
          { status: 409 }
        );
      }
      throw likeError;
    }

    // Update post like count
    const { error: updateError } = await supabase.rpc("increment_like_count", {
      post_id: id,
    });

    if (updateError) {
      console.error("Failed to update like count:", updateError);
      // Don't fail the request, just log the error
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { error: "Failed to like post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete like
    const { error: deleteError } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("post_id", id);

    if (deleteError) {
      throw deleteError;
    }

    // Update post like count
    const { error: updateError } = await supabase.rpc("decrement_like_count", {
      post_id: id,
    });

    if (updateError) {
      console.error("Failed to update like count:", updateError);
      // Don't fail the request, just log the error
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unlike error:", error);
    return NextResponse.json(
      { error: "Failed to unlike post" },
      { status: 500 }
    );
  }
}