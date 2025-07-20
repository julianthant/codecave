import React from "react";

interface CodecaveLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?:
    | "default"
    | "monochrome"
    | "svg-mask"
    | "css-background"
    | "multiple-layers";
}

const CodecaveLogo: React.FC<CodecaveLogoProps> = ({
  className = "",
  size = "md",
  showText = true,
  variant = "default",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const renderLogo = () => {
    const baseClasses = `${sizeClasses[size]} flex-shrink-0`;

    switch (variant) {
      case "svg-mask":
        // Method 1: Use SVG as a mask over a colored div
        return (
          <div
            className={`${baseClasses} bg-black dark:bg-white`}
            style={{
              maskImage: "url(/codecave_logo.svg)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: "url(/codecave_logo.svg)",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />
        );

      case "css-background":
        // Method 2: Use as background image with color filters
        return (
          <div
            className={`${baseClasses}`}
            style={{
              backgroundImage: "url(/codecave_logo.svg)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              filter: "brightness(0) dark:brightness(0) dark:invert(1)",
            }}
          />
        );

      case "multiple-layers":
        // Method 3: Layer multiple copies with different filters
        return (
          <div className={`${baseClasses} relative`}>
            {/* Base layer */}
            <img
              src="/codecave_logo.svg"
              alt=""
              className="absolute inset-0 dark:invert w-full h-full object-contain"
            />
            {/* Fill layer with blur to create fill effect */}
            <img
              src="/codecave_logo.svg"
              alt=""
              className="absolute inset-0 dark:invert w-full h-full object-contain"
              style={{ filter: "blur(0.5px) contrast(10) brightness(2)" }}
            />
            {/* Top outline layer */}
            <img
              src="/codecave_logo.svg"
              alt="CodeCave Logo"
              className="z-10 relative dark:invert w-full h-full object-contain"
            />
          </div>
        );

      default:
        // Method 4: Dark in light mode, light in dark mode
        return (
          <div className={baseClasses}>
            <img
              src="/codecave_logo.svg"
              alt="CodeCave Logo"
              className="dark:hidden dark:invert w-full h-full object-contain"
            />
            <img
              src="/codecave_logo.svg"
              alt="CodeCave Logo"
              className="dark:invert-0 w-full h-full object-contain"
            />
          </div>
        );
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      {renderLogo()}

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span
            className={`font-mono font-bold ${textSizes[size]} leading-none tracking-tight`}
          >
            <span className="text-foreground">codecave</span>
          </span>
          {(size === "lg" || size === "xl") && (
            <span className="opacity-70 mt-1 font-mono text-muted-foreground text-xs tracking-wider">
              platform for developers
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CodecaveLogo;

// Export icon-only version
export const CodecaveIcon: React.FC<Omit<CodecaveLogoProps, "showText">> = (
  props
) => <CodecaveLogo {...props} showText={false} />;
