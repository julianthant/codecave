import React from "react";
import { Github, Twitter, Linkedin, Mail, Code } from "lucide-react";
import { Logo } from "../ui/logo";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Showcase", href: "/showcase" },
    { name: "Pricing", href: "/tiers" },
    { name: "API Docs", href: "/docs" },
  ],
  community: [
    { name: "Discord", href: "#" },
    { name: "Forum", href: "#" },
    { name: "Events", href: "#" },
    { name: "Blog", href: "#" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "Tutorials", href: "#" },
    { name: "Examples", href: "#" },
    { name: "Support", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Privacy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="py-8 border-t border-border/30">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex md:flex-row flex-col justify-between items-center space-y-4 md:space-y-0">
          <div className="text-landing-muted-foreground text-sm">
            © 2025 codecave. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <a
              href="#"
              className="text-landing-muted-foreground hover:text-landing-foreground transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-landing-muted-foreground hover:text-landing-foreground transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-landing-muted-foreground hover:text-landing-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
