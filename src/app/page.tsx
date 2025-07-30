import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Revolution from "@/components/landing/revolution";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-gradient-start to-gradient-end">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section - Centered */}
        <section className="flex flex-col justify-center items-center py-20 lg:py-32 min-h-[calc(100vh-4rem)]">
          <Hero />
        </section>

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
