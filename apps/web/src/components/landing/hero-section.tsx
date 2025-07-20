import OAuthButtons from "./oauth-buttons";

const HeroSection = () => {
  return (
    <section className="relative flex items-center bg-background pt-12 min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 opacity-10">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124, 58, 237, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124, 58, 237, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="z-10 relative mx-auto px-6 container">
        <div className="items-center gap-8 lg:gap-16 grid grid-cols-1 lg:grid-cols-5">
          {/* Left Column - Value Proposition (60%) */}
          <div className="space-y-8 order-2 lg:order-1 lg:col-span-3 lg:text-left text-center">
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="font-mono font-black text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
                <span className="text-foreground">The</span>{" "}
                <span className="gradient-text">Developer</span>
                <br />
                <span className="gradient-text">Community</span>{" "}
                <span className="text-foreground">Platform</span>
              </h1>

              <p className="mx-auto lg:mx-0 max-w-2xl font-mono text-muted text-lg md:text-xl leading-relaxed">
                The focused platform for project creators and vibecoders.
                Showcase your work, find collaborators, and build the future
                together.
              </p>
            </div>

            {/* Problem/Solution Preview */}
            <div className="gap-6 grid md:grid-cols-2 mx-auto lg:mx-0 max-w-2xl">
              <div className="space-y-3 bg-surface/30 p-4 border border-border/50 rounded-lg">
                <h3 className="font-mono text-code-keyword text-sm">
                  <span className="text-code-comment">{`// `}</span>Problem
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Other platforms are unfocused. Too many topics, scattered
                  communities.
                </p>
              </div>
              <div className="space-y-3 bg-surface/30 p-4 border border-border/50 rounded-lg">
                <h3 className="font-mono text-code-function text-sm">
                  <span className="text-code-comment">{`// `}</span>Solution
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  codecave: Dedicated hub for project collaboration and
                  showcase.
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center lg:justify-start items-center space-x-6 text-muted text-sm">
              <div className="flex items-center space-x-2">
                <div className="bg-accent rounded-full w-2 h-2 animate-pulse" />
                <span className="font-mono">1,000+ developers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-primary rounded-full w-2 h-2 animate-pulse" />
                <span className="font-mono">500+ projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-secondary rounded-full w-2 h-2 animate-pulse" />
                <span className="font-mono">250+ collaborations</span>
              </div>
            </div>
          </div>

          {/* Right Column - Auth Card (40%) */}
          <div className="order-1 lg:order-2 lg:col-span-2">
            <AuthCard />
          </div>
        </div>
      </div>
    </section>
  );
};

// OAuth Authentication Card Component
const AuthCard = () => {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="bg-card/80 backdrop-blur-sm mx-auto p-8 border terminal-border border-border/30 rounded-xl max-w-md">
        {/* Terminal Header */}
        <div className="mb-6 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="font-mono text-foreground text-xl">
              <span className="text-code-keyword">class</span>{" "}
              <span className="text-code-function">Authentication</span>{" "}
              <span className="text-muted-foreground">{"{"}</span>
            </h3>
          </div>

          {/* Static Code Display */}
          <div className="bg-surface/40 mb-4 p-4 border border-border/50 rounded-lg text-left">
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex space-x-1">
                <div className="bg-red-500 rounded-full w-2 h-2"></div>
                <div className="bg-yellow-500 rounded-full w-2 h-2"></div>
                <div className="bg-green-500 rounded-full w-2 h-2"></div>
              </div>
              <span className="font-mono text-muted-foreground text-xs">
                terminal.js
              </span>
            </div>

            <div className="space-y-1 font-mono text-sm leading-relaxed">
              <div className="text-code-comment">{`// Initializing authentication module...`}</div>
              <div>
                <span className="text-code-keyword">const</span>{" "}
                <span className="text-code-function">auth</span>{" "}
                <span className="text-muted-foreground">=</span>{" "}
                <span className="text-code-keyword">new</span>{" "}
                <span className="text-code-function">OAuth</span>
                <span className="text-muted-foreground">{"({"}</span>
              </div>
              <div className="ml-4">
                <span className="text-code-function">providers</span>
                <span className="text-muted-foreground">:</span>{" "}
                <span className="text-code-string">{`['github', 'google', 'linkedin']`}</span>
                <span className="text-muted-foreground">,</span>
              </div>
              <div className="ml-4">
                <span className="text-code-function">secure</span>
                <span className="text-muted-foreground">:</span>{" "}
                <span className="text-code-keyword">true</span>
                <span className="text-muted-foreground">,</span>
              </div>
              <div className="ml-4">
                <span className="text-code-function">redirectUri</span>
                <span className="text-muted-foreground">:</span>{" "}
                <span className="text-code-string">{`'/home'`}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{"});"}</span>
              </div>
            </div>
          </div>

          <div className="mb-4 text-center">
            <p className="font-mono text-muted-foreground text-sm">
              <span className="text-code-comment">{`/* Choose your authentication provider */`}</span>
            </p>
          </div>
        </div>

        {/* OAuth Provider Buttons */}
        <OAuthButtons />
      </div>
    </div>
  );
};

export default HeroSection;
