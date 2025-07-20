"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

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

            if (!response.ok) {
              throw new Error("Failed to authenticate with API");
            }

            const result = await response.json();

            // Store your app's tokens
            if (result.tokens) {
              localStorage.setItem("accessToken", result.tokens.accessToken);
              localStorage.setItem("refreshToken", result.tokens.refreshToken);
            }

            // Redirect to home/dashboard
            router.push("/home");
          } catch (apiError) {
            console.error("API authentication error:", apiError);
            router.push(
              `/?error=${encodeURIComponent("Authentication with server failed")}`
            );
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
