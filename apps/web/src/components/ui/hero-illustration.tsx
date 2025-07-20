import React from "react";

interface HeroIllustrationProps {
  className?: string;
  animated?: boolean;
}

// SVG Gradient definitions component
const SvgGradients = () => (
  <defs>
    <radialGradient id="bgGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
    </radialGradient>

    <linearGradient id="platformGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="hsl(var(--primary))" />
      <stop offset="100%" stopColor="hsl(var(--secondary))" />
    </linearGradient>

    <linearGradient id="platformGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="hsl(var(--secondary))" />
      <stop offset="100%" stopColor="hsl(var(--accent))" />
    </linearGradient>

    <linearGradient id="platformGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="hsl(var(--accent))" />
      <stop offset="100%" stopColor="hsl(var(--primary))" />
    </linearGradient>

    {/* Drop Shadow Filter */}
    <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow
        dx="2"
        dy="4"
        stdDeviation="4"
        floodColor="hsl(var(--primary))"
        floodOpacity="0.3"
      />
    </filter>

    {/* Glow Filter */}
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

// Common platform layer component
const PlatformLayer = ({
  animated,
  animationDelay,
  transform,
  rx,
  ry,
  gradient,
  topOffset,
  label,
  labelY,
  children,
}: {
  animated: boolean;
  animationDelay: string;
  transform: string;
  rx: number;
  ry: number;
  gradient: string;
  topOffset: number;
  label: string;
  labelY: number;
  children: React.ReactNode;
}) => (
  <g className={animated ? "animate-float" : ""} style={{ animationDelay }}>
    <g transform={transform}>
      {/* Platform Surface */}
      <ellipse
        cx="0"
        cy="0"
        rx={rx}
        ry={ry}
        fill={`url(#${gradient})`}
        fillOpacity="0.8"
        filter="url(#dropShadow)"
      />
      <ellipse
        cx="0"
        cy={-topOffset}
        rx={rx}
        ry={ry}
        fill={`url(#${gradient})`}
      />

      {/* Layer-specific content */}
      <g fill="white" fillOpacity="0.9">
        {children}
      </g>

      {/* Label */}
      <text
        x="0"
        y={labelY}
        textAnchor="middle"
        className="fill-white font-mono text-xs"
        fillOpacity="0.8"
      >
        {label}
      </text>
    </g>
  </g>
);

// Analytics/Growth platform layer component
const AnalyticsLayer = ({ animated }: { animated: boolean }) => (
  <PlatformLayer
    animated={animated}
    animationDelay="0s"
    transform="translate(200, 120)"
    rx={80}
    ry={25}
    gradient="platformGradient1"
    topOffset={8}
    label="Growth"
    labelY={15}
  >
    <rect x="-15" y="-12" width="8" height="16" rx="1" />
    <rect x="-4" y="-8" width="8" height="12" rx="1" />
    <rect x="7" y="-16" width="8" height="20" rx="1" />

    {/* Trend Line */}
    <path
      d="M-25 0 L-15 -8 L-5 -4 L5 -12 L15 -16 L25 -20"
      stroke="white"
      strokeWidth="2"
      strokeOpacity="0.7"
      fill="none"
    />
  </PlatformLayer>
);

// Community platform layer component
const CommunityLayer = ({ animated }: { animated: boolean }) => (
  <PlatformLayer
    animated={animated}
    animationDelay="0.5s"
    transform="translate(200, 170)"
    rx={90}
    ry={30}
    gradient="platformGradient2"
    topOffset={10}
    label="Community"
    labelY={18}
  >
    {/* User circles */}
    <circle cx="-20" cy="-15" r="6" />
    <circle cx="0" cy="-18" r="6" />
    <circle cx="20" cy="-15" r="6" />

    {/* Connection lines */}
    <path
      d="M-14 -12 L-6 -15 M6 -15 L14 -12"
      stroke="white"
      strokeWidth="2"
      strokeOpacity="0.6"
    />
  </PlatformLayer>
);

// Collaboration platform layer component
const CollaborationLayer = ({ animated }: { animated: boolean }) => (
  <PlatformLayer
    animated={animated}
    animationDelay="1s"
    transform="translate(200, 220)"
    rx={100}
    ry={35}
    gradient="platformGradient3"
    topOffset={12}
    label="Collaboration"
    labelY={22}
  >
    {/* Git merge icon */}
    <circle cx="-25" cy="-18" r="4" />
    <circle cx="25" cy="-18" r="4" />
    <circle cx="0" cy="-10" r="4" />
    <path
      d="M-21 -16 Q0 -8 21 -16"
      stroke="white"
      strokeWidth="2"
      fill="none"
      strokeOpacity="0.7"
    />

    {/* Handshake */}
    <path
      d="M-8 -15 L8 -15 M-4 -18 L4 -12"
      stroke="white"
      strokeWidth="2"
      strokeOpacity="0.6"
    />
  </PlatformLayer>
);

// Project sharing platform layer component
const ProjectSharingLayer = ({ animated }: { animated: boolean }) => (
  <PlatformLayer
    animated={animated}
    animationDelay="1.5s"
    transform="translate(200, 270)"
    rx={110}
    ry={40}
    gradient="platformGradient1"
    topOffset={15}
    label="Project Sharing"
    labelY={25}
  >
    {/* Code blocks */}
    <rect x="-30" y="-25" width="20" height="12" rx="2" />
    <rect x="-5" y="-22" width="20" height="12" rx="2" />
    <rect x="20" y="-25" width="20" height="12" rx="2" />

    {/* Brackets inside */}
    <text x="-20" y="-17" textAnchor="middle" className="font-mono text-xs">
      {"<>"}
    </text>
    <text x="5" y="-14" textAnchor="middle" className="font-mono text-xs">
      {"{ }"}
    </text>
    <text x="30" y="-17" textAnchor="middle" className="font-mono text-xs">
      {"[ ]"}
    </text>
  </PlatformLayer>
);

// Connecting lines and structural elements
const ConnectingElements = () => (
  <g
    stroke="hsl(var(--primary))"
    strokeWidth="1"
    strokeOpacity="0.3"
    fill="none"
  >
    <line x1="200" y1="145" x2="200" y2="160" />
    <line x1="200" y1="195" x2="200" y2="210" />
    <line x1="200" y1="245" x2="200" y2="260" />
  </g>
);

// Floating decorative elements
const FloatingElements = ({ animated }: { animated: boolean }) => (
  <g className={animated ? "animate-pulse" : ""}>
    <circle
      cx="120"
      cy="150"
      r="2"
      fill="hsl(var(--accent))"
      fillOpacity="0.6"
    />
    <circle
      cx="320"
      cy="180"
      r="2"
      fill="hsl(var(--secondary))"
      fillOpacity="0.6"
    />
    <circle
      cx="100"
      cy="220"
      r="2"
      fill="hsl(var(--primary))"
      fillOpacity="0.6"
    />
    <circle
      cx="330"
      cy="240"
      r="2"
      fill="hsl(var(--accent))"
      fillOpacity="0.6"
    />
  </g>
);

// Data flow indicators
const DataFlowIndicators = ({ animated }: { animated: boolean }) => (
  <g className={animated ? "animate-bounce" : ""}>
    <g transform="translate(160, 200)">
      <circle
        cx="0"
        cy="0"
        r="3"
        fill="hsl(var(--primary))"
        fillOpacity="0.8"
      />
      <circle
        cx="0"
        cy="-10"
        r="2"
        fill="hsl(var(--primary))"
        fillOpacity="0.6"
      />
      <circle
        cx="0"
        cy="-18"
        r="1"
        fill="hsl(var(--primary))"
        fillOpacity="0.4"
      />
    </g>
    <g transform="translate(240, 200)">
      <circle
        cx="0"
        cy="0"
        r="3"
        fill="hsl(var(--secondary))"
        fillOpacity="0.8"
      />
      <circle
        cx="0"
        cy="-10"
        r="2"
        fill="hsl(var(--secondary))"
        fillOpacity="0.6"
      />
      <circle
        cx="0"
        cy="-18"
        r="1"
        fill="hsl(var(--secondary))"
        fillOpacity="0.4"
      />
    </g>
  </g>
);

// Animated code snippets overlay
const AnimatedCodeSnippets = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="top-10 left-10 absolute opacity-60 font-mono text-code-keyword text-xs animate-fade-in-out">
      const
    </div>
    <div
      className="top-20 right-16 absolute opacity-60 font-mono text-code-string text-xs animate-fade-in-out"
      style={{ animationDelay: "2s" }}
    >
      &quot;collaborate&quot;
    </div>
    <div
      className="bottom-20 left-16 absolute opacity-60 font-mono text-code-function text-xs animate-fade-in-out"
      style={{ animationDelay: "4s" }}
    >
      build()
    </div>
    <div
      className="right-10 bottom-32 absolute opacity-60 font-mono text-code-comment text-xs animate-fade-in-out"
      style={{ animationDelay: "6s" }}
    >
      {"// together"}
    </div>
  </div>
);

const HeroIllustration: React.FC<HeroIllustrationProps> = ({
  className = "",
  animated = true,
}) => {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center ${className}`}
    >
      <div className="relative w-80 lg:w-96 h-80 lg:h-96">
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl w-full h-full"
        >
          <SvgGradients />

          {/* Background Circle */}
          <circle cx="200" cy="200" r="180" fill="url(#bgGlow)" />

          <AnalyticsLayer animated={animated} />
          <CommunityLayer animated={animated} />
          <CollaborationLayer animated={animated} />
          <ProjectSharingLayer animated={animated} />

          <ConnectingElements />
          <FloatingElements animated={animated} />
          <DataFlowIndicators animated={animated} />
        </svg>

        {/* Animated Code Snippets */}
        {animated && <AnimatedCodeSnippets />}
      </div>
    </div>
  );
};

export default HeroIllustration;
