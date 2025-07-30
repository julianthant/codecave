import { HeroSection } from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Revolution from "@/components/landing/revolution";
import { Footer } from "@/components/landing/footer";
import { HeroHeader } from "@/components/landing/header";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-gradient-start to-gradient-end">
      {/* Navbar */}
      <HeroHeader />

      {/* Main Content */}
      <main>
        {/* Hero Section - Centered */}

        <HeroSection />

        <div className="space-y-20 bg-gradient-to-br from-slate-50 to-orange-50 py-20">
          {/* Enhanced Features Section - Same background as last section */}
          <section id="features">
            <Features />
          </section>

          {/* Join the Developer Revolution Section */}
          <section>
            <Revolution />
          </section>
        </div>
      </main>

      {/* Enhanced Footer */}
      <Footer />
    </div>
  );
}
