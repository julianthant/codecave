# Frontend Documentation

This directory contains documentation related to the frontend architecture and components of the CodeCave application.

## 📚 Contents

- [Frontend Plan](FRONTEND-PLAN.md) - Frontend architecture and plan
- [CodeCave Design System](codecave-design-system.md) - Design system documentation
- [Code OAuth Login](code-oauth-login.md) - OAuth login implementation
- [Project Component](project-component.md) - Project component documentation
- [Navbar Analysis](navbar-analysis.md) - Navbar component analysis
- [Landing Page Analysis](landing-page-analysis.md) - Landing page analysis
- [Design Summary](design-summary.md) - Design summary

## 🎨 Frontend Overview

The CodeCave frontend is built using:

- **Next.js**: React framework with server-side rendering
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript
- **Better Auth**: Authentication system

### Architecture

The frontend follows a component-based architecture with a focus on server components where possible. Client components are used only when necessary for interactivity.

```
apps/web/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── api/         # API routes
│   │   ├── auth/        # Authentication pages
│   │   ├── home/        # Home page
│   │   ├── project/     # Project-related pages
│   │   └── layout.tsx   # Root layout
│   ├── components/      # Reusable components
│   │   ├── landing/     # Landing page components
│   │   ├── layout/      # Layout components
│   │   └── ui/          # UI components
│   ├── lib/             # Utilities and services
│   └── styles/          # Global styles
├── next.config.ts       # Next.js configuration
└── tsconfig.json        # TypeScript configuration
```

## 🧩 Component Structure

### UI Components

Basic UI components follow a simple pattern:

```tsx
// Button component example
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-md font-medium transition-colors",
        {
          "bg-purple-600 text-white hover:bg-purple-700": variant === "primary",
          "bg-gray-200 text-gray-800 hover:bg-gray-300": variant === "secondary",
          "border border-gray-300 bg-transparent hover:bg-gray-100": variant === "outline",
        },
        {
          "px-2 py-1 text-sm": size === "sm",
          "px-3 py-2": size === "md",
          "px-4 py-3 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

## 🎭 Server vs Client Components

CodeCave prioritizes server components for better performance:

- **Server Components**:
  - Static content display
  - Data fetching
  - Form submissions
  - Layout components

- **Client Components**:
  - Interactive UI elements
  - Client-side state management
  - Animations and transitions
  - Real-time updates

## 🎨 Design System

The design system uses:

- **Color Palette**:
  - Primary: Purple (#7C3AED)
  - Secondary: Blue (#2563EB)
  - Success: Green (#16A34A)
  - Error: Red (#DC2626)
  - Warning: Yellow (#F59E0B)

- **Typography**:
  - Headings: Inter (bold)
  - Body: Inter (regular)
  - Code: JetBrains Mono

- **Spacing**:
  - Based on 4px increments

- **Breakpoints**:
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+

## 🧪 Testing

Frontend components are tested using:

- **Jest**: Unit tests
- **React Testing Library**: Component tests
- **Playwright**: End-to-end tests

---

**Last Updated**: July 30, 2025 