import React from "react";

export function Footer() {
  return (
    <footer className="py-8 border-t border-border/30">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex md:flex-row flex-col justify-between items-center space-y-4 md:space-y-0">
          <div className="text-landing-muted-foreground text-sm">
            © 2025 codecave. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <a
              href="#"
              className="text-landing-muted-foreground hover:text-landing-foreground transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-landing-muted-foreground hover:text-landing-foreground transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-landing-muted-foreground hover:text-landing-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
