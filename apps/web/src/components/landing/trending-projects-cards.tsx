import React from 'react';
import { Heart, Bookmark, Star, GitBranch, ArrowRight } from 'lucide-react';
import { BaseButton, PrimaryButton } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface TrendingProject {
  id: string;
  title: string;
  description: string;
  author: string;
  stars: number;
  forks: number;
  image: string;
  tech: string[];
  demo: 'live' | 'repo';
}

// Server-side ProjectCard component with Base44 styling
const ProjectCard: React.FC<{ project: TrendingProject }> = ({ project }) => (
  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-gray-200">
    <div className="relative">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      
      {/* Top-right overlay buttons */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <BaseButton
          size="sm"
          variant="secondary"
          className="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 border-gray-200"
        >
          <Heart className="w-4 h-4" />
        </BaseButton>
        <BaseButton
          size="sm"
          variant="secondary"
          className="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 border-gray-200"
        >
          <Bookmark className="w-4 h-4" />
        </BaseButton>
      </div>
      
      {/* Bottom-left badge */}
      <div className="absolute bottom-4 left-4">
        <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none">
          {project.demo === "live" ? "🔴 Live" : "📁 Repo"}
        </Badge>
      </div>
    </div>
    
    <CardContent className="p-6 bg-white">
      <h3 className="text-xl font-bold mb-2 font-mono text-gray-900">{project.title}</h3>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed font-mono">
        {project.description}
      </p>
      
      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((tech, idx) => (
          <Badge key={idx} variant="outline" className="text-xs border-gray-300 text-gray-600">
            {tech}
          </Badge>
        ))}
      </div>
      
      {/* Stats and Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-orange-500" />
            <span className="font-mono">{project.stars}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitBranch className="w-4 h-4 text-blue-500" />
            <span className="font-mono">{project.forks}</span>
          </div>
        </div>
        <BaseButton size="sm" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-none">
          View Project
        </BaseButton>
      </div>
    </CardContent>
  </Card>
);

// Static trending projects data
const trendingProjects: TrendingProject[] = [
  {
    id: '1',
    title: 'DevPortfolio Pro',
    description: 'Professional developer portfolio with dynamic animations, project showcases, and integrated blog. Built for modern developers who want to showcase their work professionally.',
    author: 'alexchen_dev',
    stars: 4900,
    forks: 892,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&auto=format&q=80',
    tech: ['React', 'TypeScript', 'Framer Motion', 'Next.js'],
    demo: 'live'
  },
  {
    id: '2',
    title: 'CodeFlow Studio',
    description: 'Visual development environment that transforms complex coding workflows into intuitive drag-and-drop interfaces. Perfect for rapid prototyping and team collaboration.',
    author: 'flowdev-team',
    stars: 3200,
    forks: 567,
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop&auto=format&q=80',
    tech: ['Vue.js', 'Node.js', 'GraphQL', 'Docker'],
    demo: 'repo'
  },
  {
    id: '3',
    title: 'Quantum Deploy',
    description: 'Revolutionary deployment platform that reduces deployment time by 90% using intelligent caching and parallel processing. Supports all major cloud providers.',
    author: 'quantum-ops',
    stars: 2800,
    forks: 423,
    image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=200&fit=crop&auto=format&q=80',
    tech: ['Go', 'Kubernetes', 'AWS', 'Terraform'],
    demo: 'live'
  },
  {
    id: '4',
    title: 'DataMesh Pro',
    description: 'Next-generation data visualization toolkit with real-time analytics, interactive dashboards, and machine learning insights for enterprise applications.',
    author: 'dataviz-labs',
    stars: 2100,
    forks: 312,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format&q=80',
    tech: ['D3.js', 'Python', 'MongoDB', 'Redis'],
    demo: 'repo'
  },
  {
    id: '5',
    title: 'SecureVault',
    description: 'Open-source password manager with end-to-end encryption, biometric authentication, and seamless cross-platform synchronization for ultimate security.',
    author: 'security-first',
    stars: 1900,
    forks: 289,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop&auto=format&q=80',
    tech: ['Rust', 'WebAssembly', 'SQLite', 'Tauri'],
    demo: 'live'
  },
  {
    id: '6',
    title: 'MobileKit Pro',
    description: 'Comprehensive React Native component library with 100+ pre-built components, dark mode support, and accessibility features for rapid development.',
    author: 'mobile-experts',
    stars: 1600,
    forks: 234,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&auto=format&q=80',
    tech: ['React Native', 'Expo', 'TypeScript', 'Jest'],
    demo: 'repo'
  }
];

// Main server component with Base44 styling
const TrendingProjectsCards: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header - Badge variant with Base44 colors */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-mono font-semibold text-sm uppercase tracking-wider">
              🔥 Live Showcase
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-gray-900 mb-4">
            Trending Projects
          </h2>
          <p className="text-xl text-gray-600 font-mono max-w-2xl mx-auto">
            Explore the most innovative projects making waves in the developer community
          </p>
        </header>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Call to Action */}
        <footer className="text-center mt-16">
          <PrimaryButton
            icon={ArrowRight}
            iconPosition="right"
            size="lg"
            className="transform hover:scale-105 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            Explore All Projects
          </PrimaryButton>
        </footer>
        
      </div>
    </section>
  );
};

export default TrendingProjectsCards; 