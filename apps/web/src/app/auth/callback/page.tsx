"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function AuthCallback() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    // Wait for session to load
    if (isPending) return;

    // If we have a session, redirect to home/dashboard
    if (session) {
      router.replace("/home");
      return;
    }

    // If no session after a reasonable time, redirect to login
    const timeout = setTimeout(() => {
      router.replace("/?error=auth_failed");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}