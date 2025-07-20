'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  showLabel = false, 
  className = "" 
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder that matches the button size
    return (
      <div className={`w-10 h-10 rounded-lg bg-surface animate-pulse ${className}`} />
    );
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      default:
        return 'System';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        group relative inline-flex items-center justify-center
        w-10 h-10 rounded-lg
        bg-surface hover:bg-surface-variant
        border border-border hover:border-border-variant
        text-muted hover:text-foreground
        transition-all duration-200
        hover:scale-105 active:scale-95
        ${className}
      `}
      title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
      aria-label="Toggle theme"
    >
      <div className="relative">
        {/* Icons with smooth transitions */}
        <div className="transform transition-all duration-300 ease-in-out">
          {getIcon()}
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
      
      {/* Optional label */}
      {showLabel && (
        <span className="ml-2 text-sm font-mono font-medium">
          {getLabel()}
        </span>
      )}
    </button>
  );
};

// Dropdown version for more options
export const ThemeDropdown: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-32 h-10 rounded-lg bg-surface animate-pulse ${className}`} />
    );
  }

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          inline-flex items-center justify-between
          w-32 px-3 py-2 rounded-lg
          bg-surface hover:bg-surface-variant
          border border-border hover:border-border-variant
          text-foreground
          transition-all duration-200
          hover:scale-105
        "
        aria-label="Select theme"
      >
        <div className="flex items-center space-x-2">
          <CurrentIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono font-medium">{currentTheme.label}</span>
        </div>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="
          absolute top-full mt-1 left-0 right-0
          bg-surface border border-border
          rounded-lg shadow-lg
          overflow-hidden
          z-50
        ">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = theme === themeOption.value;
            
            return (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2
                  text-left hover:bg-surface-variant
                  transition-colors duration-150
                  ${isSelected ? 'bg-primary/10 text-primary' : 'text-foreground'}
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-mono font-medium">{themeOption.label}</span>
                {isSelected && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeToggle; 