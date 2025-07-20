import React from 'react';
import { Code, Code2, GitBranch, Users2, Rocket, MessageSquare, Trophy, LucideIcon } from 'lucide-react';

interface PlatformFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
}

// Server-side FeatureCard component
const FeatureCard: React.FC<{ feature: PlatformFeature }> = ({ feature }) => {
  const IconComponent = feature.icon;
  
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/30">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500/10 to-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <IconComponent className="w-6 h-6 text-orange-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold font-mono text-gray-900 mb-3">
            {feature.title}
          </h3>
          <p className="text-gray-600 font-mono leading-relaxed mb-4">
            {feature.description}
          </p>
          <a 
            href="#"
            className="text-orange-500 font-mono font-medium hover:text-orange-600 transition-colors cursor-pointer inline-flex items-center"
          >
            {feature.action} →
          </a>
        </div>
      </div>
    </article>
  );
};

// Static platform features data
const platformFeatures: PlatformFeature[] = [
  {
    icon: Code,
    title: "Share Your Code",
    description: "Upload, showcase, and get feedback on your projects. Share code snippets, full repositories, or work-in-progress builds with syntax highlighting and live previews.",
    action: "Start sharing"
  },
  {
    icon: GitBranch,
    title: "Collaborate on Projects",
    description: "Join open-source projects, contribute to repositories, or find contributors for your own ideas. Built-in project management and version control integration.",
    action: "Find projects"
  },
  {
    icon: Users2,
    title: "Build Your Network",
    description: "Connect with developers who share your interests. Follow creators, join discussions, and build meaningful professional relationships in the tech community.",
    action: "Start networking"
  },
  {
    icon: MessageSquare,
    title: "Get Code Reviews",
    description: "Receive constructive feedback from experienced developers. Submit your code for review and help others improve their projects through peer review.",
    action: "Request review"
  },
  {
    icon: Trophy,
    title: "Showcase Achievements",
    description: "Display your best work, certifications, and contributions. Build a professional developer portfolio that stands out to employers and collaborators.",
    action: "Build portfolio"
  },
  {
    icon: Rocket,
    title: "Launch Your Ideas",
    description: "Turn concepts into reality with community support. Get early feedback, find beta testers, and connect with potential co-founders for your next big project.",
    action: "Launch idea"
  }
];

// Main server component
const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Section Header - Code variant */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-sm font-medium font-mono text-orange-500 uppercase tracking-wider block">Platform Features</span>
              <h2 className="text-4xl md:text-5xl font-bold font-mono text-gray-900">
                What You Can Do Here
              </h2>
            </div>
          </div>
          <p className="text-xl text-gray-600 font-mono max-w-3xl mx-auto leading-relaxed">
            CodeCave provides everything you need to grow as a developer, share your work, 
            and connect with a community that values quality and innovation.
          </p>
        </header>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {platformFeatures.map((feature, index) => (
            <FeatureCard 
              key={feature.title}
              feature={feature}
            />
          ))}
        </div>

        {/* Call to Action */}
        <footer className="text-center">
          <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl p-8 border border-orange-200">
            <h3 className="text-2xl font-bold font-mono text-gray-900 mb-4">
              Ready to start building?
            </h3>
            <p className="text-gray-600 font-mono mb-6 max-w-2xl mx-auto">
              Join thousands of developers who are already using CodeCave to showcase their work, 
              collaborate on projects, and grow their careers.
            </p>
            <a
              href="#signup"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg font-semibold font-mono text-lg inline-flex items-center transition-all duration-200 transform hover:scale-105 cursor-pointer"
            >
              Get Started Free
            </a>
          </div>
        </footer>
        
      </div>
    </section>
  );
};

export default FeaturesSection; 