"use client";
import { useState } from "react";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Terminal,
  Check,
  Star,
  Users,
  TrendingUp,
  Rocket,
  Crown,
  Briefcase,
} from "lucide-react";

const pricingPlans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started and exploring the community",
    popular: false,
    features: [
      "Create developer profile",
      "Post projects and updates",
      "Comment and like posts",
      "Join public groups",
      "Basic Q&A participation",
      "Up to 3 images per post",
      "Standard profile customization",
      "Community support",
    ],
    limitations: [
      "Limited to 5 project posts per month",
      "No advanced analytics",
      "No priority support",
      "Basic search functionality",
    ],
    cta: "Get Started Free",
    color: "border-border",
  },
  {
    name: "Pro",
    price: 9.99,
    period: "month",
    description: "For serious developers who want to maximize their impact",
    popular: true,
    features: [
      "Everything in Free",
      "Unlimited project posts",
      "Advanced analytics dashboard",
      "Priority support",
      "Pro badge verification",
      "Up to 15 images per post",
      "Custom profile themes",
      "Post scheduling",
      "Advanced search filters",
      "Export your data",
      "Early access to new features",
    ],
    limitations: [],
    cta: "Start Pro Trial",
    color: "border-primary",
    highlight: true,
  },
  {
    name: "Team",
    price: 29.99,
    period: "month",
    description: "Perfect for development teams and organizations",
    popular: false,
    features: [
      "Everything in Pro",
      "Team collaboration tools",
      "Shared project workspaces",
      "Team analytics and insights",
      "Priority job board access",
      "Custom team branding",
      "Advanced project management",
      "Team member permissions",
      "Dedicated account manager",
      "SSO integration",
      "API access",
    ],
    limitations: [],
    cta: "Contact Sales",
    color: "border-accent",
  },
];

const addOnServices = [
  {
    name: "Promoted Posts",
    price: "5-50",
    unit: "per post",
    description: "Boost your project visibility and reach more developers",
    icon: <TrendingUp className="w-6 h-6" />,
    features: [
      "Increased visibility in feeds",
      "Priority placement in search",
      "Cross-platform promotion",
      "Analytics and reach metrics",
    ],
  },
  {
    name: "Job Posting",
    price: "99",
    unit: "per listing",
    description: "Post job opportunities and find top developer talent",
    icon: <Briefcase className="w-6 h-6" />,
    features: [
      "30-day active listing",
      "Advanced candidate filtering",
      "Direct messaging with applicants",
      "Hiring analytics dashboard",
    ],
  },
  {
    name: "Talent Database Access",
    price: "199",
    unit: "per month",
    description: "Search and contact developers in our talent database",
    icon: <Users className="w-6 h-6" />,
    features: [
      "Search by skills and experience",
      "Contact up to 50 developers/month",
      "Advanced filtering options",
      "Talent recommendations",
    ],
  },
];

const faqs = [
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll pro-rate any billing differences.",
  },
  {
    question: "Is there a free trial for Pro plans?",
    answer:
      "Yes, we offer a 14-day free trial for Pro plans. No credit card required to start your trial.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely through Stripe.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely! You can cancel your subscription at any time. Your access will continue until the end of your billing period.",
  },
  {
    question: "Do you offer discounts for students or startups?",
    answer:
      "Yes! We offer 50% discounts for students with valid .edu email addresses and special pricing for early-stage startups. Contact us for details.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "Your public posts and profile remain visible on the platform. You can export all your data before canceling, and we'll keep your account data for 30 days in case you want to reactivate.",
  },
];

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const getDiscountedPrice = (price: number) => {
    return billingPeriod === "yearly" ? price * 12 * 0.8 : price;
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="top-0 z-50 sticky bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b border-border/50 w-full">
        <div className="flex items-center px-4 h-16 container">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2 font-mono">
              <Terminal className="w-6 h-6 text-primary neon-glow" />
              <span className="font-bold text-xl tracking-tight">
                <span className="text-primary">vibe</span>
                <span className="text-accent">coding</span>
                <span className="text-muted-foreground animate-pulse">_</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 py-12 container">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-bold text-4xl">
            Choose Your <span className="text-primary">Developer Journey</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-xl">
            Join thousands of developers building amazing projects together.
            Start free and upgrade as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <span
              className={`text-sm ${billingPeriod === "monthly" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingPeriod(
                  billingPeriod === "monthly" ? "yearly" : "monthly"
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingPeriod === "yearly" ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === "yearly" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm ${billingPeriod === "yearly" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Yearly
            </span>
            {billingPeriod === "yearly" && (
              <Badge
                variant="outline"
                className="border-green-500 text-green-400"
              >
                Save 20%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="gap-8 grid grid-cols-1 md:grid-cols-3 mb-16">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.color} ${plan.highlight ? "bg-card/70" : "bg-card/50"} ${
                plan.highlight ? "ring-2 ring-primary/50" : ""
              }`}
            >
              {plan.popular && (
                <div className="-top-3 left-1/2 absolute -translate-x-1/2 transform">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="mr-1 w-3 h-3" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="text-center">
                  <h3 className="mb-2 font-bold text-2xl">{plan.name}</h3>
                  <div className="mb-2">
                    {plan.price === 0 ? (
                      <span className="font-bold text-4xl">Free</span>
                    ) : (
                      <>
                        <span className="font-bold text-4xl">
                          $
                          {billingPeriod === "yearly"
                            ? Math.round(getDiscountedPrice(plan.price))
                            : plan.price}
                        </span>
                        <span className="text-muted-foreground">
                          /{billingPeriod === "yearly" ? "year" : plan.period}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="pt-4 border-t border-border/50">
                    <p className="mb-2 text-muted-foreground text-xs">
                      Limitations:
                    </p>
                    <div className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <div className="flex justify-center items-center w-4 h-4">
                            <div className="bg-muted-foreground rounded-full w-1 h-1"></div>
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {limitation}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  className={`w-full ${plan.highlight ? "neon-glow" : ""}`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-on Services */}
        <div className="mb-16">
          <div className="mb-8 text-center">
            <h2 className="mb-4 font-bold text-3xl">Add-on Services</h2>
            <p className="text-muted-foreground">
              Supercharge your developer presence with our premium services
            </p>
          </div>

          <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
            {addOnServices.map((service) => (
              <Card key={service.name} className="bg-card/50 border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-primary">{service.icon}</div>
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        ${service.price} {service.unit}
                      </p>
                    </div>
                  </div>

                  <p className="mb-4 text-muted-foreground text-sm">
                    {service.description}
                  </p>

                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enterprise Section */}
        <Card className="bg-card/50 mb-16 border-border/50">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <Crown className="w-12 h-12 text-accent" />
            </div>
            <h2 className="mb-4 font-bold text-2xl">Enterprise Solutions</h2>
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              Need custom solutions for your organization? We offer enterprise
              plans with advanced security, compliance, and custom integrations.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline">Schedule Demo</Button>
              <Button>Contact Sales</Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="mb-8 text-center">
            <h2 className="mb-4 font-bold text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="space-y-4 mx-auto max-w-3xl">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card/50 border-border/50">
                <CardContent className="p-0">
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="flex justify-between items-center hover:bg-muted/20 p-4 w-full text-left transition-colors"
                  >
                    <span className="font-medium">{faq.question}</span>
                    <div
                      className={`transform transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}
                    >
                      <ArrowLeft className="w-4 h-4 rotate-90" />
                    </div>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">
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
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-border/50">
          <CardContent className="p-8 text-center">
            <h2 className="mb-4 font-bold text-2xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Join thousands of developers already building amazing projects on
              VibeCoding
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="neon-glow">
                <Rocket className="mr-2 w-4 h-4" />
                Start Free Today
              </Button>
              <Button size="lg" variant="outline">
                Talk to Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
