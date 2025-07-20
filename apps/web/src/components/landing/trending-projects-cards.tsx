import React from "react";
import Image from "next/image";
import { Heart, Bookmark, Star, GitBranch, ArrowRight } from "lucide-react";
import { BaseButton, PrimaryButton } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface TrendingProject {
  id: string;
  title: string;
  description: string;
  author: string;
  stars: number;
  forks: number;
  image: string;
  tech: string[];
  demo: "live" | "repo";
}

// Server-side ProjectCard component with Base44 styling
const ProjectCard: React.FC<{ project: TrendingProject }> = ({ project }) => (
  <Card className="bg-white hover:shadow-xl border-gray-200 overflow-hidden transition-all hover:-translate-y-1 duration-300">
    <div className="relative">
      <Image
        src={project.image}
        alt={project.title}
        width={400}
        height={192}
        className="w-full h-48 object-cover"
        loading="lazy"
      />

      {/* Top-right overlay buttons */}
      <div className="top-4 right-4 absolute flex space-x-2">
        <BaseButton
          size="sm"
          variant="secondary"
          className="bg-white/90 hover:bg-white backdrop-blur-sm p-0 border-gray-200 w-8 h-8 text-gray-700"
        >
          <Heart className="w-4 h-4" />
        </BaseButton>
        <BaseButton
          size="sm"
          variant="secondary"
          className="bg-white/90 hover:bg-white backdrop-blur-sm p-0 border-gray-200 w-8 h-8 text-gray-700"
        >
          <Bookmark className="w-4 h-4" />
        </BaseButton>
      </div>

      {/* Bottom-left badge */}
      <div className="bottom-4 left-4 absolute">
        <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 border-none text-white">
          {project.demo === "live" ? "🔴 Live" : "📁 Repo"}
        </Badge>
      </div>
    </div>

    <CardContent className="bg-white p-6">
      <h3 className="mb-2 font-mono font-bold text-gray-900 text-xl">
        {project.title}
      </h3>
      <p className="mb-4 font-mono text-gray-600 text-sm leading-relaxed">
        {project.description}
      </p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((tech, idx) => (
          <Badge
            key={idx}
            variant="outline"
            className="border-gray-300 text-gray-600 text-xs"
          >
            {tech}
          </Badge>
        ))}
      </div>

      {/* Stats and Action */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 text-gray-500 text-sm">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-orange-500" />
            <span className="font-mono">{project.stars}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitBranch className="w-4 h-4 text-blue-500" />
            <span className="font-mono">{project.forks}</span>
          </div>
        </div>
        <BaseButton
          size="sm"
          className="bg-gradient-to-r from-orange-500 hover:from-orange-600 to-orange-600 hover:to-orange-700 border-none text-white"
        >
          View Project
        </BaseButton>
      </div>
    </CardContent>
  </Card>
);

// Static trending projects data
const trendingProjects: TrendingProject[] = [
  {
    id: "1",
    title: "DevPortfolio Pro",
    description:
      "Professional developer portfolio with dynamic animations, project showcases, and integrated blog. Built for modern developers who want to showcase their work professionally.",
    author: "alexchen_dev",
    stars: 4900,
    forks: 892,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&auto=format&q=80",
    tech: ["React", "TypeScript", "Framer Motion", "Next.js"],
    demo: "live",
  },
  {
    id: "2",
    title: "CodeFlow Studio",
    description:
      "Visual development environment that transforms complex coding workflows into intuitive drag-and-drop interfaces. Perfect for rapid prototyping and team collaboration.",
    author: "flowdev-team",
    stars: 3200,
    forks: 567,
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop&auto=format&q=80",
    tech: ["Vue.js", "Node.js", "GraphQL", "Docker"],
    demo: "repo",
  },
  {
    id: "3",
    title: "Quantum Deploy",
    description:
      "Revolutionary deployment platform that reduces deployment time by 90% using intelligent caching and parallel processing. Supports all major cloud providers.",
    author: "quantum-ops",
    stars: 2800,
    forks: 423,
    image:
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=200&fit=crop&auto=format&q=80",
    tech: ["Go", "Kubernetes", "AWS", "Terraform"],
    demo: "live",
  },
  {
    id: "4",
    title: "DataMesh Pro",
    description:
      "Next-generation data visualization toolkit with real-time analytics, interactive dashboards, and machine learning insights for enterprise applications.",
    author: "dataviz-labs",
    stars: 2100,
    forks: 312,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format&q=80",
    tech: ["D3.js", "Python", "MongoDB", "Redis"],
    demo: "repo",
  },
  {
    id: "5",
    title: "SecureVault",
    description:
      "Open-source password manager with end-to-end encryption, biometric authentication, and seamless cross-platform synchronization for ultimate security.",
    author: "security-first",
    stars: 1900,
    forks: 289,
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop&auto=format&q=80",
    tech: ["Rust", "WebAssembly", "SQLite", "Tauri"],
    demo: "live",
  },
  {
    id: "6",
    title: "MobileKit Pro",
    description:
      "Comprehensive React Native component library with 100+ pre-built components, dark mode support, and accessibility features for rapid development.",
    author: "mobile-experts",
    stars: 1600,
    forks: 234,
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&auto=format&q=80",
    tech: ["React Native", "Expo", "TypeScript", "Jest"],
    demo: "repo",
  },
];

// Main server component with Base44 styling
const TrendingProjectsCards: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 py-24">
      <div className="mx-auto px-6 max-w-7xl container">
        {/* Header - Badge variant with Base44 colors */}
        <header className="mb-16 text-center">
          <div className="inline-flex justify-center items-center mb-6">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 rounded-full font-mono font-semibold text-white text-sm uppercase tracking-wider">
              🔥 Live Showcase
            </span>
          </div>
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
            className="bg-gradient-to-r from-orange-500 hover:from-orange-600 to-orange-600 hover:to-orange-700 hover:scale-105 transform"
          >
            Explore All Projects
          </PrimaryButton>
        </footer>
      </div>
    </section>
  );
};

export default TrendingProjectsCards;
