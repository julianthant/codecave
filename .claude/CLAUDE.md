# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Writing Functions Best Practices

When evaluating whether a function you implemented is good or not, use this checklist:

1. Can you read the function and HONESTLY easily follow what it's doing? If yes, then stop here.
2. Does the function have very high cyclomatic complexity? (number of independent paths, or, in a lot of cases, number of nesting if if-else as a proxy). If it does, then it's probably sketchy.
3. Are there any common data structures and algorithms that would make this function much easier to follow and more robust? Parsers, trees, stacks / queues, etc.
4. Are there any unused parameters in the function?
5. Are there any unnecessary type casts that can be moved to function arguments?
6. Is the function easily testable without mocking core features (e.g. sql queries, redis, etc.)? If not, can this function be tested as part of an integration test?
7. Does it have any hidden untested dependencies or any values that can be factored out into the arguments instead? Only care about non-trivial dependencies that can actually change or affect the function.
8. Brainstorm 3 better function names and see if the current name is the best, consistent with rest of codebase.

IMPORTANT: you SHOULD NOT refactor out a separate function unless there is a compelling need, such as:

- the refactored function is used in more than one place
- the refactored function is easily unit testable while the original function is not AND you can't test it any other way
- the original function is extremely hard to follow and you resort to putting comments everywhere just to explain it

## Writing Tests Best Practices

When evaluating whether a test you've implemented is good or not, use this checklist:

1. SHOULD parameterize inputs; never embed unexplained literals such as 42 or "foo" directly in the test.
2. SHOULD NOT add a test unless it can fail for a real defect. Trivial asserts (e.g., expect(2).toBe(2)) are forbidden.
3. SHOULD ensure the test description states exactly what the final expect verifies. If the wording and assert don’t align, rename or rewrite.
4. SHOULD compare results to independent, pre-computed expectations or to properties of the domain, never to the function’s output re-used as the oracle.
5. SHOULD follow the same lint, type-safety, and style rules as prod code (prettier, ESLint, strict types).
6. SHOULD express invariants or axioms (e.g., commutativity, idempotence, round-trip) rather than single hard-coded cases whenever practical. Use `fast-check` library e.g.

```
import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { getCharacterCount } from './string';

describe('properties', () => {
  test('concatenation functoriality', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        (a, b) =>
          getCharacterCount(a + b) ===
          getCharacterCount(a) + getCharacterCount(b)
      )
    );
  });
});
```

7. Unit tests for a function should be grouped under `describe(functionName, () => ...`.
8. Use `expect.any(...)` when testing for parameters that can be anything (e.g. variable ids).
9. ALWAYS use strong assertions over weaker ones e.g. `expect(x).toEqual(1)` instead of `expect(x).toBeGreaterThanOrEqual(1)`.
10. SHOULD test edge cases, realistic input, unexpected input, and value boundaries.
11. SHOULD NOT test conditions that are caught by the type checker.

## Project Context: CodeCave

**CodeCave** is a developer-focused social platform combining code sharing, professional networking, and community building with a unique block-based editor similar to Notion.

### Technology Stack

- **Frontend**: Next.js 15.4.4, React 19.1.0, TypeScript 5.x
- **Styling**: Tailwind CSS v4 (CSS-based config), Shadcn/ui components
- **Backend**: Supabase (PostgreSQL 15, Auth, Storage, Realtime)
- **State Management**: Zustand 5.x + TanStack Query 5.x + Immer
- **Code Processing**: Shiki syntax highlighting, Monaco Editor, Prettier
- **Package Manager**: pnpm (not npm)

### Code Organization

```
codecave/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                # Guest-accessible routes
│   │   │   ├── page.tsx            # Landing/Feed page
│   │   │   ├── explore/           # Explore page
│   │   │   ├── trending/          # Trending posts
│   │   │   ├── groups/            # Public groups
│   │   │   └── u/[username]/      # Public profiles
│   │   │
│   │   ├── (authenticated)/         # Auth-required routes
│   │   │   ├── dashboard/         # User dashboard
│   │   │   ├── editor/           # Post editor
│   │   │   │   ├── new/         # Create post
│   │   │   │   └── [id]/       # Edit post
│   │   │   ├── settings/        # User settings
│   │   │   └── groups/         # Group management
│   │   │
│   │   ├── auth/                    # Auth routes
│   │   │   ├── callback/          # OAuth callback
│   │   │   └── signout/          # Sign out
│   │   │
│   │   ├── api/                     # API routes
│   │   │   ├── posts/            # Posts CRUD
│   │   │   ├── users/            # User operations
│   │   │   ├── groups/           # Groups API
│   │   │   ├── code/             # Code processing
│   │   │   └── webhooks/         # External webhooks
│   │   │
│   │   └── layout.tsx              # Root layout
│   │
│   ├── components/                  # React components
│   │   ├── auth/                   # Auth components
│   │   │   ├── auth-button.tsx   # OAuth provider buttons
│   │   │   ├── auth-modal.tsx    # Modal authentication UI
│   │   │   ├── user-menu.tsx     # User profile dropdown menu
│   │   │   └── auth-guard.tsx    # Route protection component
│   │   ├── editor/                 # Editor components
│   │   │   ├── blocks/           # Block components
│   │   │   └── toolbar/          # Editor toolbar
│   │   ├── feed/                   # Feed components
│   │   ├── groups/                 # Group components
│   │   ├── layout/                 # Layout components
│   │   ├── landing/                # Landing page components
│   │   └── ui/                     # Base UI components (Shadcn)
│   │
│   ├── lib/                         # Utilities
│   │   ├── supabase/              # Supabase clients (now unused)
│   │   ├── code/                  # Code processing utilities
│   │   ├── algorithms/            # Feed algorithms
│   │   └── notion/                # Template generation
│   │
│   ├── utils/supabase/              # Supabase clients (current)
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client
│   │   └── middleware.ts          # Middleware client
│   │
│   ├── stores/                      # Zustand stores
│   │   ├── auth.store.ts          # Auth state
│   │   ├── editor.store.ts        # Editor state
│   │   ├── feed.store.ts          # Feed preferences
│   │   └── ui.store.ts            # UI state
│   │
│   ├── hooks/                       # Custom hooks
│   ├── types/                       # TypeScript types
│   │   ├── database.types.ts      # Supabase generated types
│   │   ├── index.ts               # Application types
│   │   └── google-one-tap.d.ts    # Third-party types
│   └── utils/                       # Helper functions
│
├── supabase/migrations/             # Database migrations
├── docs/                           # Documentation
│   ├── integration/                # Project docs
│   └── tasks/                      # Task completion docs
└── public/                         # Static assets
```

### Database Schema Overview

- **users**: Core user information, skills, collaboration preferences
- **posts**: User-generated content with blocks (JSON), tags, analytics
- **follows**: User following relationships
- **likes**: Post likes system
- **comments**: Threaded comments system
- **notifications**: User notification system
- **user_settings**: Preferences, privacy, app settings

### Important Configuration Notes

#### Tailwind CSS v4

- Uses CSS-based configuration (no tailwind.config.ts file)
- Configuration in `src/app/globals.css` using `@theme` directive
- Custom animations and keyframes defined in CSS

#### Supabase Setup

- Database types auto-generated in `src/types/database.types.ts`
- All clients include proper TypeScript typing
- RLS policies implemented for security

#### Development Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm lint` / `pnpm lint:fix` - ESLint
- `pnpm format` - Prettier formatting
- `pnpm type-check` - TypeScript checking
- `pnpm db:generate` - Generate TypeScript types from Supabase
- `pnpm db:push` - Push local migrations to Supabase
- `pnpm db:reset` - Reset Supabase database
- `pnpm db:migrate` - Reset and apply database migrations

#### Post-Task Verification Commands

After completing any task, run these to ensure everything works:

```bash
pnpm type-check    # Verify TypeScript compilation
pnpm lint         # Check code style and catch issues
pnpm build        # Test production build
```

#### Environment Setup

- Copy `.env.example` to `.env.local` and fill in Supabase credentials
- Supabase project URL and keys are required for database operations
- Database migration file: `supabase/migrations/20250731_initial_schema.sql`

#### MCP Servers Available & Usage Requirements

- **Context7**: `npx -y @upstash/context7-mcp` - **ALWAYS USE** for documentation lookup, even when confident about implementation details
- **Sequential Thinking**: `npx -y @modelcontextprotocol/server-sequential-thinking` - **USE BY DEFAULT** for most prompts unless very short/simple
- **IDE Integration**: Use `mcp__ide__getDiagnostics` for TypeScript/ESLint issues
- **Code Execution**: Use `mcp__ide__executeCode` for Jupyter/Python code when needed

#### Working Methodology

- **Documentation-First**: Always verify implementation details with Context7 MCP before coding
- **Think-Then-Act**: Use sequential thinking to break down complex tasks systematically
- **No Assumptions**: Even when confident, look up official documentation to ensure accuracy

### Key Features

- **Block-based content creation** (text, code, image, video, collaborator blocks)
- **Modern OAuth authentication** (GitHub, Google, Discord) with client-side flow and onboarding
- **Smart code features** (auto-formatting, syntax highlighting, live preview)
- **User profile management** with onboarding flow and profile customization
- **Collaboration discovery** (skill-based matching, project templates)
- **Developer groups** and communities
- **Real-time features** via Supabase

### Authentication System

- **Client-side OAuth flow** with loading states and error handling
- **Comprehensive onboarding** for new users with profile setup
- **Route protection** at middleware, layout, and component levels
- **User menu** with profile links and account management
- **State management** with Zustand + React Query integration
- **Security features** including PKCE flow, HTTP-only cookies, and CSRF protection

## Remember Shortcuts

Remember the following shortcuts which the user may invoke at any time.

### QNEW

When I type "qnew", this means:

```
Understand all BEST PRACTICES listed in CLAUDE.md.
Your code SHOULD ALWAYS follow these best practices.
```

### QPLAN

When I type "qplan", this means:

```
Analyze similar parts of the codebase and determine whether your plan:
- is consistent with rest of codebase
- introduces minimal changes
- reuses existing code
```

## QCODE

When I type "qcode", this means:

```
Implement your plan and make sure your new tests pass.
Always run tests to make sure you didn't break anything else.
Always run `prettier` on the newly created files to ensure standard formatting.
Always run `turbo typecheck lint` to make sure type checking and linting passes.
```

### QCHECK

When I type "qcheck", this means:

```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR code change you introduced (skip minor changes):

1. CLAUDE.md checklist Writing Functions Best Practices.
2. CLAUDE.md checklist Writing Tests Best Practices.
3. CLAUDE.md checklist Implementation Best Practices.
```

### QCHECKF

When I type "qcheckf", this means:

```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR function you added or edited (skip minor changes):

1. CLAUDE.md checklist Writing Functions Best Practices.
```

### QCHECKT

When I type "qcheckt", this means:

```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR test you added or edited (skip minor changes):

1. CLAUDE.md checklist Writing Tests Best Practices.
```

### QUX

When I type "qux", this means:

```
Imagine you are a human UX tester of the feature you implemented.
Output a comprehensive list of scenarios you would test, sorted by highest priority.
```

### QDOCS

When I type "qdocs", this means:

```
Generate comprehensive documentation for the project:

1. Update README.md as a documentation index with links to specific guides
2. Create organized docs/ folder structure:
   - docs/architecture/ - Project structure, tech stack
   - docs/setup/ - Environment setup, database configuration
   - docs/auth/ - Authentication guides and troubleshooting
   - docs/frontend/ - Components, styling, routing
   - docs/development/ - Workflow, standards, testing
   - docs/api/ - API routes, database operations
   - docs/config/ - TypeScript, linting, Tailwind setup
3. Write detailed markdown files for each section
4. Ensure all links work and documentation is comprehensive
5. Follow the existing project structure and conventions
```

### QGIT

When I type "qgit", this means:

```
Add all changes to staging, create a commit, and push to remote.

Follow this checklist for writing your commit message:
- SHOULD use Conventional Commits format: https://www.conventionalcommits.org/en/v1.0.0
- SHOULD NOT refer to Claude or Anthropic in the commit message.
- SHOULD structure commit message as follows:
<type>[optional scope]: <description>
[optional body]
[optional footer(s)]
- commit SHOULD contain the following structural elements to communicate intent:
fix: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
feat: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
BREAKING CHANGE: a commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking API change (correlating with MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of any type.
types other than fix: and feat: are allowed, for example @commitlint/config-conventional (based on the Angular convention) recommends build:, chore:, ci:, docs:, style:, refactor:, perf:, test:, and others.
footers other than BREAKING CHANGE: <description> may be provided and follow a convention similar to git trailer format.
```
