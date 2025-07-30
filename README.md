# CodeCave

A modern full-stack application built with Next.js 15, Supabase, and Tailwind CSS featuring OAuth authentication and protected routes.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 📖 Documentation

This README serves as an index to comprehensive documentation. Click on any topic below to access detailed guides:

### 🏗️ Architecture & Setup
- **[Project Structure](./docs/architecture/project-structure.md)** - Overview of the codebase organization
- **[Technology Stack](./docs/architecture/tech-stack.md)** - Technologies used and why
- **[Environment Setup](./docs/setup/environment.md)** - Environment variables and configuration
- **[Database Setup](./docs/setup/database.md)** - Supabase configuration and schema

### 🔐 Authentication
- **[Authentication Overview](./docs/auth/overview.md)** - How authentication works in the app
- **[OAuth Setup](./docs/auth/oauth-setup.md)** - Google, GitHub, Discord OAuth configuration
- **[Route Protection](./docs/auth/route-protection.md)** - Middleware and protected routes
- **[Troubleshooting Auth](./docs/auth/troubleshooting.md)** - Common authentication issues

### 🎨 Frontend
- **[Components Guide](./docs/frontend/components.md)** - UI components and usage
- **[Styling Guide](./docs/frontend/styling.md)** - Tailwind CSS patterns and conventions
- **[Pages & Routing](./docs/frontend/routing.md)** - Next.js App Router usage
- **[State Management](./docs/frontend/state-management.md)** - Client-side state patterns

### 🔧 Development
- **[Development Workflow](./docs/development/workflow.md)** - How to develop new features
- **[Code Standards](./docs/development/standards.md)** - Coding conventions and best practices
- **[Testing Guide](./docs/development/testing.md)** - Testing strategies and setup
- **[Deployment](./docs/development/deployment.md)** - Deployment process and environments

### 🔌 API & Backend
- **[API Routes](./docs/api/routes.md)** - Next.js API routes documentation
- **[Database Operations](./docs/api/database.md)** - Supabase queries and operations
- **[Server Actions](./docs/api/server-actions.md)** - Next.js Server Actions usage

### 🛠️ Configuration
- **[TypeScript Configuration](./docs/config/typescript.md)** - TypeScript setup and types
- **[ESLint & Prettier](./docs/config/linting.md)** - Code quality tools
- **[Tailwind Configuration](./docs/config/tailwind.md)** - Tailwind CSS customization

## 🏃‍♂️ Getting Started

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd brocode
   pnpm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   - Configure Supabase credentials
   - Set up OAuth providers
   - See [Environment Setup](./docs/setup/environment.md) for details

3. **Database Setup**
   - Set up Supabase project
   - Run database migrations
   - Configure RLS policies
   - See [Database Setup](./docs/setup/database.md) for details

4. **Start Development**
   ```bash
   pnpm dev
   ```

## 🌟 Features

- ✅ OAuth Authentication (Google, GitHub, Discord)
- ✅ Protected Routes with Middleware
- ✅ Modern UI with Tailwind CSS
- ✅ Type-safe with TypeScript
- ✅ Server-side Rendering with Next.js 15
- ✅ Real-time Database with Supabase
- ✅ Responsive Design
- ✅ SEO Optimized

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **TypeScript**: Full type safety
- **Package Manager**: pnpm

## 🤝 Contributing

Please read our [Development Workflow](./docs/development/workflow.md) and [Code Standards](./docs/development/standards.md) before contributing.

## 📝 License

This project is private and proprietary.

---

**Need help?** Check the [troubleshooting guides](./docs/auth/troubleshooting.md) or create an issue.