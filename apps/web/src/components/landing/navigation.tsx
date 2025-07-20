import React from 'react';
import { ArrowRight } from 'lucide-react';
import CodecaveLogo from '../ui/codecave-logo';
import MobileMenuToggle from './mobile-menu-toggle';
import ScrollNavigation from './scroll-navigation';
import { ThemeToggle } from '../ui/theme-toggle';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className = '' }) => (
  <a
    href={href}
    className={`px-3 py-2 text-sm font-mono font-medium text-foreground/80 hover:text-foreground transition-colors duration-200 cursor-pointer ${className}`}
  >
    {children}
  </a>
);

const Navigation: React.FC = () => {
  return (
    <ScrollNavigation>
      <nav className="container mx-auto px-6 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <CodecaveLogo 
              size="md" 
              showText={true}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#trending">Trending</NavLink>
            <NavLink href="#community">Community</NavLink>
            <NavLink href="#pricing">Tiers</NavLink>
          </div>

          {/* Primary Action & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            <div className="hidden md:block">
              <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-matte to-secondary-matte hover:from-primary-matte hover:to-secondary-matte text-white px-6 py-2.5 rounded-lg font-mono font-medium text-sm hover:scale-105 transition-all duration-200 group cursor-pointer border-none">
                <span>Explore</span>
              </button>
              
            </div>
            
            <MobileMenuToggle />
          </div>
        </div>
      </nav>
    </ScrollNavigation>
  );
};

export default Navigation; 