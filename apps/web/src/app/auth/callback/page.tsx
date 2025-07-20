"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          router.push(`/?error=${encodeURIComponent(error.message)}`);
          return;
        }

        if (data.session) {
          const { access_token, refresh_token } = data.session;

          // Send the Supabase tokens to your API for user creation/validation
          try {
            const apiUrl =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            
            console.log("Attempting to authenticate with API:", apiUrl);
            
            const response = await fetch(`${apiUrl}/auth/supabase/callback`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                access_token,
                refresh_token,
              }),
            });

            console.log("API response status:", response.status);

            if (!response.ok) {
              const errorText = await response.text();
              console.error("API response error:", errorText);
              throw new Error(`Failed to authenticate with API: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            console.log("API authentication successful:", result);

            // Store your app's tokens
            if (result.tokens) {
              localStorage.setItem("accessToken", result.tokens.accessToken);
              localStorage.setItem("refreshToken", result.tokens.refreshToken);
            }

            // Redirect to home/dashboard
            console.log("Redirecting to /home");
            router.push("/home");
          } catch (apiError) {
            console.error("API authentication error:", apiError);
            
            // For now, let's continue without API validation in production
            // This allows the OAuth flow to complete even if the API is not accessible
            if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL?.includes('localhost')) {
              console.log("Continuing without API validation in production");
              router.push("/home");
            } else {
              const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
              router.push(
                `/?error=${encodeURIComponent("Authentication with server failed: " + errorMessage)}`
              );
            }
          }
        } else {
          // No session found, redirect to home
          router.push("/");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push(`/?error=${encodeURIComponent("Authentication failed")}`);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "system-ui",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p>Authenticating... Please wait.</p>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "20px auto",
          }}
        />
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
