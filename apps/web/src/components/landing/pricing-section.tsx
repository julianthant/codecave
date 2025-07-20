import React from 'react';
import { Check, X, Zap, Crown, Users } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: Array<{
    name: string;
    included: boolean;
  }>;
  recommended?: boolean;
  cta: string;
  icon: React.ReactNode;
}

// Server-side PricingCard component
const PricingCard: React.FC<{ plan: PricingPlan }> = ({ plan }) => (
  <article className={`relative rounded-2xl border p-8 transition-all duration-300 hover:shadow-lg ${
    plan.recommended 
      ? 'border-orange-500 bg-gradient-to-b from-orange-50 to-transparent shadow-lg scale-105' 
      : 'border-gray-200 bg-white hover:border-orange-300'
  }`}>
    {plan.recommended && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-mono font-semibold">
          Most Popular
        </div>
      </div>
    )}
    
    <header className="text-center mb-8">
      <div className="flex justify-center mb-4">
        {plan.icon}
      </div>
      <h3 className="text-2xl font-bold font-mono text-gray-900 mb-2">
        {plan.name}
      </h3>
      <p className="text-gray-600 font-mono text-sm mb-6">
        {plan.description}
      </p>
      <div className="mb-2">
        <span className="text-4xl font-bold font-mono text-gray-900">
          {plan.price}
        </span>
        <span className="text-gray-500 font-mono text-lg">
          /{plan.period}
        </span>
      </div>
    </header>

    <div className="space-y-4 mb-8">
      {plan.features.map((feature, index) => (
        <div key={index} className="flex items-center space-x-3">
          {feature.included ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <X className="w-5 h-5 text-gray-400" />
          )}
          <span className={`font-mono text-sm ${
            feature.included ? 'text-gray-900' : 'text-gray-400'
          }`}>
            {feature.name}
          </span>
        </div>
      ))}
    </div>

    <footer className="text-center">
      <a
        href="#signup"
        className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-mono font-semibold text-sm transition-all duration-200 cursor-pointer ${
          plan.recommended
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transform hover:scale-105'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900 hover:scale-105'
        }`}
      >
        {plan.cta}
      </a>
    </footer>
  </article>
);

// Static pricing plans data
const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for individual developers getting started",
    icon: <Users className="w-8 h-8 text-gray-600" />,
    features: [
      { name: "5 public projects", included: true },
      { name: "Community access", included: true },
      { name: "Basic code reviews", included: true },
      { name: "Standard support", included: true },
      { name: "Private projects", included: false },
      { name: "Advanced analytics", included: false },
      { name: "Priority support", included: false },
      { name: "Custom domains", included: false }
    ],
    cta: "Get Started Free"
  },
  {
    name: "Pro",
    price: "$12",
    period: "month",
    description: "For professional developers who need more features",
    icon: <Zap className="w-8 h-8 text-orange-500" />,
    recommended: true,
    features: [
      { name: "Unlimited public projects", included: true },
      { name: "10 private projects", included: true },
      { name: "Community access", included: true },
      { name: "Advanced code reviews", included: true },
      { name: "Analytics dashboard", included: true },
      { name: "Priority support", included: true },
      { name: "Custom domains", included: false },
      { name: "Team collaboration", included: false }
    ],
    cta: "Start Pro Trial"
  },
  {
    name: "Team",
    price: "$39",
    period: "month",
    description: "For teams and organizations building together",
    icon: <Crown className="w-8 h-8 text-secondary" />,
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Unlimited private projects", included: true },
      { name: "Team collaboration tools", included: true },
      { name: "Custom domains", included: true },
      { name: "Advanced analytics", included: true },
      { name: "White-label options", included: true },
      { name: "Dedicated support", included: true },
      { name: "SSO integration", included: true }
    ],
    cta: "Contact Sales"
  }
];

// Main server component
const PricingSection: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Section Header - Minimal variant */}
        <header className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold font-mono text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-blue-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 font-mono max-w-3xl mx-auto leading-relaxed">
            Start free and scale as you grow. All plans include access to our community 
            and core features. Upgrade anytime for additional capabilities.
          </p>
          <div className="text-sm font-medium font-mono text-gray-400 uppercase tracking-wider mt-4">
            Pricing Plans
          </div>
        </header>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default PricingSection; 