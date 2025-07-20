import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import CodecaveLogo from '../ui/codecave-logo';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

// Server-side FooterColumn component
const FooterColumn: React.FC<{ section: FooterSection }> = ({ section }) => (
  <div>
    <h3 className="font-semibold font-mono text-white mb-6">
      {section.title}
    </h3>
    <ul className="space-y-4">
      {section.links.map((link, index) => (
        <li key={index}>
          <a
            href={link.href}
            className="text-gray-400 hover:text-white transition-colors font-mono text-sm cursor-pointer"
          >
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

// Server-side SocialIcon component
const SocialIcon: React.FC<{ social: SocialLink }> = ({ social }) => (
  <a
    href={social.href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 hover:bg-orange-500 text-gray-400 hover:text-white transition-all duration-200 cursor-pointer"
    title={social.name}
  >
    {social.icon}
  </a>
);

// Static footer data - professional and relevant links only
const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "API Documentation", href: "/docs/api" },
      { name: "Integrations", href: "/integrations" }
    ]
  },
  {
    title: "Community",
    links: [
      { name: "Trending Projects", href: "#trending" },
      { name: "Developers", href: "/developers" },
      { name: "Communities", href: "#communities" },
      { name: "Code Reviews", href: "/reviews" },
      { name: "GitHub", href: "https://github.com/codecave" }
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/docs" },
      { name: "Getting Started", href: "/get-started" },
      { name: "Tutorials", href: "/tutorials" },
      { name: "Blog", href: "/blog" },
      { name: "Changelog", href: "/changelog" }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" }
    ]
  }
];

const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/codecave",
    icon: <Github className="w-5 h-5" />
  },
  {
    name: "Twitter",
    href: "https://twitter.com/codecave_dev",
    icon: <Twitter className="w-5 h-5" />
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/codecave",
    icon: <Linkedin className="w-5 h-5" />
  },
  {
    name: "Email",
    href: "mailto:hello@codecave.tech",
    icon: <Mail className="w-5 h-5" />
  }
];

// Main server component
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <CodecaveLogo size="md" className="text-white" />
                  <span className="text-2xl font-bold font-mono text-white">
                    CodeCave
                  </span>
                </div>
                <p className="text-gray-400 font-mono leading-relaxed mb-8">
                  The focused platform for project creators and developers. 
                  Showcase your work, collaborate with peers, and grow your skills 
                  in a community built by developers, for developers.
                </p>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <SocialIcon key={index} social={social} />
                ))}
              </div>
            </div>
            
            {/* Footer Links */}
            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerSections.map((section, index) => (
                <FooterColumn key={index} section={section} />
              ))}
            </div>
            
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            
            {/* Copyright */}
            <div className="flex items-center text-gray-400 font-mono text-sm mb-4 md:mb-0">
              <span>{currentYear} CodeCave. All rights reserved.</span>
            </div>
            
            {/* Additional Links */}
            <div className="flex items-center space-x-6 text-gray-400 font-mono text-sm">
              <a 
                href="/sitemap" 
                className="hover:text-white transition-colors cursor-pointer"
              >
                Sitemap
              </a>
              <a 
                href="/status" 
                className="hover:text-white transition-colors cursor-pointer"
              >
                System Status
              </a>
              <div className="flex items-center space-x-1">
                <span>Built with Next.js</span>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer; 