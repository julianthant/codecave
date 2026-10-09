# CodeCave

A community app where developers post their projects, follow each other and find collaborators. Built with Next.js 15, Supabase and Drizzle ORM.

## Status

In progress. Development paused in August 2025. The backend is ahead of the frontend: most API routes read and write the database, while several screens still render mock data.

| Area | State |
| --- | --- |
| GitHub and Google sign-in through Supabase Auth | Done |
| Two-step onboarding that creates the profile | Done |
| Profiles, profile settings and follow or unfollow | API done. Parts of the profile page use mock data. |
| Connections: followers, following, invitations, suggestions, stats | API done. Some connection screens use mock data. |
| Projects: create, list, read, update, delete | API done |
| Post likes and single-post reads | API done |
| Feed, post composer, dashboard analytics, collaborations | UI only, using mock data |
| Premium page | Placeholder |

## What it does

- Signs users in with GitHub or Google and walks new users through onboarding.
- Gives each user a public profile at `/profile/[username]` with skills, experience, projects and social links.
- Lets users follow each other, send connection invitations and get suggested connections.
- Stores projects and posts per user, with likes on posts.
- Keeps private settings, such as preferences and developer settings, separate from the public profile.

## How it works

Route handlers in `src/app/api/` validate input with Zod schemas from `src/db/schema/validation/` and call one data service, `src/services/database.ts`. That service queries Supabase Postgres through Drizzle ORM. Supabase row-level security policies separate public profile data from private settings.

The schema lives in `src/db/schema/` and has these tables: `profiles`, `user_settings`, `experiences`, `projects`, `posts` and `post_likes`.

## Tech stack

- Next.js 15 (App Router, Turbopack) and TypeScript in strict mode
- Supabase (Postgres and Auth) with Drizzle ORM
- TanStack Query for server state and Zustand for client state
- Tailwind CSS v4, Radix UI and Framer Motion
- React Hook Form with Zod

## Run it locally

You need Node.js 18 or later, pnpm and a Supabase project with GitHub or Google sign-in turned on.

1. Install the dependencies:

   ```bash
   pnpm install
   ```

2. Copy the example environment file and fill in your Supabase values:

   ```bash
   cp .env.example .env
   ```

   | Variable | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL from the Supabase API settings |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key from the Supabase API settings |
   | `DATABASE_URL` | Postgres connection string from the Supabase database settings |
   | `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` |

3. Push the schema to your database and start the dev server:

   ```bash
   pnpm db:push
   pnpm dev
   ```

4. Open http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Starts the dev server with Turbopack |
| `pnpm build` | Builds for production |
| `pnpm lint` | Runs ESLint |
| `pnpm type-check` | Runs the TypeScript compiler without emitting files |
| `pnpm db:push` | Pushes the Drizzle schema to the database |
| `pnpm db:studio` | Opens Drizzle Studio |
| `pnpm db:seed` | Seeds the database from `scripts/seed.js` |
