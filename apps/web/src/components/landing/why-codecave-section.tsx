import React from "react";
import {
  Search,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

// Server-side BrowserHeader component
const BrowserHeader: React.FC = () => (
  <div className="flex justify-between items-center bg-gray-900 px-6 py-4">
    <div className="flex items-center space-x-3">
      <div className="bg-red-500 rounded-full w-3 h-3" aria-hidden="true"></div>
      <div
        className="bg-yellow-500 rounded-full w-3 h-3"
        aria-hidden="true"
      ></div>
      <div
        className="bg-green-500 rounded-full w-3 h-3"
        aria-hidden="true"
      ></div>
    </div>
    <span className="font-mono text-gray-400 text-sm">codecave.tech</span>
  </div>
);

// Server-side FeatureCard component
const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
  const IconComponent = feature.icon;

  return (
    <article className="bg-gray-50 hover:bg-white hover:shadow-md p-6 border border-gray-200 rounded-lg transition-all duration-200">
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex justify-center items-center bg-blue-100 rounded-lg w-8 h-8">
            <IconComponent className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-mono font-semibold text-gray-900">
            {feature.title}
          </h3>
        </div>
      </header>
      <p className="font-mono text-gray-600 text-sm leading-relaxed">
        {feature.desc}
      </p>
    </article>
  );
};

// Server-side SectionHeader component
const SectionHeader: React.FC = () => (
  <header className="mb-8">
    <h2 className="mb-4 font-mono font-bold text-gray-900 text-3xl">
      Why choose CodeCave?
    </h2>
    <p className="font-mono text-gray-600 text-lg leading-relaxed">
      Stop wasting time on scattered platforms and noise. CodeCave connects you
      with quality projects, meaningful collaborations, and a community that
      values real innovation over hype.
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
    <section className="bg-white px-8 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
          <BrowserHeader />

          <div className="p-8">
            <SectionHeader />

            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              {features.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center">
          <a
            href="#dashboard"
            className="inline-flex items-center bg-gradient-to-r from-orange-500 hover:from-orange-600 to-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl px-8 py-4 rounded-lg font-mono font-semibold text-white text-lg hover:scale-105 transition-all duration-200 cursor-pointer transform"
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
