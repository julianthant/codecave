import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid lg:grid-cols-2 min-h-svh">
      <div className="flex flex-col gap-4 bg-gradient-to-br from-slate-50 to-orange-50 p-6 md:p-10">
        <Button
          variant="link"
          asChild
          className="flex justify-center md:justify-start gap-2"
        >
          <Link href="/">
            <Logo />
            <span className="font-semibold text-landing-muted text-xl">
              codecave
            </span>
          </Link>
        </Button>

        <div className="flex flex-1 justify-center items-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 dark:from-orange-600 via-red-500 dark:via-red-700 to-pink-600 dark:to-pink-800">
          {/* Animated geometric shapes */}
          <div className="absolute inset-0 opacity-20">
            <div className="top-20 left-20 absolute border-2 border-white/30 w-32 h-32 rotate-45 animate-spin-slow"></div>
            <div className="top-40 right-32 absolute bg-white/20 rounded-full w-24 h-24 animate-bounce-slow"></div>
            <div className="bottom-32 left-40 absolute bg-white/10 w-20 h-20 rotate-45 transform"></div>
            <div className="right-20 bottom-20 absolute bg-white/15 rounded-full w-16 h-32 animate-pulse"></div>
          </div>

          {/* Floating orbs */}
          <div className="absolute inset-0 opacity-25">
            <div className="top-1/4 left-1/4 absolute bg-yellow-300 blur-xl rounded-full w-96 h-96 animate-pulse mix-blend-multiply filter"></div>
            <div className="top-3/4 left-1/2 absolute bg-orange-300 blur-2xl rounded-full w-80 h-80 animate-pulse animation-delay-2000 mix-blend-multiply filter"></div>
            <div className="top-1/2 right-1/4 absolute bg-red-300 blur-xl rounded-full w-72 h-72 animate-pulse animation-delay-4000 mix-blend-multiply filter"></div>
          </div>

          {/* Code-themed pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="top-10 left-10 absolute font-mono text-white/40 text-sm rotate-12 transform">
              &lt;/&gt; function createMagic() {"{"}
            </div>
            <div className="top-32 right-16 absolute font-mono text-white/40 text-xs -rotate-6 transform">
              const dream = true;
            </div>
            <div className="bottom-40 left-16 absolute font-mono text-white/40 text-sm rotate-6 transform">
              return success;
            </div>
            <div className="right-24 bottom-16 absolute font-mono text-white/40 text-xs -rotate-12 transform">
              {"}"}
            </div>
          </div>

          {/* Inspirational quote */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="px-8 max-w-md text-white/90 text-center">
              <div className="bg-clip-text bg-gradient-to-r from-white to-orange-100 mb-4 font-bold text-transparent text-6xl">
                {"}"}
              </div>
              <blockquote className="mb-4 font-medium text-xl leading-relaxed">
                Code is like humor. When you have to explain it, it's bad.
              </blockquote>
              <cite className="opacity-75 font-light text-sm">
                — Cory House
              </cite>
              <div className="bg-clip-text bg-gradient-to-r from-white to-orange-100 mt-4 font-bold text-transparent text-6xl rotate-180 transform">
                {"}"}
              </div>
            </div>
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>
        </div>
      </div>
    </div>
  );
}
