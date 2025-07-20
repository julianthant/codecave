'use client';

import React, { useRef } from 'react';

interface ScrollNavigationProps {
  children: React.ReactNode;
}

const ScrollNavigation: React.FC<ScrollNavigationProps> = ({ children }) => {
  const cleanupRef = useRef<(() => void) | null>(null);

  const headerRef = (element: HTMLElement | null) => {
    // Cleanup previous listener if it exists
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    if (!element) return;

    const updateNavbarStyle = () => {
      const scrollY = window.scrollY || window.pageYOffset;

      if (scrollY < 5) {
        // At top — fully transparent
        element.style.backgroundColor = 'transparent';
        element.style.backdropFilter = 'none';
        element.style.borderBottom = 'none';
        element.style.boxShadow = 'none';
        element.style.opacity = '1';
      } else {
        // Scrolled — opaque with blur + subtle shadow
        element.style.backgroundColor = 'hsl(var(--background))';
        element.style.backdropFilter = 'blur(8px)';
        element.style.boxShadow = '0 1px 3px 0 hsl(var(--foreground) / 0.1)';
        element.style.opacity = '1';
      }
    };

    // Set initial state
    updateNavbarStyle();

    // Add scroll listener with animation frame throttling
    const handleScroll = () => {
      requestAnimationFrame(updateNavbarStyle);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Store cleanup function
    cleanupRef.current = () => {
      window.removeEventListener('scroll', handleScroll);
    };
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 w-full z-50"
      style={{
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
        backgroundColor: 'transparent'
      }}
    >
      {children}
    </header>
  );
};

export default ScrollNavigation;