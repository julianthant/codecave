# Project Structure

This document provides an overview of how the CodeCave project is organized.

## Directory Structure

```
brocode/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   │   ├── callback/      # OAuth callback handler
│   │   │   └── login/         # Login page and actions
│   │   ├── private/           # Protected pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable UI components
│   │   ├── auth/             # Authentication components
│   │   ├── landing/          # Landing page components
│   │   └── ui/               # Base UI components
│   ├── lib/                  # Utility libraries
│   ├── utils/                # Utility functions
│   │   └── supabase/         # Supabase client configurations
│   ├── types/                # TypeScript type definitions
│   └── middleware.ts         # Next.js middleware for auth
├── docs/                     # Documentation files
├── public/                   # Static assets
└── package.json             # Dependencies and scripts
```

## Key Directories

### `/src/app/`
Contains all pages and API routes using Next.js App Router:
- **`auth/`** - Authentication-related pages and callbacks
- **`private/`** - Protected pages requiring authentication
- **`layout.tsx`** - Root layout with global providers

### `/src/components/`
Reusable React components organized by domain:
- **`auth/`** - Login forms, auth buttons
- **`landing/`** - Landing page sections
- **`ui/`** - Base UI components (buttons, cards, etc.)

### `/src/utils/supabase/`
Supabase client configurations:
- **`client.ts`** - Browser client
- **`server.ts`** - Server-side client
- **`middleware.ts`** - Middleware helper

### `/src/types/`
TypeScript type definitions and declarations

## File Naming Conventions

- **Pages**: `page.tsx` (App Router convention)
- **Layouts**: `layout.tsx` (App Router convention)
- **Components**: `kebab-case.tsx` (e.g., `login-form.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `auth-helpers.ts`)
- **Types**: `kebab-case.d.ts` (e.g., `auth-types.d.ts`)

## Import Patterns

```typescript
// Absolute imports using @ alias
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import { AuthUser } from "@/types/auth"

// Relative imports for local files
import { LoginForm } from "./login-form"
```

## Component Organization

Components are organized by domain and complexity:

1. **Base UI Components** (`/components/ui/`)
   - Atomic components (Button, Input, Card)
   - Shared across the application

2. **Feature Components** (`/components/[domain]/`)
   - Domain-specific components
   - Business logic included

3. **Page Components** (`/app/[route]/page.tsx`)
   - Top-level page components
   - Route-specific logic

## Configuration Files

- **`next.config.ts`** - Next.js configuration
- **`tailwind.config.ts`** - Tailwind CSS configuration
- **`tsconfig.json`** - TypeScript configuration
- **`eslint.config.mjs`** - ESLint configuration
- **`components.json`** - shadcn/ui configuration