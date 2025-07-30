import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const LogoWhite = ({ className }: LogoProps) => (
  <Image
    src="/codecave-logo-white.png"
    alt="CodeCave Logo"
    width={120}
    height={120}
    className={cn("rounded-md w-auto h-auto object-contain", className)}
  />
);

export const LogoBlack = ({ className }: LogoProps) => (
  <Image
    src="/codecave-logo-black.png"
    alt="CodeCave Logo"
    width={120}
    height={120}
    className={cn("rounded-md w-auto h-auto object-contain", className)}
  />
);

export const Logo = ({ className }: LogoProps) => (
  <Image
    src="/codecave-logo.png"
    alt="CodeCave Logo"
    width={24}
    height={24}
    className={cn("rounded-md w-auto h-auto object-contain", className)}
  />
);
