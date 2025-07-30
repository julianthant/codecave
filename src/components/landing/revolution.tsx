import { Github, Chrome, Code, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { Divider } from "../ui/divider";

export default function Revolution() {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
      <div className="bg-white shadow-lg p-12 border border-gray-100 rounded-2xl">
        <div className="space-y-6 mb-8 text-center">
          <div className="space-y-6">
            <h2 className="font-extralight text-slate-900 text-4xl md:text-5xl leading-tight">
              Ready to{" "}
              <span className="font-light text-landing-primary">build</span>?
            </h2>
            <Divider />
          </div>

          {/* Clean Description */}
          <p className="mx-auto max-w-xl font-light text-slate-600 text-lg leading-relaxed">
            Join thousands of developers already building the future
          </p>

          {/* CTA Buttons */}
          <div className="flex sm:flex-row flex-col justify-center gap-4">
            <Button
              variant="default"
              className="bg-slate-900 hover:bg-slate-700 py-3 rounded-full w-32 font-light text-landing-primary"
            >
              <Github className="mr-2 w-4 h-4" />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="hover:bg-slate-50 py-3 border-slate-300 rounded-full w-32 font-light text-slate-700"
            >
              <Chrome className="mr-2 w-4 h-4" />
              Google
            </Button>
          </div>
        </div>

        {/* Code Snippet */}
        <div className="bg-slate-900 p-6 rounded-lg font-mono text-sm">
          <div className="mb-2 text-green-400">
            // Getting started is simple
          </div>
          <div className="text-blue-300">
            import <span className="text-yellow-300">{"{ CodeCave }"}</span>{" "}
            from <span className="text-orange-300">'@codecave/sdk'</span>;
          </div>
          <div className="text-blue-300">
            const <span className="text-white">developer</span> = new{" "}
            <span className="text-yellow-300">CodeCave</span>();
          </div>
          <div className="text-blue-300">
            developer.<span className="text-yellow-300">showcase</span>(
            <span className="text-orange-300">'your-amazing-project'</span>
            );
          </div>
        </div>
      </div>
    </div>
  );
}
