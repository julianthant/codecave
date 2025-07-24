import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ size: string[] }> },
) {
  try {
    const { size } = await params;
    const [width, height] = size;
    const w = parseInt(width) || 40;
    const h = parseInt(height) || 40;

    // Redirect to a placeholder service
    const url = `https://via.placeholder.com/${w}x${h}/374151/9ca3af?text=User`;

    return NextResponse.redirect(url);
  } catch (error) {
    // Fallback to a default placeholder
    return NextResponse.redirect(
      "https://via.placeholder.com/40x40/374151/9ca3af?text=User",
    );
  }
}
