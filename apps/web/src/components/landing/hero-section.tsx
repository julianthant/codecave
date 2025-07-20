import React from 'react';
import OAuthButtons from './oauth-buttons';

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center bg-background relative overflow-hidden pt-12">
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
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-center">
          
          {/* Left Column - Value Proposition (60%) */}
          <div className="lg:col-span-3 order-2 lg:order-1 text-center lg:text-left space-y-8">
            
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-black leading-tight tracking-tight">
                <span className="text-foreground">The</span>{" "}
                <span className="gradient-text">Developer</span>
                <br />
                <span className="gradient-text">Community</span>{" "}
                <span className="text-foreground">Platform</span>
              </h1>
              
              <p className="text-lg md:text-xl font-mono text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                The focused platform for project creators and vibecoders. 
                Showcase your work, find collaborators, and build the future together.
              </p>
            </div>
            
            {/* Problem/Solution Preview */}
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto lg:mx-0">
              <div className="space-y-3 p-4 rounded-lg bg-surface/30 border border-border/50">
                <h3 className="text-code-keyword font-mono text-sm">
                  <span className="text-code-comment">// </span>Problem
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Other platforms are unfocused. Too many topics, scattered communities.
                </p>
              </div>
              <div className="space-y-3 p-4 rounded-lg bg-surface/30 border border-border/50">
                <h3 className="text-code-function font-mono text-sm">
                  <span className="text-code-comment">// </span>Solution
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  codecave: Dedicated hub for project collaboration and showcase.
                </p>
              </div>
            </div>
            

            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-muted">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="font-mono">1,000+ developers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="font-mono">500+ projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                <span className="font-mono">250+ collaborations</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Auth Card (40%) */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <AuthCard />
          </div>
          
        </div>
      </div>
    </section>
  );
};

// OAuth Authentication Card Component
const AuthCard: React.FC = () => {

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card/80 backdrop-blur-sm border border-border/30 rounded-xl p-8 max-w-md mx-auto terminal-border">
        {/* Terminal Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-mono text-foreground">
              <span className="text-code-keyword">class</span>{' '}
              <span className="text-code-function">Authentication</span>{' '}
              <span className="text-muted-foreground">{'{'}</span>
            </h3>
          </div>
          
          {/* Static Code Display */}
          <div className="bg-surface/40 rounded-lg p-4 text-left border border-border/50 mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xs text-muted-foreground font-mono">terminal.js</span>
            </div>
            
            <div className="space-y-1 font-mono text-sm leading-relaxed">
              <div className="text-code-comment">// Initializing authentication module...</div>
              <div>
                <span className="text-code-keyword">const</span> <span className="text-code-function">auth</span> <span className="text-muted-foreground">=</span> <span className="text-code-keyword">new</span> <span className="text-code-function">OAuth</span><span className="text-muted-foreground">{'({'}</span>
              </div>
              <div className="ml-4">
                <span className="text-code-function">providers</span><span className="text-muted-foreground">:</span> <span className="text-code-string">['github', 'google', 'linkedin']</span><span className="text-muted-foreground">,</span>
              </div>
              <div className="ml-4">
                <span className="text-code-function">secure</span><span className="text-muted-foreground">:</span> <span className="text-code-keyword">true</span><span className="text-muted-foreground">,</span>
              </div>
              <div className="ml-4">
                <span className="text-code-function">redirectUri</span><span className="text-muted-foreground">:</span> <span className="text-code-string">'/home'</span>
              </div>
              <div><span className="text-muted-foreground">{'});'}</span></div>
            </div>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground font-mono">
              <span className="text-code-comment">/* Choose your authentication provider */</span>
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