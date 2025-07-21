import { redirect } from "next/navigation";

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = "force-dynamic";

interface AuthCallbackProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AuthCallback({
  searchParams,
}: AuthCallbackProps) {
  // Await searchParams in Next.js 15
  const params = await searchParams;

  // Check for error in search params
  const error = params.error;

  if (error) {
    // Redirect to home with error message
    redirect(`/?error=${encodeURIComponent("Authentication failed")}`);
  }

  // For successful authentication, redirect to home
  // Better Auth handles the callback automatically via the API route
  redirect("/home");
}
