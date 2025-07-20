import {
  Code,
  Code2,
  GitBranch,
  Users2,
  Rocket,
  MessageSquare,
  Trophy,
  LucideIcon,
} from "lucide-react";

interface PlatformFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
}

// Server-side FeatureCard component
const FeatureCard = ({ feature }: { feature: PlatformFeature }) => {
  const IconComponent = feature.icon;

  return (
    <article className="group relative bg-white hover:shadow-lg p-8 border border-gray-200 hover:border-primary/30 rounded-2xl overflow-hidden transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className="flex flex-shrink-0 justify-center items-center bg-gradient-to-br from-orange-500/10 to-blue-500/10 rounded-xl w-12 h-12 group-hover:scale-110 transition-transform duration-300">
          <IconComponent className="w-6 h-6 text-orange-500" />
        </div>
        <div className="flex-1">
          <h3 className="mb-3 font-mono font-bold text-gray-900 text-xl">
            {feature.title}
          </h3>
          <p className="mb-4 font-mono text-gray-600 leading-relaxed">
            {feature.description}
          </p>
          <a
            href="#"
            className="inline-flex items-center font-mono font-medium text-orange-500 hover:text-orange-600 transition-colors cursor-pointer"
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
    description:
      "Upload, showcase, and get feedback on your projects. Share code snippets, full repositories, or work-in-progress builds with syntax highlighting and live previews.",
    action: "Start sharing",
  },
  {
    icon: GitBranch,
    title: "Collaborate on Projects",
    description:
      "Join open-source projects, contribute to repositories, or find contributors for your own ideas. Built-in project management and version control integration.",
    action: "Find projects",
  },
  {
    icon: Users2,
    title: "Build Your Network",
    description:
      "Connect with developers who share your interests. Follow creators, join discussions, and build meaningful professional relationships in the tech community.",
    action: "Start networking",
  },
  {
    icon: MessageSquare,
    title: "Get Code Reviews",
    description:
      "Receive constructive feedback from experienced developers. Submit your code for review and help others improve their projects through peer review.",
    action: "Request review",
  },
  {
    icon: Trophy,
    title: "Showcase Achievements",
    description:
      "Display your best work, certifications, and contributions. Build a professional developer portfolio that stands out to employers and collaborators.",
    action: "Build portfolio",
  },
  {
    icon: Rocket,
    title: "Launch Your Ideas",
    description:
      "Turn concepts into reality with community support. Get early feedback, find beta testers, and connect with potential co-founders for your next big project.",
    action: "Launch idea",
  },
];

// Main server component
const FeaturesSection = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="mx-auto px-6 max-w-7xl container">
        {/* Section Header - Code variant */}
        <header className="mb-16 text-center">
          <div className="inline-flex justify-center items-center space-x-3 mb-6">
            <div className="flex justify-center items-center bg-gradient-to-r from-orange-500 to-blue-500 rounded-full w-12 h-12">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="block font-mono font-medium text-orange-500 text-sm uppercase tracking-wider">
                Platform Features
              </span>
              <h2 className="font-mono font-bold text-gray-900 text-4xl md:text-5xl">
                What You Can Do Here
              </h2>
            </div>
          </div>
          <p className="mx-auto max-w-3xl font-mono text-gray-600 text-xl leading-relaxed">
            CodeCave provides everything you need to grow as a developer, share
            your work, and connect with a community that values quality and
            innovation.
          </p>
        </header>

        {/* Features Grid */}
        <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {platformFeatures.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

        {/* Call to Action */}
        <footer className="text-center">
          <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-8 border border-orange-200 rounded-2xl">
            <h3 className="mb-4 font-mono font-bold text-gray-900 text-2xl">
              Ready to start building?
            </h3>
            <p className="mx-auto mb-6 max-w-2xl font-mono text-gray-600">
              Join thousands of developers who are already using CodeCave to
              showcase their work, collaborate on projects, and grow their
              careers.
            </p>
            <a
              href="#signup"
              className="inline-flex items-center bg-gradient-to-r from-orange-500 hover:from-orange-600 to-orange-600 hover:to-orange-700 px-8 py-4 rounded-lg font-mono font-semibold text-white text-lg hover:scale-105 transition-all duration-200 cursor-pointer transform"
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
