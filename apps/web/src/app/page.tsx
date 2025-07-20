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

interface HomeProps {
  searchParams: Promise<{
    error?: string;
    error_type?: string;
    existing_provider?: string;
    token?: string;
    refresh?: string;
    auth_success?: string;
  }>;
}

// Server component - no client-side JavaScript needed
export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const { error, error_type, existing_provider } = params;

  return (
    <>
      <Navigation />
      {/* Error Message Display */}
      {error && (
        <div className="bg-red-50 mb-6 p-4 border-red-400 border-l-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700 text-sm">
                {decodeURIComponent(error)}
                {error_type === "account_exists" && existing_provider && (
                  <span className="block mt-1 text-red-600 text-xs">
                    Try signing in with {existing_provider} instead.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
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
