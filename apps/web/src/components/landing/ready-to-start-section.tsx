import React from 'react';
import { Smartphone, Download, Sparkles } from 'lucide-react';

// Main server component
const ReadyToStartSection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        {/* Stars/Sparkles scattered around */}
        <Sparkles className="absolute top-20 left-20 w-6 h-6 text-white/30 animate-pulse" />
        <Sparkles className="absolute top-32 right-32 w-4 h-4 text-white/20 animate-pulse delay-300" />
        <Sparkles className="absolute bottom-20 left-1/4 w-5 h-5 text-white/25 animate-pulse delay-500" />
        <Sparkles className="absolute top-1/2 right-20 w-3 h-3 text-white/30 animate-pulse delay-700" />
        
        {/* Gradient overlays */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-500/20 to-transparent rounded-full blur-3xl" />
                 <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <h2 className="text-5xl md:text-6xl font-bold font-mono text-white mb-8 leading-tight">
              Ready To Get Started?
            </h2>
            
            <p className="text-xl text-gray-300 font-mono leading-relaxed mb-12">
              Experience the future of developer collaboration. Join thousands of developers 
              already using CodeCave to showcase their work and build amazing projects together.
            </p>

            <a
              href="#download"
              className="inline-flex items-center space-x-4 bg-white text-black px-8 py-4 rounded-2xl font-mono font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <Download className="w-6 h-6" />
              <span>Download App</span>
            </a>
            
            <p className="text-gray-400 font-mono text-sm mt-4">
              Available on all platforms • Free to start
            </p>
          </div>

          {/* Right Phone Mockups */}
          <div className="relative">
            {/* Phone mockups arranged in a staggered layout */}
            <div className="relative flex justify-center items-center">
              
              {/* Main phone mockup */}
              <div className="relative z-20 bg-gray-800 rounded-3xl p-3 shadow-2xl transform rotate-6">
                <div className="bg-black rounded-2xl overflow-hidden w-64 h-[500px] relative">
                  {/* Phone screen content */}
                  <div className="bg-gradient-to-b from-gray-900 to-black h-full p-6 flex flex-col">
                    <div className="text-white font-mono text-sm mb-6">CodeCave</div>
                    
                    {/* Mock interface elements */}
                    <div className="space-y-4 flex-1">
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="w-3/4 h-3 bg-gray-500 rounded mb-2"></div>
                        <div className="w-1/2 h-2 bg-gray-600 rounded"></div>
                      </div>
                      <div className="bg-orange-500/20 rounded-lg p-4 border border-orange-500/30">
                        <div className="w-2/3 h-3 bg-orange-500/60 rounded mb-2"></div>
                        <div className="w-3/4 h-2 bg-orange-500/40 rounded"></div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="w-1/2 h-3 bg-gray-500 rounded mb-2"></div>
                        <div className="w-2/3 h-2 bg-gray-600 rounded"></div>
                      </div>
                    </div>
                    
                    {/* Bottom nav */}
                    <div className="flex justify-around pt-4 border-t border-gray-700">
                      <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                      <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
                      <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary phone mockup */}
              <div className="absolute -right-16 top-8 z-10 bg-gray-800 rounded-3xl p-3 shadow-xl transform -rotate-12 scale-90 opacity-80">
                <div className="bg-black rounded-2xl overflow-hidden w-56 h-[420px] relative">
                  <div className="bg-gradient-to-b from-secondary/20 to-black h-full p-5 flex flex-col">
                    <div className="text-white font-mono text-xs mb-4">Dashboard</div>
                    <div className="space-y-3 flex-1">
                                             <div className="bg-blue-500/30 rounded-lg p-3">
                         <div className="w-2/3 h-2 bg-blue-500/60 rounded mb-1"></div>
                         <div className="w-1/2 h-1 bg-blue-500/40 rounded"></div>
                       </div>
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="w-3/4 h-2 bg-gray-500 rounded mb-1"></div>
                        <div className="w-1/3 h-1 bg-gray-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Third phone mockup */}
              <div className="absolute -left-20 bottom-4 z-5 bg-gray-800 rounded-3xl p-2 shadow-lg transform rotate-12 scale-75 opacity-60">
                <div className="bg-black rounded-xl overflow-hidden w-48 h-[320px]">
                  <div className="bg-gradient-to-b from-green-500/20 to-black h-full p-4">
                    <div className="space-y-2">
                      <div className="bg-green-500/30 rounded p-2">
                        <div className="w-1/2 h-1 bg-green-400 rounded"></div>
                      </div>
                      <div className="bg-gray-700/30 rounded p-2">
                        <div className="w-2/3 h-1 bg-gray-500 rounded"></div>
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