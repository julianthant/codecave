import { Users, MessageCircle, Globe, Zap, Heart, Code2 } from "lucide-react";

interface CommunityStats {
  number: string;
  label: string;
  icon: React.ReactNode;
}

interface CommunityHighlight {
  title: string;
  description: string;
  members: string;
  activity: string;
  image: string;
}

// Server-side StatCard component
const StatCard = ({ stat }: { stat: CommunityStats }) => (
  <div className="p-6 text-center">
    <div className="flex justify-center mb-4">{stat.icon}</div>
    <div className="mb-2 font-mono font-bold text-orange-500 text-3xl">
      {stat.number}
    </div>
    <div className="font-mono text-gray-600 text-sm">{stat.label}</div>
  </div>
);

// Server-side CommunityCard component
const CommunityCard = ({ community }: { community: CommunityHighlight }) => (
  <article className="group bg-white hover:shadow-lg border border-gray-200 hover:border-orange-300 rounded-xl overflow-hidden transition-all duration-300">
    <div className="relative h-48 overflow-hidden">
      <img
        src={community.image}
        alt={`${community.title} community`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="right-4 bottom-4 left-4 absolute">
        <h3 className="mb-1 font-mono font-bold text-white text-lg">
          {community.title}
        </h3>
        <div className="flex items-center space-x-4 font-mono text-white/80 text-sm">
          <span>{community.members} members</span>
          <span>{community.activity}</span>
        </div>
      </div>
    </div>
    <div className="p-6">
      <p className="mb-4 font-mono text-gray-600 leading-relaxed">
        {community.description}
      </p>
      <a
        href="#"
        className="inline-flex items-center font-mono font-medium text-orange-500 hover:text-orange-600 transition-colors cursor-pointer"
      >
        Join Community →
      </a>
    </div>
  </article>
);

// Static stats data
const communityStats: CommunityStats[] = [
  {
    number: "25K+",
    label: "Active Developers",
    icon: <Users className="w-8 h-8 text-orange-500" />,
  },
  {
    number: "150+",
    label: "Communities",
    icon: <Globe className="w-8 h-8 text-orange-500" />,
  },
  {
    number: "2.3M+",
    label: "Code Reviews",
    icon: <Code2 className="w-8 h-8 text-orange-500" />,
  },
  {
    number: "45K+",
    label: "Projects Shared",
    icon: <Zap className="w-8 h-8 text-orange-500" />,
  },
];

// Static communities data
const featuredCommunities: CommunityHighlight[] = [
  {
    title: "React Developers",
    description:
      "Share React projects, discuss best practices, and collaborate on cutting-edge frontend applications. From hooks to server components.",
    members: "8.2K",
    activity: "Very Active",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop&auto=format&q=80",
  },
  {
    title: "AI & Machine Learning",
    description:
      "Explore artificial intelligence projects, share ML models, and discuss the latest developments in machine learning and data science.",
    members: "6.5K",
    activity: "Active",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&auto=format&q=80",
  },
  {
    title: "Open Source Contributors",
    description:
      "Connect with maintainers and contributors of popular open source projects. Find projects to contribute to and get mentorship.",
    members: "12.1K",
    activity: "Very Active",
    image:
      "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=200&fit=crop&auto=format&q=80",
  },
];

// Main server component
const CommunitiesSection = () => {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto px-6 max-w-7xl container">
        {/* Section Header */}
        <header className="mb-16 text-center">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Heart className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="font-mono font-medium text-gray-500 text-sm uppercase tracking-wider">
              Community
            </span>
          </div>
          <h2 className="mb-6 font-mono font-bold text-gray-900 text-4xl md:text-5xl">
            Join Developer Communities
          </h2>
          <p className="mx-auto max-w-3xl font-mono text-gray-600 text-xl leading-relaxed">
            Connect with like-minded developers, share knowledge, and grow
            together in specialized communities built around your interests and
            expertise.
          </p>
        </header>

        {/* Community Stats */}
        <div className="bg-white mb-16 p-8 border border-gray-200 rounded-2xl">
          <div className="gap-8 grid grid-cols-2 md:grid-cols-4">
            {communityStats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        </div>

        {/* Featured Communities */}
        <div className="mb-16">
          <h3 className="mb-8 font-mono font-bold text-gray-900 text-2xl text-center">
            Featured Communities
          </h3>
          <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {featuredCommunities.map((community, index) => (
              <CommunityCard key={index} community={community} />
            ))}
          </div>
        </div>

        {/* Community Features */}
        <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-8 border border-orange-200 rounded-2xl">
          <div className="items-center gap-12 grid grid-cols-1 md:grid-cols-2">
            <div>
              <h3 className="mb-6 font-mono font-bold text-gray-900 text-2xl">
                Why Join Our Communities?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MessageCircle className="mt-1 w-5 h-5 text-orange-500" />
                  <div>
                    <h4 className="mb-1 font-mono font-semibold text-gray-900">
                      Real-time Discussions
                    </h4>
                    <p className="font-mono text-gray-600 text-sm">
                      Get instant feedback and engage in meaningful
                      conversations
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Code2 className="mt-1 w-5 h-5 text-orange-500" />
                  <div>
                    <h4 className="mb-1 font-mono font-semibold text-gray-900">
                      Code Collaboration
                    </h4>
                    <p className="font-mono text-gray-600 text-sm">
                      Work together on projects and share best practices
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="mt-1 w-5 h-5 text-orange-500" />
                  <div>
                    <h4 className="mb-1 font-mono font-semibold text-gray-900">
                      Networking
                    </h4>
                    <p className="font-mono text-gray-600 text-sm">
                      Build professional relationships with industry experts
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <a
                href="#communities"
                className="inline-flex items-center bg-gradient-to-r from-orange-500 hover:from-orange-600 to-orange-600 hover:to-orange-700 px-8 py-4 rounded-lg font-mono font-semibold text-white text-lg hover:scale-105 transition-all duration-200 cursor-pointer transform"
              >
                Explore All Communities
              </a>
              <p className="mt-4 font-mono text-gray-500 text-sm">
                Free to join • No spam • Quality discussions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitiesSection;
