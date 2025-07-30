import { Code, Users, Zap } from "lucide-react";
import { Divider } from "../ui/divider";

export default function Features() {
  return (
    <div className="space-y-20 bg-gradient-to-br from-slate-50 to-orange-50 py-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="space-y-6 mb-20 text-center">
          <h2 className="font-extralight text-slate-900 text-4xl md:text-5xl leading-tight">
            Why choose{" "}
            <span className="font-light text-landing-primary">codecave</span>?
          </h2>
          <Divider />
        </div>

        <div className="space-y-20">
          {/* Feature 1 */}
          <div className="group flex md:flex-row flex-col md:items-center gap-12">
            <div className="md:w-1/3">
              <h3 className="mb-3 font-light text-slate-900 text-2xl">
                Showcase
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Present your projects with elegant simplicity and professional
                documentation
              </p>
            </div>
            <div className="md:w-2/3">
              <div className="relative">
                <div className="absolute inset-0 bg-white opacity-60 rounded-lg"></div>
                <div className="relative bg-gradient-to-r from-white to-slate-50 shadow-sm p-8 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-red-400 rounded-full w-3 h-3"></div>
                    <div className="bg-yellow-400 rounded-full w-3 h-3"></div>
                    <div className="bg-green-400 rounded-full w-3 h-3"></div>
                    <div className="ml-4 font-mono text-slate-400 text-xs">
                      my-awesome-project
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/30 rounded w-4 h-4"></div>
                      <div className="bg-slate-200 rounded w-2/3 h-2"></div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500/30 rounded w-4 h-4"></div>
                      <div className="bg-slate-200 rounded w-1/2 h-2"></div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-500/30 rounded w-4 h-4"></div>
                      <div className="bg-slate-200 rounded w-3/4 h-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group flex md:flex-row-reverse flex-col md:items-center gap-12">
            <div className="md:w-1/3">
              <h3 className="mb-3 font-light text-slate-900 text-2xl">
                Connect
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Find like-minded developers and collaborators in your tech stack
              </p>
            </div>
            <div className="md:w-2/3">
              <div className="relative">
                <div className="absolute inset-0 bg-white opacity-60 rounded-lg"></div>
                <div className="relative bg-gradient-to-r from-slate-50 to-white shadow-sm p-8 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex justify-center items-center bg-primary/30 rounded-full w-10 h-10">
                        <Code className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex justify-center items-center bg-blue-500/30 rounded-full w-10 h-10">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex justify-center items-center bg-green-500/30 rounded-full w-10 h-10">
                        <Zap className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="font-mono text-slate-400 text-xs">
                      1,247 developers
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-slate-200 rounded h-2">
                      <div className="bg-primary/40 rounded w-2/3 h-2"></div>
                    </div>
                    <div className="text-slate-400 text-xs text-right">
                      Active collaborations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group flex md:flex-row flex-col md:items-center gap-12">
            <div className="md:w-1/3">
              <h3 className="mb-3 font-light text-slate-900 text-2xl">Build</h3>
              <p className="text-slate-600 leading-relaxed">
                Start projects and grow your network with integrated development
                tools
              </p>
            </div>
            <div className="md:w-2/3">
              <div className="relative">
                <div className="absolute inset-0 bg-white opacity-60 rounded-lg"></div>
                <div className="relative bg-gradient-to-r from-white to-slate-50 shadow-sm p-8 border border-slate-200 rounded-lg">
                  <div className="gap-3 grid grid-cols-4 mb-4">
                    <div className="flex justify-center items-center bg-slate-200 rounded-md aspect-square">
                      <div className="bg-slate-400 rounded w-3 h-3"></div>
                    </div>
                    <div className="flex justify-center items-center bg-primary/20 rounded-md aspect-square">
                      <div className="bg-primary rounded w-3 h-3"></div>
                    </div>
                    <div className="flex justify-center items-center bg-slate-200 rounded-md aspect-square">
                      <div className="bg-slate-400 rounded w-3 h-3"></div>
                    </div>
                    <div className="flex justify-center items-center bg-blue-500/20 rounded-md aspect-square">
                      <div className="bg-blue-500 rounded w-3 h-3"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center font-mono text-slate-400 text-xs">
                    <span>4 active projects</span>
                    <span>12 contributors</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
