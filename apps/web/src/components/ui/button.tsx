import React from "react";
import { LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "muted";
type ButtonSize = "sm" | "md" | "lg";

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}

interface ButtonProps
  extends BaseButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {}

interface LinkButtonProps
  extends BaseButtonProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  href: string;
}

// Base button styles using project theme
const getVariantClasses = (variant: ButtonVariant): string => {
  const variants = {
    // Primary: Matte purple with project theme
    primary:
      "bg-primary text-white hover:bg-primary/90 border border-primary hover:border-primary/90 font-semibold",

    // Secondary: Matte blue with project theme
    secondary:
      "bg-secondary text-white hover:bg-secondary/90 border border-secondary hover:border-secondary/90 font-semibold",

    // Outline: Transparent with primary border
    outline:
      "bg-transparent text-primary border border-primary/30 hover:border-primary/50 hover:bg-primary/5 font-medium",

    // Ghost: Minimal styling
    ghost:
      "bg-transparent text-muted hover:text-foreground hover:bg-surface/50 border border-transparent font-medium",

    // Muted: Surface background
    muted:
      "bg-surface text-foreground hover:bg-surface-variant border border-border hover:border-border-variant font-medium",
  };

  return variants[variant];
};

const getSizeClasses = (size: ButtonSize): string => {
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return sizes[size];
};

// Generic button component that handles both button and link cases
const ButtonComponent = <T extends Record<string, unknown>>({
  as,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  children,
  className = "",
  ...props
}: {
  as: "button" | "a";
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
  className?: string;
} & T) => {
  const isLink = as === "a";
  const baseClasses = `inline-flex items-center justify-center font-mono rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
    isLink ? "gap-2" : "disabled:opacity-50 disabled:pointer-events-none"
  }`;
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const finalClassName = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  const content = (
    <>
      {icon &&
        iconPosition === "left" &&
        React.createElement(icon, { className: "w-4 h-4" })}
      {children}
      {icon &&
        iconPosition === "right" &&
        React.createElement(icon, { className: "ml-2 w-4 h-4" })}
    </>
  );

  return React.createElement(
    as,
    {
      className: finalClassName,
      ...props,
    },
    content
  );
};

// Base button component
export const BaseButton: React.FC<ButtonProps> = (props) => (
  <ButtonComponent as="button" {...props} />
);

// Link button component
export const LinkButton: React.FC<LinkButtonProps> = (props) => (
  <ButtonComponent as="a" {...props} />
);

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
