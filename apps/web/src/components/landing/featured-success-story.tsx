import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SuccessStat {
  percentage: string;
  description: string;
}

// Server-side StatCard component with Base44 styling
const StatCard: React.FC<{ stat: SuccessStat }> = ({ stat }) => (
  <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-200">
    <div className="text-4xl font-bold font-mono text-orange-600 mb-2">
      {stat.percentage}
    </div>
    <div className="text-gray-600 font-mono text-sm leading-relaxed">
      {stat.description}
    </div>
  </div>
);

// Static success story data
const successStats: SuccessStat[] = [
  {
    percentage: "200%",
    description: "increase in organic traffic"
  },
  {
    percentage: "150%", 
    description: "rise in online sales"
  },
  {
    percentage: "75%",
    description: "reduction in cost-per-click (CPC)"
  },
  {
    percentage: "300%",
    description: "improvement in conversion rate"
  }
];

// Main server component with Base44 light theme
const FeaturedSuccessStory: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 text-white overflow-hidden relative">
          
          {/* Background decoration with Base44 inspired colors */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/30 to-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-orange-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            {/* Badge with Base44 green accent */}
            <div className="inline-flex items-center mb-8">
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-mono font-semibold">
                Featured Success Story
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Content */}
              <div>
                <h2 className="text-4xl md:text-5xl font-bold font-mono text-white mb-6 leading-tight">
                  Scaling Success for a Leading E-Commerce Brand
                </h2>
                
                <p className="text-gray-300 font-mono text-lg leading-relaxed mb-8">
                  Through a comprehensive SEO and PPC strategy, we helped 
                  this e-commerce brand increase visibility, drive traffic, and 
                  boost sales using our developer-focused platform.
                </p>

                <a
                  href="#case-study"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-mono font-medium transition-all duration-200 transform hover:scale-105 cursor-pointer"
                >
                  <span>Read</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Right Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {successStats.map((stat, index) => (
                  <StatCard key={index} stat={stat} />
                ))}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSuccessStory; 