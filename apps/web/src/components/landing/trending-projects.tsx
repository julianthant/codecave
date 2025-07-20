import React from "react";
import Image from "next/image";
import { Github, TrendingUp, Eye, ArrowRight, Code2Icon } from "lucide-react";
import { PrimaryButton, OutlineLink, PrimaryLink } from "../ui/button";

interface TrendingProject {
  id: string;
  name: string;
  description: string;
  author: string;
  stars: number;
  language: string;
  image: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  hearts?: number;
  comments?: number;
  shares?: number;
  views?: string;
  trending?: boolean;
}

// Server-side Badge component
const Badge: React.FC<{
  variant?: "secondary" | "outline";
  className?: string;
  children: React.ReactNode;
}> = ({ variant = "secondary", className = "", children }) => {
  const baseClasses =
    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium";
  const variantClasses =
    variant === "secondary"
      ? "bg-gray-100 text-gray-700"
      : "border border-gray-300 text-gray-600 bg-white";

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

// Server-side ActionButtons component
const ActionButtons: React.FC<{ project: TrendingProject }> = ({ project }) => (
  <div className="flex gap-3">
    <PrimaryLink
      href={project.liveUrl}
      icon={Code2Icon}
      iconPosition="left"
      size="sm"
      className="flex-1"
      target="_blank"
      rel="noopener noreferrer"
    >
      View Live
    </PrimaryLink>
    <OutlineLink
      href={project.githubUrl}
      icon={Github}
      size="sm"
      target="_blank"
      rel="noopener noreferrer"
      title="View GitHub Repository"
    >
      <span className="sr-only">View GitHub</span>
    </OutlineLink>
  </div>
);

// Server-side TechStack component
const TechStack: React.FC<{ tech: string[] }> = ({ tech }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {tech.map((techItem) => (
      <Badge key={techItem} variant="secondary" className="font-mono text-xs">
        {techItem}
      </Badge>
    ))}
  </div>
);

// Static data - moved outside component for better performance
const trendingProjects: TrendingProject[] = [
  {
    id: "1",
    name: "DevPortfolio Pro",
    description:
      "Professional developer portfolio with dynamic animations, project showcases, and integrated blog. Built for modern developers.",
    author: "alexchen_dev",
    stars: 4900,
    language: "Python",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&auto=format&q=80",
    tech: ["React", "TypeScript", "Framer Motion", "Next.js"],
    liveUrl: "#",
    githubUrl: "#",
    hearts: 847,
    comments: 93,
    shares: 156,
    views: "12.5k",
    trending: true,
  },
  {
    id: "2",
    name: "CodeFlow Studio",
    description:
      "Visual development environment that transforms complex coding workflows into intuitive drag-and-drop interfaces. Perfect for rapid prototyping.",
    author: "flowdev-team",
    stars: 3200,
    language: "TypeScript",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop&auto=format&q=80",
    tech: ["Vue.js", "Node.js", "GraphQL", "Docker"],
    liveUrl: "#",
    githubUrl: "#",
    hearts: 623,
    comments: 78,
    shares: 124,
    views: "9.8k",
  },
  {
    id: "3",
    name: "Quantum Deploy",
    description:
      "Revolutionary deployment platform that reduces deployment time by 90% using intelligent caching and parallel processing. Supports all major cloud providers.",
    author: "quantum-ops",
    stars: 2800,
    language: "Go",
    image:
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=200&fit=crop&auto=format&q=80",
    tech: ["Go", "Kubernetes", "AWS", "Terraform"],
    liveUrl: "#",
    githubUrl: "#",
    hearts: 456,
    comments: 67,
    shares: 89,
    views: "7.2k",
  },
  {
    id: "4",
    name: "DataMesh Pro",
    description:
      "Next-generation data visualization toolkit with real-time analytics, interactive dashboards, and machine learning insights.",
    author: "dataviz-labs",
    stars: 2100,
    language: "JavaScript",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format&q=80",
    tech: ["D3.js", "Python", "MongoDB", "Redis"],
    liveUrl: "#",
    githubUrl: "#",
    hearts: 334,
    comments: 45,
    shares: 67,
    views: "5.9k",
  },
  {
    id: "5",
    name: "SecureVault",
    description:
      "Open-source password manager with end-to-end encryption, biometric authentication, and seamless cross-platform synchronization.",
    author: "security-first",
    stars: 1900,
    language: "Rust",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop&auto=format&q=80",
    tech: ["Rust", "WebAssembly", "SQLite", "Tauri"],
    liveUrl: "#",
    githubUrl: "#",
    hearts: 289,
    comments: 34,
    shares: 56,
    views: "4.1k",
  },
  {
    id: "6",
    name: "MobileKit Pro",
    description:
      "Comprehensive React Native component library with 100+ pre-built components, dark mode support, and accessibility features.",
    author: "mobile-experts",
    stars: 1600,
    language: "React Native",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&auto=format&q=80",
    tech: ["React Native", "Expo", "TypeScript", "Jest"],
    liveUrl: "#",
    githubUrl: "#",
    hearts: 234,
    comments: 28,
    shares: 41,
    views: "3.7k",
  },
];

// Server-side ProjectCard component
const ProjectCard: React.FC<{ project: TrendingProject }> = ({ project }) => (
  <article className="group bg-white hover:shadow-lg border border-gray-200 hover:border-purple-300 rounded-xl overflow-hidden transition-all duration-300">
    {/* Image Section */}
    <div className="relative">
      {project.trending && (
        <div className="top-3 left-3 z-10 absolute flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 px-2 py-1 rounded-full font-mono font-medium text-white text-xs">
          <TrendingUp className="w-3 h-3" />
          <span>#1 Trending</span>
        </div>
      )}

      <Image
        src={project.image}
        alt={`${project.name} project screenshot`}
        width={400}
        height={200}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </div>

    {/* Content Section */}
    <div className="p-5">
      {/* Header */}
      <header className="flex justify-between items-start mb-3">
        <div>
          <h3 className="mb-1 font-mono font-bold text-gray-900 text-lg">
            {project.name}
          </h3>
          <p className="font-mono text-gray-600 text-sm">
            by @{project.author}
          </p>
        </div>
        <div className="flex items-center gap-1 pt-1 text-gray-600 text-sm">
          <Eye className="w-4 h-4" />
          <span className="font-mono">
            {project.views || (project.stars / 1000).toFixed(1) + "k"}
          </span>
        </div>
      </header>

      <p className="mb-4 font-mono text-gray-600 text-md leading-relaxed">
        {project.description}
      </p>

      {/* Tech Stack */}
      <TechStack tech={project.tech} />

      {/* Actions */}
      <ActionButtons project={project} />
    </div>
  </article>
);

// Main server component
const TrendingProjectsCards: React.FC = () => {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto px-6 max-w-7xl container">
        {/* Header */}
        <header className="mb-16 text-center">
          <h2 className="mb-4 font-mono font-bold text-gray-900 text-4xl md:text-5xl">
            Trending Projects
          </h2>
          <p className="mx-auto max-w-2xl font-mono text-gray-600 text-xl">
            Explore the most innovative projects making waves in the developer
            community
          </p>
        </header>

        {/* Projects Grid */}
        <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {trendingProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Call to Action */}
        <footer className="mt-16 text-center">
          <PrimaryButton
            icon={ArrowRight}
            iconPosition="right"
            size="lg"
            className="hover:scale-105 transform"
          >
            Explore All Projects
          </PrimaryButton>
        </footer>
      </div>
    </section>
  );
};

export default TrendingProjectsCards;
