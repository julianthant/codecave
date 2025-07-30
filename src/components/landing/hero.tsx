import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { AnimatedGroup } from "./animated-group";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export function HeroSection() {
  return (
    <main className="overflow-hidden">
      <div
        aria-hidden
        className="hidden lg:block z-[2] isolate absolute inset-0 opacity-50 pointer-events-none contain-strict"
      >
        <div className="top-0 left-0 absolute bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)] rounded-full w-[35rem] h-[80rem] -rotate-45 -translate-y-[350px]" />
        <div className="top-0 left-0 absolute bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] rounded-full w-56 h-[80rem] -rotate-45 [translate:5%_-50%]" />
        <div className="top-0 left-0 absolute bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] w-56 h-[80rem] -rotate-45 -translate-y-[350px]" />
      </div>
      <section>
        <div className="relative flex flex-col justify-center items-center min-h-screen">
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    delayChildren: 1,
                  },
                },
              },
              item: {
                hidden: {
                  opacity: 0,
                  y: 20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring" as const,
                    bounce: 0.3,
                    duration: 2,
                  },
                },
              },
            }}
            className="-z-20 absolute inset-0"
          >
            <img
              src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
              alt="background"
              className="hidden dark:block top-56 lg:top-32 -z-20 absolute inset-x-0"
              width="3276"
              height="4095"
            />
          </AnimatedGroup>
          <div
            aria-hidden
            className="-z-10 absolute inset-0 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
          />
          <div className="mx-auto px-6 max-w-7xl">
            <div className="sm:mx-auto lg:mt-0 lg:mr-auto text-center">
              <AnimatedGroup variants={transitionVariants}>
                <div className="group flex items-center gap-4 bg-muted hover:bg-background shadow-black/5 shadow-md dark:shadow-zinc-950 mx-auto p-1 px-4 border dark:border-t-white/5 dark:hover:border-t-border rounded-full w-fit transition-all duration-300">
                  <span className="text-foreground text-sm">
                    Let&apos;s build the future together
                  </span>
                </div>

                <h1 className="mt-8 font-light text-landing-foreground text-5xl md:text-7xl leading-[1.1] tracking-tight">
                  The{" "}
                  <span className="font-normal text-landing-primary">
                    Developer
                    <br />
                    Community
                  </span>{" "}
                  Platform
                </h1>
                <p className="mx-auto mt-8 max-w-3xl font-light text-landing-muted-foreground text-xl text-balance leading-relaxed">
                  The focused platform for project creators and codecoders.
                  Showcase your work, find collaborators, and build the future
                  together.
                </p>
              </AnimatedGroup>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="flex md:flex-row flex-col justify-center items-center gap-2 mt-12"
              >
                <div className="flex justify-center items-center gap-4">
                  <div className="bg-border w-16 h-px"></div>
                  <Button as={Link} href="/auth/login">
                    Explore
                  </Button>
                  <div className="bg-border w-16 h-px"></div>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
