import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Divider } from "../ui/divider";

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

export default function Hero() {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
      <div className="text-center">
        {/* Main Heading */}
        <h1 className="mb-8 font-light text-landing-foreground text-5xl md:text-7xl leading-[1.1] tracking-tight">
          The{" "}
          <span className="font-normal text-landing-primary">
            Developer
            <br />
            Community
          </span>{" "}
          Platform
        </h1>

        {/* Subtle divider */}
        <Divider className="mb-8" />

        <p className="mx-auto mb-8 max-w-3xl font-light text-landing-muted-foreground text-xl leading-relaxed">
          The focused platform for project creators and codecoders. Showcase
          your work, find collaborators, and build the future together.
        </p>

        {/* Minimal CTA */}
        <div className="flex justify-center items-center gap-4">
          <div className="bg-border w-16 h-px"></div>
          <Button
            variant="outline"
            asChild
            className="bg-transparent hover:bg-landing-primary/30 font-light text-landing-muted-foreground hover:text-landing-foreground text-sm"
          >
            <Link href="/auth/login">Get Started</Link>
          </Button>
          <div className="bg-border w-16 h-px"></div>
        </div>
      </div>
    </div>
  );
}
