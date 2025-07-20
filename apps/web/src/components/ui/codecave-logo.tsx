import React from "react";
import Image from "next/image";

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
        // Method 1: Use PNG as a mask over a colored div
        return (
          <div
            className={`${baseClasses} bg-black`}
            style={{
              maskImage: "url(/codecave_logo.png)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: "url(/codecave_logo.png)",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />
        );

      case "css-background":
        // Method 2: Use PNG as background image
        return (
          <div
            className={`${baseClasses}`}
            style={{
              backgroundImage: "url(/codecave_logo.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        );

      case "multiple-layers":
        // Method 3: Layer multiple copies with different filters
        return (
          <div className={`${baseClasses} relative`}>
            {/* Base layer */}
            <Image
              src="/codecave_logo.png"
              alt=""
              width={100}
              height={100}
              className="absolute inset-0 w-full h-full object-contain"
            />
            {/* Fill layer with blur to create fill effect */}
            <Image
              src="/codecave_logo.png"
              alt=""
              width={100}
              height={100}
              className="absolute inset-0 w-full h-full object-contain"
              style={{ filter: "blur(0.5px) contrast(10) brightness(2)" }}
            />
            {/* Top outline layer */}
            <Image
              src="/codecave_logo.png"
              alt="CodeCave Logo"
              width={100}
              height={100}
              className="z-10 relative w-full h-full object-contain"
            />
          </div>
        );

      default:
        // Method 4: Use PNG without theme switching
        return (
          <div className={baseClasses}>
            <Image
              src="/codecave_logo.png"
              alt="CodeCave Logo"
              width={100}
              height={100}
              className="w-full h-full object-contain"
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
