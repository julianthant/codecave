import React from 'react';
import { Search, Users, TrendingUp, Star, ArrowRight, LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

// Server-side BrowserHeader component
const BrowserHeader: React.FC = () => (
  <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="w-3 h-3 bg-red-500 rounded-full" aria-hidden="true"></div>
      <div className="w-3 h-3 bg-yellow-500 rounded-full" aria-hidden="true"></div>
      <div className="w-3 h-3 bg-green-500 rounded-full" aria-hidden="true"></div>
    </div>
    <span className="text-gray-400 text-sm font-mono">
      codecave.tech
    </span>
  </div>
);

// Server-side FeatureCard component
const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
  const IconComponent = feature.icon;
  
  return (
    <article className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:bg-white hover:shadow-md transition-all duration-200">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold font-mono text-gray-900">
            {feature.title}
          </h3>
        </div>
      </header>
      <p className="text-gray-600 text-sm font-mono leading-relaxed">
        {feature.desc}
      </p>
    </article>
  );
};

// Server-side SectionHeader component
const SectionHeader: React.FC = () => (
  <header className="mb-8">
    <h2 className="text-3xl font-bold font-mono mb-4 text-gray-900">
      Why choose CodeCave?
    </h2>
    <p className="text-lg text-gray-600 font-mono leading-relaxed">
      Stop wasting time on scattered platforms and noise. CodeCave
      connects you with quality projects, meaningful collaborations,
      and a community that values real innovation over hype.
    </p>
  </header>
);

// Static feature data - moved outside component for better performance
const features: Feature[] = [
  {
    icon: Search,
    title: "Discover Quality Projects",
    desc: "Stop wasting time sifting through noise. Find exceptional projects and innovative solutions in one curated feed designed for serious developers.",
  },
  {
    icon: Users,
    title: "Connect with Builders",
    desc: "Build relationships with developers who actually ship. Connect directly with creators, contributors, and innovators who share your passion for building.",
  },
  {
    icon: TrendingUp,
    title: "Accelerate Your Growth",
    desc: "Learn from the best. Access insights, techniques, and approaches from successful projects that will elevate your own development skills.",
  },
  {
    icon: Star,
    title: "Showcase Your Impact",
    desc: "Get the recognition you deserve. Share your projects with a community that values innovation, quality, and the dedication it takes to build great software.",
  },
];

// Main server component
const WhyCodecaveSection: React.FC = () => {
  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <BrowserHeader />

          <div className="p-8">
            <SectionHeader />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={feature.title} 
                  feature={feature} 
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

        <footer className="text-center mt-8">
          <a
            href="#dashboard"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg font-semibold font-mono text-lg inline-flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 cursor-pointer"
          >
            Access Dashboard
            <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </footer>
      </div>
    </section>
  );
};

export default WhyCodecaveSection; 