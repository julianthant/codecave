"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bell,
  Crown,
  Users,
  Monitor,
  Check,
  X,
  Shield,
  Users2,
  Rocket,
  Eye,
  Headphones,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Globe,
  Settings,
  User,
} from "lucide-react";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with codecave",
    features: [
      "5 public repositories",
      "Basic profile customization",
      "Community support",
      "Standard code highlighting",
      "Basic collaboration tools",
    ],
    limitations: [
      "No private repositories",
      "Limited storage (1GB)",
      "Basic analytics",
      "Community support only",
    ],
    popular: false,
    current: true,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "Enhanced features for serious developers",
    features: [
      "Unlimited public repositories",
      "10 private repositories",
      "Advanced profile themes",
      "Priority support",
      "Advanced code editor",
      "Team collaboration tools",
      "Analytics dashboard",
      "Custom domain support",
    ],
    limitations: [],
    popular: true,
    current: false,
  },
  {
    name: "Team",
    price: "$25",
    period: "per month",
    description: "Complete solution for development teams",
    features: [
      "Everything in Pro",
      "Unlimited private repositories",
      "Team management tools",
      "Advanced security features",
      "Custom integrations",
      "24/7 priority support",
      "Advanced analytics",
      "White-label options",
      "SSO integration",
    ],
    limitations: [],
    popular: false,
    current: false,
  },
];

const faqs = [
  {
    question: "What's included in the free plan?",
    answer:
      "The free plan includes 5 public repositories, basic profile customization, community support, and access to all core codecave features. It's perfect for individual developers getting started.",
  },
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments.",
  },
  {
    question: "Do you offer student discounts?",
    answer:
      "Yes, we offer 50% off Pro plans for verified students. Contact our support team with your student email and verification to apply for the discount.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans. All payments are processed securely through Stripe.",
  },
  {
    question: "Is there a team trial available?",
    answer:
      "Yes! We offer a 14-day free trial for the Team plan. No credit card required to start your trial.",
  },
  {
    question: "How does the storage limit work?",
    answer:
      "Storage includes all your repositories, assets, and project files. Free plans get 1GB, Pro gets 50GB, and Team plans get unlimited storage.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access to premium features until the end of your billing period.",
  },
  {
    question: "Do you offer custom enterprise solutions?",
    answer:
      "Yes! For larger organizations with specific needs, we offer custom enterprise solutions with dedicated support, on-premise deployment options, and custom integrations. Contact our sales team for more information.",
  },
];

export default function Premium() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Minimalistic Header */}
      <header className="top-0 z-50 sticky bg-background border-b border-border w-full">
        <div className="mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center h-12">
            {/* Left: Logo as Home Button */}
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex justify-center items-center bg-primary rounded w-6 h-6">
                <span className="font-bold text-primary-foreground text-sm">
                  C
                </span>
              </div>
              <span className="font-semibold text-foreground">codecave</span>
            </Link>

            {/* Center: Search */}
            <div className="flex-1 mx-8 max-w-md">
              <div className="relative">
                <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                <Input
                  placeholder="Search"
                  className="bg-muted/20 focus:bg-background py-1.5 pr-4 pl-10 border-0 rounded-md focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground text-sm transition-all"
                />
              </div>
            </div>

            {/* Right: Navigation Icons */}
            <nav className="flex items-center space-x-0.5">
              <Link href="/network">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center space-y-0.5 px-2 py-1.5 h-auto text-muted-foreground hover:text-primary transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span className="font-medium text-[10px] leading-none">
                    Network
                  </span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center space-y-0.5 px-2 py-1.5 h-auto text-primary transition-colors"
              >
                <Crown className="w-4 h-4" />
                <span className="font-medium text-[10px] leading-none">
                  Premium
                </span>
              </Button>

              <Link href="/collaboration">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center space-y-0.5 px-2 py-1.5 h-auto text-muted-foreground hover:text-primary transition-colors"
                >
                  <Monitor className="w-4 h-4" />
                  <span className="font-medium text-[10px] leading-none">
                    Collaborate
                  </span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="relative flex flex-col items-center space-y-0.5 px-2 py-1.5 h-auto text-muted-foreground hover:text-primary transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="font-medium text-[10px] leading-none">
                  Notifications
                </span>
                <span className="top-0.5 right-1 absolute bg-accent rounded-full w-2 h-2"></span>
              </Button>

              <div className="group relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center space-y-0.5 px-2 py-1.5 h-auto text-muted-foreground hover:text-primary transition-colors"
                >
                  <Avatar className="w-4 h-4">
                    <AvatarImage src="/api/placeholder/16/16" />
                    <AvatarFallback className="bg-primary/20 text-[8px] text-primary">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-[10px] leading-none">
                    Me
                  </span>
                </Button>

                {/* Profile Dropdown */}
                <div className="invisible group-hover:visible top-full right-0 z-50 absolute bg-card opacity-0 group-hover:opacity-100 shadow-lg mt-2 border border-border rounded-md w-48 transition-all duration-200">
                  <div className="p-3 border-b border-border">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/api/placeholder/32/32" />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">John Developer</p>
                        <p className="text-muted-foreground text-xs">
                          @johndeveloper
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block hover:bg-muted px-3 py-2 text-sm transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Your Profile</span>
                      </div>
                    </Link>
                    <button className="hover:bg-muted px-3 py-2 w-full text-sm text-left transition-colors">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </div>
                    </button>
                    <div className="my-1 border-t border-border"></div>
                    <button className="hover:bg-muted px-3 py-2 w-full text-sm text-left transition-colors">
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="flex justify-center items-center mb-4">
            <Crown className="mr-3 w-12 h-12 text-primary" />
            <h1 className="font-bold text-4xl">codecave Premium</h1>
          </div>
          <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
            Unlock advanced features and take your development workflow to the
            next level
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="gap-8 grid grid-cols-1 md:grid-cols-3 mb-16">
          {pricingTiers.map((tier, index) => (
            <Card
              key={index}
              className={`border-border/50 relative ${
                tier.popular ? "border-primary bg-primary/5" : "bg-card/50"
              } ${tier.current ? "ring-2 ring-accent" : ""}`}
            >
              {tier.popular && (
                <div className="-top-3 left-1/2 absolute -translate-x-1/2 transform">
                  <Badge className="bg-primary text-primary-foreground">
                    <Sparkles className="mr-1 w-3 h-3" />
                    Most Popular
                  </Badge>
                </div>
              )}
              {tier.current && (
                <div className="-top-3 right-4 absolute">
                  <Badge
                    variant="outline"
                    className="bg-accent border-accent text-accent-foreground"
                  >
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4 text-center">
                <h3 className="font-bold text-2xl">{tier.name}</h3>
                <div className="flex justify-center items-baseline">
                  <span className="font-bold text-4xl">{tier.price}</span>
                  <span className="ml-2 text-muted-foreground">
                    / {tier.period}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {tier.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start space-x-2"
                    >
                      <Check className="flex-shrink-0 mt-0.5 w-4 h-4 text-green-400" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {tier.limitations.map((limitation, limitIndex) => (
                    <li key={limitIndex} className="flex items-start space-x-2">
                      <X className="flex-shrink-0 mt-0.5 w-4 h-4 text-red-400" />
                      <span className="text-muted-foreground text-sm">
                        {limitation}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    tier.current
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : tier.popular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                  }`}
                  disabled={tier.current}
                >
                  {tier.current
                    ? "Current Plan"
                    : tier.name === "Free"
                      ? "Downgrade"
                      : `Upgrade to ${tier.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="mb-12 font-bold text-3xl text-center">
            Premium Features
          </h2>
          <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <Shield className="mx-auto mb-4 w-12 h-12 text-primary" />
                <h3 className="mb-2 font-semibold">Advanced Security</h3>
                <p className="text-muted-foreground text-sm">
                  Enhanced security features including 2FA, audit logs, and
                  private repositories
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <Users2 className="mx-auto mb-4 w-12 h-12 text-primary" />
                <h3 className="mb-2 font-semibold">Team Collaboration</h3>
                <p className="text-muted-foreground text-sm">
                  Advanced team management tools, shared workspaces, and
                  collaboration features
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <Rocket className="mx-auto mb-4 w-12 h-12 text-primary" />
                <h3 className="mb-2 font-semibold">Performance</h3>
                <p className="text-muted-foreground text-sm">
                  Faster load times, priority CDN access, and enhanced
                  performance monitoring
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <Headphones className="mx-auto mb-4 w-12 h-12 text-primary" />
                <h3 className="mb-2 font-semibold">Priority Support</h3>
                <p className="text-muted-foreground text-sm">
                  24/7 priority support with dedicated team members and faster
                  response times
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <Eye className="mx-auto mb-4 w-12 h-12 text-primary" />
                <h3 className="mb-2 font-semibold">Advanced Analytics</h3>
                <p className="text-muted-foreground text-sm">
                  Detailed insights, performance metrics, and comprehensive
                  analytics dashboard
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <Globe className="mx-auto mb-4 w-12 h-12 text-primary" />
                <h3 className="mb-2 font-semibold">Custom Domain</h3>
                <p className="text-muted-foreground text-sm">
                  Use your own domain for your codecave profile and repositories
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="mb-12 font-bold text-3xl text-center">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto max-w-3xl">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card/50 mb-4 border-border/50">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center hover:bg-muted/50 p-6 w-full text-left transition-colors"
                  >
                    <h3 className="font-semibold">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-primary/5 border-primary/50 text-center">
          <CardContent className="p-8">
            <h2 className="mb-4 font-bold text-2xl">
              Ready to upgrade your coding experience?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Join thousands of developers who have unlocked their potential
              with codecave Premium
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Crown className="mr-2 w-4 h-4" />
                Upgrade to Pro
              </Button>
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
