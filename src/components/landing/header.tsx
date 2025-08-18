"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoWhite } from "@/components/ui/logo";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Features", href: "/features" },
  { name: "Resources", href: "/resources" },
  { name: "Premium", href: "/premium" },
];

export function HeroHeader() {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginClick = () => {
    if (isAuthenticated) {
      router.push('/feed');
    } else {
      router.push('/auth/login');
    }
  };
  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="group z-20 fixed px-2 w-full"
      >
        <div
          className={cn(
            "mx-auto mt-2 px-6 lg:px-12 max-w-7xl transition-[background-color,backdrop-filter,max-width,padding] duration-300",
            isScrolled &&
              "bg-landing-background/95 max-w-5xl rounded-2xl border border-landing-border backdrop-blur-lg lg:px-5"
          )}
        >
          <div className="relative flex flex-wrap justify-between items-center gap-6 lg:gap-0 py-3 lg:py-4">
            <div className="flex justify-between w-full lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <LogoWhite />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="lg:hidden block z-20 relative -m-2.5 -mr-4 p-2.5 cursor-pointer"
              >
                <Menu
                  color="white"
                  className="group-data-[state=active]:opacity-0 m-auto size-6 in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 duration-200"
                />
                <X
                  color="white"
                  className="absolute inset-0 opacity-0 group-data-[state=active]:opacity-100 m-auto size-6 -rotate-180 group-data-[state=active]:rotate-0 scale-0 group-data-[state=active]:scale-100 duration-200"
                />
              </button>
            </div>

            <div className="hidden lg:block absolute inset-0 m-auto size-fit">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="block text-landing-muted-foreground hover:text-landing-foreground duration-150"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden group-data-[state=active]:block lg:flex lg:group-data-[state=active]:flex flex-wrap md:flex-nowrap justify-end items-center lg:gap-6 space-y-8 lg:space-y-0 bg-landing-background/95 lg:bg-transparent dark:lg:bg-transparent shadow-2xl shadow-zinc-300/20 lg:shadow-none dark:shadow-none lg:m-0 mb-6 p-6 lg:p-0 border lg:border-transparent border-landing-border rounded-3xl w-full lg:w-fit">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="block text-landing-muted-foreground hover:text-landing-foreground duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex sm:flex-row flex-col sm:gap-3 space-y-3 sm:space-y-0 w-full md:w-fit">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    isScrolled && "lg:hidden",
                    "text-landing-muted border-0"
                  )}
                  onClick={handleLoginClick}
                  disabled={isLoading}
                >
                  <span>{isAuthenticated ? "Go to Feed" : "Login"}</span>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className={cn(
                    isScrolled && "lg:hidden",
                    "bg-transparent border-[1px] border-muted-foreground"
                  )}
                >
                  <Link href="/feed">
                    <span>Continue as Guest</span>
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
                  onClick={handleLoginClick}
                  disabled={isLoading}
                >
                  <span>{isAuthenticated ? "Go to Feed" : "Get Started"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
