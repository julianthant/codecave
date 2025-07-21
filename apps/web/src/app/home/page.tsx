"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function Dashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center bg-background min-h-screen">
        <div className="text-center">
          <div className="mx-auto border-primary border-b-2 rounded-full w-8 h-8 animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Redirecting...
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto py-8 container">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 font-bold text-3xl">Welcome to CodeCave!</h1>

          <div className="bg-surface p-6 border border-border rounded-lg">
            <h2 className="mb-4 font-semibold text-xl">Your Profile</h2>

            <div className="flex items-center space-x-4 mb-4">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{session.user.name}</p>
                <p className="text-muted-foreground text-sm">
                  {session.user.email}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-2 font-medium text-lg">Session Info</h3>
              <div className="space-y-1 text-muted-foreground text-sm">
                <p>User ID: {session.user.id}</p>
                <p>
                  Email Verified: {session.user.emailVerified ? "Yes" : "No"}
                </p>
                <p>
                  Created:{" "}
                  {new Date(session.user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => (window.location.href = "/api/auth/sign-out")}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
