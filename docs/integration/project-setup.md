# Project Setup

[← Back to Index](./codecave-index.md) | [Previous: Database Schema](./database-schema.md) | [Next: Authentication →](./authentication.md)

## Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Git
- Supabase account
- Vercel account (for deployment)
- Stripe account (for payments)

## Step 1: Create Next.js Project

```bash
# Create new Next.js 15 project
npx create-next-app@latest codecave --typescript --tailwind --app --use-npm

# Navigate to project
cd codecave

# Open in VS Code
code .
```

### Configuration Choices

- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Import alias: Yes (@/\*)

## Step 2: Install Dependencies

### Core Dependencies

```bash
# Supabase
npm install @supabase/supabase-js@latest @supabase/ssr@latest

# State Management
npm install zustand@latest immer@latest

# Data Fetching
npm install @tanstack/react-query@latest

# UI Components
npm install class-variance-authority@latest clsx@latest tailwind-merge@latest
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-tabs @radix-ui/react-select
npm install @radix-ui/react-switch @radix-ui/react-checkbox
npm install @radix-ui/react-separator @radix-ui/react-label
npm install @radix-ui/react-slot @radix-ui/react-toast

# Icons
npm install lucide-react@latest react-icons@latest

# Forms
npm install react-hook-form@latest zod@latest @hookform/resolvers@latest

# Code Highlighting
npm install shiki@latest @shikijs/react@latest

# Code Formatting
npm install prettier@latest

# Editor
npm install @monaco-editor/react@latest

# Utilities
npm install date-fns@latest nanoid@latest
npm install react-intersection-observer@latest
npm install react-hot-toast@latest

# Animation
npm install framer-motion@latest
```

### Dev Dependencies

```bash
npm install -D @types/node @types/react @types/react-dom
npm install -D eslint-config-prettier@latest
npm install -D @typescript-eslint/parser@latest @typescript-eslint/eslint-plugin@latest
```

## Step 3: Environment Setup

### Create `.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CodeCave

# Stripe (for later)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRO_PRICE_ID=

# Optional
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

### Create `.env.example`

```env
# Copy this to .env.local and fill in your values

# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App (required)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CodeCave

# Stripe (optional - for monetization)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRO_PRICE_ID=

# Analytics (optional)
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

## Step 4: Configure TypeScript

### Update `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Step 5: Configure Tailwind CSS

### Update `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### Update `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom scrollbar */
@layer utilities {
  .scrollbar-thin {
    scrollbar-width: thin;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

## Step 6: Configure ESLint

### Update `.eslintrc.json`

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/display-name": "off"
  }
}
```

### Create `.prettierrc`

```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80
}
```

## Step 7: Setup Utility Functions

### Create `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}
```

## Step 8: Create Type Definitions

### Create `src/types/database.types.ts`

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          banner_url: string | null;
          location: string | null;
          timezone: string;
          website_url: string | null;
          github_username: string | null;
          twitter_username: string | null;
          discord_username: string | null;
          linkedin_url: string | null;
          skills: string[];
          languages: string[];
          experience_level:
            | "student"
            | "junior"
            | "mid"
            | "senior"
            | "lead"
            | null;
          years_coding: number | null;
          available_for_collab: boolean;
          collab_preferences: Json;
          is_pro: boolean;
          pro_since: string | null;
          reputation_score: number;
          created_at: string;
          updated_at: string;
          last_seen_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          banner_url?: string | null;
          location?: string | null;
          timezone?: string;
          website_url?: string | null;
          github_username?: string | null;
          twitter_username?: string | null;
          discord_username?: string | null;
          linkedin_url?: string | null;
          skills?: string[];
          languages?: string[];
          experience_level?:
            | "student"
            | "junior"
            | "mid"
            | "senior"
            | "lead"
            | null;
          years_coding?: number | null;
          available_for_collab?: boolean;
          collab_preferences?: Json;
          is_pro?: boolean;
          pro_since?: string | null;
          reputation_score?: number;
          created_at?: string;
          updated_at?: string;
          last_seen_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          banner_url?: string | null;
          location?: string | null;
          timezone?: string;
          website_url?: string | null;
          github_username?: string | null;
          twitter_username?: string | null;
          discord_username?: string | null;
          linkedin_url?: string | null;
          skills?: string[];
          languages?: string[];
          experience_level?:
            | "student"
            | "junior"
            | "mid"
            | "senior"
            | "lead"
            | null;
          years_coding?: number | null;
          available_for_collab?: boolean;
          collab_preferences?: Json;
          is_pro?: boolean;
          pro_since?: string | null;
          reputation_score?: number;
          created_at?: string;
          updated_at?: string;
          last_seen_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          slug: string;
          blocks: Json;
          tags: string[];
          type:
            | "article"
            | "snippet"
            | "showcase"
            | "discussion"
            | "collaboration";
          is_published: boolean;
          is_featured: boolean;
          published_at: string | null;
          view_count: number;
          unique_viewers: string[];
          like_count: number;
          comment_count: number;
          share_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          slug: string;
          blocks?: Json;
          tags?: string[];
          type?:
            | "article"
            | "snippet"
            | "showcase"
            | "discussion"
            | "collaboration";
          is_published?: boolean;
          is_featured?: boolean;
          published_at?: string | null;
          view_count?: number;
          unique_viewers?: string[];
          like_count?: number;
          comment_count?: number;
          share_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          slug?: string;
          blocks?: Json;
          tags?: string[];
          type?:
            | "article"
            | "snippet"
            | "showcase"
            | "discussion"
            | "collaboration";
          is_published?: boolean;
          is_featured?: boolean;
          published_at?: string | null;
          view_count?: number;
          unique_viewers?: string[];
          like_count?: number;
          comment_count?: number;
          share_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Add more tables as needed
    };
  };
}
```

### Create `src/types/index.ts`

```typescript
import { Database } from "./database.types";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type User = Tables<"users">;
export type Post = Tables<"posts">;

export interface Block {
  id: string;
  type:
    | "text"
    | "code"
    | "image"
    | "video"
    | "collaborator"
    | "poll"
    | "divider";
  content: any;
  order: number;
}

export interface PostWithUser extends Post {
  user: Pick<
    User,
    "id" | "username" | "display_name" | "avatar_url" | "is_pro"
  >;
}
```

## Step 9: Configure Next.js

### Update `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
```

## Step 10: Setup Package.json Scripts

### Update `package.json`

```json
{
  "name": "codecave",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,md,json}\"",
    "type-check": "tsc --noEmit",
    "db:generate": "supabase gen types typescript --project-id $PROJECT_ID > src/types/database.types.ts",
    "db:push": "supabase db push",
    "db:reset": "supabase db reset"
  }
}
```

## Step 11: Create Folder Structure

```bash
# Create necessary directories
mkdir -p src/app/(public)
mkdir -p src/app/(authenticated)
mkdir -p src/app/auth
mkdir -p src/app/api
mkdir -p src/components/auth
mkdir -p src/components/editor
mkdir -p src/components/feed
mkdir -p src/components/layout
mkdir -p src/components/ui
mkdir -p src/lib/supabase
mkdir -p src/stores
mkdir -p src/hooks
mkdir -p src/utils

# Create placeholder files
touch src/middleware.ts
touch src/app/providers.tsx
```

## Step 12: Initialize Git

```bash
# Initialize git repository
git init

# Create .gitignore
cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# editor
.vscode
.idea
EOF

# Initial commit
git add .
git commit -m "Initial project setup"
```

## Verification Checklist

- [ ] Project created with Next.js 15
- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] TypeScript configured
- [ ] Tailwind CSS configured
- [ ] ESLint and Prettier configured
- [ ] Folder structure created
- [ ] Type definitions added
- [ ] Git initialized

## Troubleshooting

### Common Issues

1. **Module not found errors**

   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

2. **TypeScript errors**

   ```bash
   npm run type-check
   ```

3. **Environment variable issues**
   - Ensure `.env.local` exists
   - Restart dev server after changes
   - Check for typos in variable names

## Next Steps

Your project is now set up! Continue to [Authentication System](./05-authentication.md) →
