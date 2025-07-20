import React from "react";
import { Download, Sparkles } from "lucide-react";

// Main server component
const ReadyToStartSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-black via-gray-900 to-black py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        {/* Stars/Sparkles scattered around */}
        <Sparkles className="top-20 left-20 absolute w-6 h-6 text-white/30 animate-pulse" />
        <Sparkles className="top-32 right-32 absolute w-4 h-4 text-white/20 animate-pulse delay-300" />
        <Sparkles className="bottom-20 left-1/4 absolute w-5 h-5 text-white/25 animate-pulse delay-500" />
        <Sparkles className="top-1/2 right-20 absolute w-3 h-3 text-white/30 animate-pulse delay-700" />

        {/* Gradient overlays */}
        <div className="top-0 right-0 absolute bg-gradient-to-bl from-red-500/20 to-transparent blur-3xl rounded-full w-96 h-96" />
        <div className="bottom-0 left-0 absolute bg-gradient-to-tr from-orange-500/20 to-transparent blur-3xl rounded-full w-96 h-96" />
      </div>

      <div className="z-10 relative mx-auto px-6 max-w-7xl container">
        <div className="items-center gap-16 grid grid-cols-1 lg:grid-cols-2">
          {/* Left Content */}
          <div>
            <h2 className="mb-8 font-mono font-bold text-white text-5xl md:text-6xl leading-tight">
              Ready To Get Started?
            </h2>

            <p className="mb-12 font-mono text-gray-300 text-xl leading-relaxed">
              Experience the future of developer collaboration. Join thousands
              of developers already using CodeCave to showcase their work and
              build amazing projects together.
            </p>

            <a
              href="#download"
              className="inline-flex items-center space-x-4 bg-white hover:shadow-xl px-8 py-4 rounded-2xl font-mono font-semibold text-black text-lg hover:scale-105 transition-all duration-200 cursor-pointer transform"
            >
              <Download className="w-6 h-6" />
              <span>Download App</span>
            </a>

            <p className="mt-4 font-mono text-gray-400 text-sm">
              Available on all platforms • Free to start
            </p>
          </div>

          {/* Right Phone Mockups */}
          <div className="relative">
            {/* Phone mockups arranged in a staggered layout */}
            <div className="relative flex justify-center items-center">
              {/* Main phone mockup */}
              <div className="z-20 relative bg-gray-800 shadow-2xl p-3 rounded-3xl rotate-6 transform">
                <div className="relative bg-black rounded-2xl w-64 h-[500px] overflow-hidden">
                  {/* Phone screen content */}
                  <div className="flex flex-col bg-gradient-to-b from-gray-900 to-black p-6 h-full">
                    <div className="mb-6 font-mono text-white text-sm">
                      CodeCave
                    </div>

                    {/* Mock interface elements */}
                    <div className="flex-1 space-y-4">
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <div className="bg-gray-500 mb-2 rounded w-3/4 h-3"></div>
                        <div className="bg-gray-600 rounded w-1/2 h-2"></div>
                      </div>
                      <div className="bg-orange-500/20 p-4 border border-orange-500/30 rounded-lg">
                        <div className="bg-orange-500/60 mb-2 rounded w-2/3 h-3"></div>
                        <div className="bg-orange-500/40 rounded w-3/4 h-2"></div>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <div className="bg-gray-500 mb-2 rounded w-1/2 h-3"></div>
                        <div className="bg-gray-600 rounded w-2/3 h-2"></div>
                      </div>
                    </div>

                    {/* Bottom nav */}
                    <div className="flex justify-around pt-4 border-gray-700 border-t">
                      <div className="bg-gray-600 rounded-full w-8 h-8"></div>
                      <div className="bg-orange-500 rounded-full w-8 h-8"></div>
                      <div className="bg-gray-600 rounded-full w-8 h-8"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary phone mockup */}
              <div className="top-8 -right-16 z-10 absolute bg-gray-800 opacity-80 shadow-xl p-3 rounded-3xl -rotate-12 scale-90 transform">
                <div className="relative bg-black rounded-2xl w-56 h-[420px] overflow-hidden">
                  <div className="flex flex-col bg-gradient-to-b from-secondary/20 to-black p-5 h-full">
                    <div className="mb-4 font-mono text-white text-xs">
                      Dashboard
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="bg-blue-500/30 p-3 rounded-lg">
                        <div className="bg-blue-500/60 mb-1 rounded w-2/3 h-2"></div>
                        <div className="bg-blue-500/40 rounded w-1/2 h-1"></div>
                      </div>
                      <div className="bg-gray-700/50 p-3 rounded-lg">
                        <div className="bg-gray-500 mb-1 rounded w-3/4 h-2"></div>
                        <div className="bg-gray-600 rounded w-1/3 h-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Third phone mockup */}
              <div className="bottom-4 -left-20 z-5 absolute bg-gray-800 opacity-60 shadow-lg p-2 rounded-3xl rotate-12 scale-75 transform">
                <div className="bg-black rounded-xl w-48 h-[320px] overflow-hidden">
                  <div className="bg-gradient-to-b from-green-500/20 to-black p-4 h-full">
                    <div className="space-y-2">
                      <div className="bg-green-500/30 p-2 rounded">
                        <div className="bg-green-400 rounded w-1/2 h-1"></div>
                      </div>
                      <div className="bg-gray-700/30 p-2 rounded">
                        <div className="bg-gray-500 rounded w-2/3 h-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadyToStartSection;
