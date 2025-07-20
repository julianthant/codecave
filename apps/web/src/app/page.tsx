import { Metadata } from "next";
import Navigation from "@/components/landing/navigation";
import HeroSection from "@/components/landing/hero-section";
import HeroIllustration from "@/components/ui/hero-illustration";

// Static metadata for better SEO
export const metadata: Metadata = {
  title: "CodeCave - Where Developers Build Together",
  description:
    "The focused platform for project creators and vibecoders. Showcase your work, find collaborators, and build the future together.",
};

// Server component - no client-side JavaScript needed
export default function Home() {
  return (
    <>
      <Navigation />
      <main className="relative">
        {/* Hero Section with Illustration */}
        <section className="relative" id="hero">
          <HeroSection />

          {/* Hero Illustration - positioned absolutely */}
          <div
            className="hidden lg:block absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="mx-auto px-6 h-full container">
              <div className="items-center gap-16 grid grid-cols-5 h-full">
                <div className="col-span-3"></div>
                <div className="flex justify-center items-center col-span-2">
                  <p>hi</p>
                  <HeroIllustration
                    className="opacity-20 scale-75"
                    animated={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
