import { cn } from "@/lib/utils";
import { ElementType, ComponentPropsWithoutRef } from "react";

interface StarBorderProps<T extends ElementType> {
  as?: T;
  color?: string;
  speed?: string;
  className?: string;
  children: React.ReactNode;
}

export function Button<T extends ElementType = "button">({
  as,
  className,
  color,
  speed = "6s",
  children,
  ...props
}: StarBorderProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) {
  const Component = as || "button";
  const defaultColor = "hsl(0 0% 100%)";

  return (
    <Component
      className={cn(
        "inline-block relative py-[1px] rounded-[20px] overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "right-[-250%] bottom-[-11px] z-0 absolute rounded-full w-[300%] h-[50%] animate-star-movement-bottom",
          "opacity-20 dark:opacity-70"
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className={cn(
          "top-[-10px] left-[-250%] z-0 absolute rounded-full w-[300%] h-[50%] animate-star-movement-top",
          "opacity-20 dark:opacity-70"
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className={cn(
          "z-1 relative px-6 py-4 border rounded-[20px] text-landing-foreground text-base text-center",
          "bg-gradient-to-b from-landing-muted/85 to-landing-background/85 border-landing-border/40",
          "dark:from-landing-background dark:to-landing-muted dark:border-landing-border"
        )}
      >
        {children}
      </div>
    </Component>
  );
}
