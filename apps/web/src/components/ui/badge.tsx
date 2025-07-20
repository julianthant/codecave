import React from 'react';

type BadgeVariant = 'default' | 'secondary' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const getVariantClasses = (variant: BadgeVariant): string => {
  const variants = {
    default: 'bg-primary text-white',
    secondary: 'bg-gray-100 text-gray-700',
    outline: 'border border-gray-300 text-gray-600 bg-white',
  };
  
  return variants[variant];
};

// Badge component
export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium font-mono';
  const variantClasses = getVariantClasses(variant);

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

// Default export
export default Badge; 