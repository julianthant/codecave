"use client";

import { useState } from "react";
import { Code2, Loader2 } from "lucide-react";
import { signIn } from "../../lib/auth-client";
import * as Sentry from "@sentry/nextjs";

type OAuthProvider = "github" | "google";

interface OAuthProviderConfig {
  name: string;
  provider: OAuthProvider;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const oauthProviders: OAuthProviderConfig[] = [
  {
    name: "GitHub",
    provider: "github",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    description: "git clone name@github.com",
    color: "hover:text-foreground",
  },
  {
    name: "Google",
    provider: "google",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
    description: 'import { user } from "google"',
    color: "hover:text-code-function",
  },
];

const OAuthButtons: React.FC = () => {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleOAuthClick = async (provider: OAuthProvider) => {
    // Reset any previous errors
    setError(null);
    setLoadingProvider(provider);

    try {
      // Create a span for performance monitoring
      await Sentry.startSpan(
        {
          op: "auth.oauth",
          name: `OAuth Sign In - ${provider}`,
        },
        async (span) => {
          // Add attributes for monitoring
          span.setAttribute("provider", provider);
          span.setAttribute(
            "callbackURL",
            `${window.location.origin}/auth/callback`
          );

          const data = await signIn.social({
            provider,
            callbackURL: `${window.location.origin}/auth/callback`,
          });

          if (data.error) {
            span.setAttribute("error", true);
            span.setAttribute(
              "errorMessage",
              data.error.message || "Unknown error"
            );
            throw new Error(data.error.message || "Authentication failed");
          }

          span.setAttribute("success", true);
          return data;
        }
      );

      // If we reach here, authentication started successfully
      // The user will be redirected, so we don't need to clear loading state
    } catch (error) {
      // Log error to Sentry
      Sentry.captureException(error, {
        tags: {
          section: "oauth",
          provider,
        },
        contexts: {
          oauth: {
            provider,
            callbackURL: `${window.location.origin}/auth/callback`,
          },
        },
      });

      console.error(`OAuth ${provider} error:`, error);
      setError(`Authentication with ${provider} failed. Please try again.`);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 px-4 py-3 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* OAuth Provider Buttons */}
      {oauthProviders.map((providerConfig) => {
        const isLoading = loadingProvider === providerConfig.provider;
        const isDisabled = loadingProvider !== null;

        return (
          <button
            key={providerConfig.provider}
            className={`
              group justify-start bg-surface/50 hover:bg-surface hover:shadow-lg 
              p-4 border border-border/50 hover:border-border rounded-lg w-full h-auto 
              hover:scale-[1.02] transition-all duration-200
              ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}
              ${isLoading ? "bg-surface border-primary" : ""}
            `}
            onClick={() => handleOAuthClick(providerConfig.provider)}
            disabled={isDisabled}
          >
            <div className="flex items-center space-x-3 w-full">
              <div className={`${providerConfig.color} transition-colors`}>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  providerConfig.icon
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-mono font-medium text-foreground group-hover:text-primary text-sm transition-colors">
                  {isLoading
                    ? `Connecting to ${providerConfig.name}...`
                    : providerConfig.name}
                </div>
                <div className="font-mono text-muted-foreground text-xs">
                  {providerConfig.description}
                </div>
              </div>
              <Code2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </button>
        );
      })}

      {/* Security Notice */}
      <div className="pt-2 text-center">
        <p className="font-mono text-muted-foreground text-xs">
          <span className="text-code-comment">{`// Secure OAuth 2.0 - No passwords stored`}</span>
        </p>
      </div>
    </div>
  );
};

export default OAuthButtons;
