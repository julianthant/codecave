import React from 'react';
import { LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'muted';
type ButtonSize = 'sm' | 'md' | 'lg';


interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

interface ButtonProps extends BaseButtonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {}

interface LinkButtonProps extends BaseButtonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  href: string;
}

// Base button styles using project theme
const getVariantClasses = (variant: ButtonVariant): string => {
  const variants = {
    // Primary: Matte purple with project theme
    primary: 'bg-primary text-white hover:bg-primary/90 border border-primary hover:border-primary/90 font-semibold',
    
    // Secondary: Matte blue with project theme  
    secondary: 'bg-secondary text-white hover:bg-secondary/90 border border-secondary hover:border-secondary/90 font-semibold',
    
    // Outline: Transparent with primary border
    outline: 'bg-transparent text-primary border border-primary/30 hover:border-primary/50 hover:bg-primary/5 font-medium',
    
    // Ghost: Minimal styling
    ghost: 'bg-transparent text-muted hover:text-foreground hover:bg-surface/50 border border-transparent font-medium',
    
    // Muted: Surface background
    muted: 'bg-surface text-foreground hover:bg-surface-variant border border-border hover:border-border-variant font-medium',
  };
  
  return variants[variant];
};

const getSizeClasses = (size: ButtonSize): string => {
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };
  
  return sizes[size];
};

// Base button component
export const BaseButton: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-mono rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="h-4 w-4" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="ml-2 h-4 w-4" />}
    </button>
  );
};

// Link button component
export const LinkButton: React.FC<LinkButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  children,
  className = '',
  href,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-mono rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] gap-2';
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);

  return (
    <a
      href={href}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="h-4 w-4"/>}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="h-4 w-4" />}
    </a>
  );
};

// Export individual variants for convenience
export const PrimaryButton: React.FC<ButtonProps> = (props) => (
  <BaseButton variant="primary" {...props} />
);

export const SecondaryButton: React.FC<ButtonProps> = (props) => (
  <BaseButton variant="secondary" {...props} />
);

export const OutlineButton: React.FC<ButtonProps> = (props) => (
  <BaseButton variant="outline" {...props} />
);

export const GhostButton: React.FC<ButtonProps> = (props) => (
  <BaseButton variant="ghost" {...props} />
);

export const MutedButton: React.FC<ButtonProps> = (props) => (
  <BaseButton variant="muted" {...props} />
);

// Export Link variants
export const PrimaryLink: React.FC<LinkButtonProps> = (props) => (
  <LinkButton variant="primary" {...props} />
);

export const SecondaryLink: React.FC<LinkButtonProps> = (props) => (
  <LinkButton variant="secondary" {...props} />
);

export const OutlineLink: React.FC<LinkButtonProps> = (props) => (
  <LinkButton variant="outline" {...props} />
);

// Default export
const Button = BaseButton;
export default Button; 