import React from "react";
import CodecaveLogo from "../ui/codecave-logo";
import MobileMenuToggle from "./mobile-menu-toggle";
import ScrollNavigation from "./scroll-navigation";
import { ThemeToggle } from "../ui/theme-toggle";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  className = "",
}) => (
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
      <nav className="relative mx-auto px-6 container">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <CodecaveLogo
              size="md"
              showText={true}
              className="hover:opacity-80 transition-opacity cursor-pointer"
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
              <button className="group inline-flex items-center space-x-2 bg-gradient-to-r from-primary-matte hover:from-primary-matte to-secondary-matte hover:to-secondary-matte px-6 py-2.5 border-none rounded-lg font-mono font-medium text-white text-sm hover:scale-105 transition-all duration-200 cursor-pointer">
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
