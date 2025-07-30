import Link from "next/link";
import { Button } from "../ui/button";
import { Logo } from "../ui/logo";

export default function Navbar() {
  return (
    <nav className="top-0 z-50 sticky bg-landing-background/95 backdrop-blur-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <Button variant="link" asChild className="flex items-center space">
            <Link href="/">
              <Logo />
              <span className="font-semibold text-white text-xl">codecave</span>
            </Link>
          </Button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="link"
              className="text-landing-muted-foreground hover:text-landing-foreground text-sm transition-colors"
            >
              <Link href="#features">Features</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-landing-primary/20 hover:bg-landing-primary/30 ml-1 border-none text-landing-foreground hover:text-white transition-all duration-200"
              asChild
            >
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
