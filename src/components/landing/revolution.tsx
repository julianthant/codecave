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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  fill="currentColor"
                />
              </svg>
              GitHub
            </Button>
            <Button
              variant="outline"
              className="hover:bg-slate-50 py-3 border-slate-300 rounded-full w-32 font-light text-slate-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Google
            </Button>
          </div>
        </div>

        {/* Code Snippet */}
        <div className="bg-slate-900 p-6 rounded-lg font-mono text-sm">
          <div className="mb-2 text-green-400">
            {/* Getting started is simple */}
          </div>
          <div className="text-blue-300">
            import <span className="text-yellow-300">{"{ CodeCave }"}</span>{" "}
            from{" "}
            <span className="text-orange-300">&apos;@codecave/sdk&apos;</span>;
          </div>
          <div className="text-blue-300">
            const <span className="text-white">developer</span> = new{" "}
            <span className="text-yellow-300">CodeCave</span>();
          </div>
          <div className="text-blue-300">
            developer.<span className="text-yellow-300">showcase</span>(
            <span className="text-orange-300">
              &apos;your-amazing-project&apos;
            </span>
            );
          </div>
        </div>
      </div>
    </div>
  );
}
