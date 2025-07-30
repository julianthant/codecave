import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => (
  <Image
    src="/codecave_logo.png"
    alt="CodeCave Logo"
    width={24}
    height={24}
    className={cn("rounded-md w-auto h-auto object-contain", className)}
  />
);
