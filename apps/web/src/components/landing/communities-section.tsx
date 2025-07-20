import React from 'react';
import { Users, MessageCircle, Globe, Zap, Heart, Code2 } from 'lucide-react';

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
const StatCard: React.FC<{ stat: CommunityStats }> = ({ stat }) => (
  <div className="text-center p-6">
    <div className="flex justify-center mb-4">
      {stat.icon}
    </div>
    <div className="text-3xl font-bold font-mono text-orange-500 mb-2">
      {stat.number}
    </div>
    <div className="text-gray-600 font-mono text-sm">
      {stat.label}
    </div>
  </div>
);

// Server-side CommunityCard component
const CommunityCard: React.FC<{ community: CommunityHighlight }> = ({ community }) => (
  <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-orange-300 transition-all duration-300 group">
    <div className="relative h-48 overflow-hidden">
      <img 
        src={community.image} 
        alt={`${community.title} community`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="text-white font-bold font-mono text-lg mb-1">
          {community.title}
        </h3>
        <div className="flex items-center space-x-4 text-white/80 text-sm font-mono">
          <span>{community.members} members</span>
          <span>{community.activity}</span>
        </div>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-600 font-mono leading-relaxed mb-4">
        {community.description}
      </p>
              <a 
          href="#"
          className="text-orange-500 font-mono font-medium hover:text-orange-600 transition-colors cursor-pointer inline-flex items-center"
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
    icon: <Users className="w-8 h-8 text-orange-500" />
  },
  {
    number: "150+",
    label: "Communities",
    icon: <Globe className="w-8 h-8 text-orange-500" />
  },
  {
    number: "2.3M+",
    label: "Code Reviews",
    icon: <Code2 className="w-8 h-8 text-orange-500" />
  },
  {
    number: "45K+",
    label: "Projects Shared",
    icon: <Zap className="w-8 h-8 text-orange-500" />
  }
];

// Static communities data
const featuredCommunities: CommunityHighlight[] = [
  {
    title: "React Developers",
    description: "Share React projects, discuss best practices, and collaborate on cutting-edge frontend applications. From hooks to server components.",
    members: "8.2K",
    activity: "Very Active",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop&auto=format&q=80"
  },
  {
    title: "AI & Machine Learning",
    description: "Explore artificial intelligence projects, share ML models, and discuss the latest developments in machine learning and data science.",
    members: "6.5K",
    activity: "Active",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&auto=format&q=80"
  },
  {
    title: "Open Source Contributors",
    description: "Connect with maintainers and contributors of popular open source projects. Find projects to contribute to and get mentorship.",
    members: "12.1K",
    activity: "Very Active",
    image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=200&fit=crop&auto=format&q=80"
  }
];

// Main server component
const CommunitiesSection: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Section Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Heart className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-sm font-medium font-mono text-gray-500 uppercase tracking-wider">Community</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-gray-900 mb-6">
            Join Developer Communities
          </h2>
          <p className="text-xl text-gray-600 font-mono max-w-3xl mx-auto leading-relaxed">
            Connect with like-minded developers, share knowledge, and grow together 
            in specialized communities built around your interests and expertise.
          </p>
        </header>

        {/* Community Stats */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {communityStats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        </div>

        {/* Featured Communities */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold font-mono text-gray-900 mb-8 text-center">
            Featured Communities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCommunities.map((community, index) => (
              <CommunityCard key={index} community={community} />
            ))}
          </div>
        </div>

        {/* Community Features */}
                  <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl p-8 border border-orange-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold font-mono text-gray-900 mb-6">
                Why Join Our Communities?
              </h3>
              <div className="space-y-4">
                                 <div className="flex items-start space-x-3">
                   <MessageCircle className="w-5 h-5 text-orange-500 mt-1" />
                   <div>
                     <h4 className="font-semibold font-mono text-gray-900 mb-1">Real-time Discussions</h4>
                     <p className="text-gray-600 font-mono text-sm">Get instant feedback and engage in meaningful conversations</p>
                   </div>
                 </div>
                 <div className="flex items-start space-x-3">
                   <Code2 className="w-5 h-5 text-orange-500 mt-1" />
                   <div>
                     <h4 className="font-semibold font-mono text-gray-900 mb-1">Code Collaboration</h4>
                     <p className="text-gray-600 font-mono text-sm">Work together on projects and share best practices</p>
                   </div>
                 </div>
                 <div className="flex items-start space-x-3">
                   <Users className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold font-mono text-gray-900 mb-1">Networking</h4>
                    <p className="text-gray-600 font-mono text-sm">Build professional relationships with industry experts</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <a
                href="#communities"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg font-semibold font-mono text-lg inline-flex items-center transition-all duration-200 transform hover:scale-105 cursor-pointer"
              >
                Explore All Communities
              </a>
              <p className="text-gray-500 font-mono text-sm mt-4">
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