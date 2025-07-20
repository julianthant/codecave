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

// Shared button content renderer to eliminate duplication
const renderButtonContent = (
  Icon: LucideIcon | undefined,
  iconPosition: "left" | "right",
  children: React.ReactNode
) => (
  <>
    {Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
    {children}
    {Icon && iconPosition === "right" && <Icon className="ml-2 w-4 h-4" />}
  </>
);

// Shared class names builder to eliminate duplication
const buildButtonClasses = (
  variant: ButtonVariant,
  size: ButtonSize,
  className: string,
  isLink: boolean = false
): string => {
  const baseClasses = `inline-flex items-center justify-center font-mono rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
    isLink ? "gap-2" : "disabled:opacity-50 disabled:pointer-events-none"
  }`;
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);

  return `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;
};

// Generic button renderer to eliminate duplication
const renderButton = <T extends Record<string, unknown>>(
  Element: "button" | "a",
  props: T,
  variant: ButtonVariant,
  size: ButtonSize,
  icon: LucideIcon | undefined,
  iconPosition: "left" | "right",
  children: React.ReactNode,
  className: string,
  isLink: boolean = false
) => {
  const elementProps = {
    className: buildButtonClasses(variant, size, className, isLink),
    ...props,
  };

  return React.createElement(
    Element,
    elementProps,
    renderButtonContent(icon, iconPosition, children)
  );
};

// Base button component
export const BaseButton: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  children,
  className = "",
  ...props
}) => {
  return renderButton(
    "button",
    props,
    variant,
    size,
    icon,
    iconPosition,
    children,
    className
  );
};

// Link button component
export const LinkButton: React.FC<LinkButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  children,
  className = "",
  href,
  ...props
}) => {
  return renderButton(
    "a",
    { href, ...props },
    variant,
    size,
    icon,
    iconPosition,
    children,
    className,
    true
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
