"use client";

import React from "react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  isOpen,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="md:hidden p-2 text-muted hover:text-foreground transition-colors"
    aria-label="Toggle navigation menu"
  >
    <svg
      className={`h-6 w-6 transform transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {isOpen ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  </button>
);

interface MobileMenuProps {
  isOpen: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-border/50">
      <nav className="space-y-2 px-4 py-4">
        <a
          href="#features"
          className="block px-3 py-3 border-b border-border/50 font-mono font-medium text-muted hover:text-foreground text-sm transition-colors duration-200"
        >
          Features
        </a>
        <a
          href="/trending"
          className="block px-3 py-3 border-b border-border/50 font-mono font-medium text-muted hover:text-foreground text-sm transition-colors duration-200"
        >
          Trending
        </a>
        <a
          href="#community"
          className="block px-3 py-3 border-b border-border/50 font-mono font-medium text-muted hover:text-foreground text-sm transition-colors duration-200"
        >
          Community
        </a>
        <a
          href="#pricing"
          className="block px-3 py-3 border-b border-border/50 font-mono font-medium text-muted hover:text-foreground text-sm transition-colors duration-200"
        >
          Pro
        </a>
        <div className="pt-4">
          <button className="group flex justify-center items-center space-x-2 bg-primary/10 hover:bg-primary/20 px-6 py-3 border border-primary/30 hover:border-primary/50 rounded-lg w-full font-mono font-medium text-primary text-sm hover:scale-105 transition-all duration-200">
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span>Explore Projects</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

interface MobileMenuToggleProps {}

const MobileMenuToggle: React.FC<MobileMenuToggleProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <MobileMenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
      <MobileMenu isOpen={isMobileMenuOpen} />
    </>
  );
};

export default MobileMenuToggle;
