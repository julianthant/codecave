# CodeCave 🏗️

> The Developer Community Platform - Where creators and codecoders build the future together.

[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 🚀 Overview

CodeCave is a modern developer community platform built with Next.js 15, designed to connect project creators and developers. The platform features project showcasing, collaboration tools, comprehensive user profiles, and a community-focused environment where developers can share their work and find collaborators.

## ✨ Key Features

### 🎯 Core Features

- **🔐 Authentication**: Secure OAuth with GitHub, Google, and Discord integration
- **👤 User Profiles**: Comprehensive developer profiles with skills, projects, and social links
- **📊 Analytics Dashboard**: Personal analytics with metrics, charts, and engagement tracking
- **⚙️ Settings Management**: Complete account, profile, developer, and preference settings
- **🎨 Modern UI**: Beautiful, responsive design with dark/light theme support

### 🚧 In Development

- **📰 Feed System**: Algorithm-based content feed with filtering and search
- **📝 Content Creation**: Rich post editor with code syntax highlighting
- **🤝 Collaboration Tools**: Project matching and team formation features
- **🔔 Notifications**: Real-time updates and engagement notifications

### 🎭 UI/UX Features

- **✨ Animations**: Smooth Framer Motion animations throughout
- **📱 Responsive Design**: Mobile-first responsive layout
- **🎨 Component System**: Radix UI primitives with custom styling
- **🌙 Theme Support**: System, light, and dark theme modes

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 15.4.4](https://nextjs.org/) with App Router & Turbopack
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) with strict mode
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with CSS-in-JS
- **UI Components**: [Radix UI](https://radix-ui.com/) primitives with custom components
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth transitions
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation

### Backend & Database

- **Database**: [Supabase](https://supabase.com/) (PostgreSQL) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: Supabase Auth with SSR support
- **API**: Next.js API routes with TypeScript

### State Management

- **Client State**: [Zustand](https://zustand.surge.sh/) stores with persistence
- **Server State**: [TanStack Query](https://tanstack.com/query) for caching and synchronization
- **Form State**: React Hook Form for form management

### Development & Quality

- **Type Safety**: TypeScript strict mode with inferred types
- **Code Quality**: ESLint, Prettier, and strict linting rules
- **Performance**: Turbopack for fast development, Vercel Analytics
- **Icons**: [Lucide React](https://lucide.dev/) for consistent iconography

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm** package manager
- **Supabase** account and project
- **Git** for version control

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/codecave.git
cd codecave
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Copy the environment template and configure your variables:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_supabase_database_url

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

```bash
# Generate and push database schema
pnpm db:generate
pnpm db:push

# Optional: Open Drizzle Studio to view/manage data
pnpm db:studio
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application running!

## 📁 Project Structure

```
codecave/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 (authenticated)/   # Protected routes
│   │   │   ├── 📁 dashboard/      # Analytics dashboard
│   │   │   ├── 📁 profile/        # User profiles
│   │   │   └── 📁 settings/       # Account settings
│   │   ├── 📁 (public)/          # Public marketing pages
│   │   ├── 📁 auth/               # Authentication pages
│   │   ├── 📁 api/                # API route handlers
│   │   └── 📁 feed/               # Main feed page
│   ├── 📁 components/             # Reusable React components
│   │   ├── 📁 ui/                 # Base UI components
│   │   ├── 📁 auth/               # Authentication components
│   │   ├── 📁 dashboard/          # Dashboard components
│   │   ├── 📁 profile/            # Profile components
│   │   ├── 📁 settings/           # Settings components
│   │   └── 📁 landing/            # Landing page components
│   ├── 📁 db/                     # Database schema & client
│   ├── 📁 hooks/                  # Custom React hooks
│   ├── 📁 stores/                 # Zustand state stores
│   ├── 📁 types/                  # TypeScript type definitions
│   └── 📁 utils/                  # Utility functions
├── 📄 CLAUDE.md                   # AI assistant instructions
├── 📄 package.json                # Dependencies and scripts
└── 📄 README.md                   # This file
```

## 🔧 Available Scripts

### Development

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
```

### Code Quality

```bash
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix linting issues automatically
pnpm format       # Format code with Prettier
pnpm type-check   # TypeScript type checking
```

### Database Operations

```bash
pnpm db:generate  # Generate migrations from schema
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema directly to database
pnpm db:studio    # Open Drizzle Studio UI
pnpm db:drop      # Drop migrations
```

## 🗄️ Database Schema

### Core Tables

- **`profiles`** - Public user profile information (usernames, bio, social links)
- **`user_settings`** - Private user preferences and developer settings
- **`posts`** - User-generated content with visibility controls

### Key Features

- **Public/Private Separation**: RLS policies for data security
- **Type Safety**: Drizzle ORM with inferred TypeScript types
- **Modern Patterns**: camelCase TypeScript, snake_case database fields

## 🎨 UI Components

Built with **Radix UI** primitives and custom styling:

- **Form Controls**: Inputs, selects, checkboxes, switches
- **Navigation**: Responsive navbar, mobile menu, breadcrumbs
- **Data Display**: Cards, tables, charts, metrics
- **Feedback**: Toasts, loading states, error boundaries
- **Layout**: Responsive grids, containers, sections

## 🔐 Authentication Flow

1. **OAuth Sign-in**: GitHub, Google, or Discord
2. **Profile Check**: Verify user profile exists
3. **Onboarding**: New users create their developer profile
4. **Dashboard**: Redirect to main application

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main

### Manual Deployment

```bash
pnpm build
pnpm start
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript strict mode (no `any` types)
- Use conventional commit messages
- Ensure all tests pass (`pnpm lint`, `pnpm type-check`)
- Update documentation for new features

## 📝 Code Quality

This project maintains high code quality standards:

- ✅ **TypeScript Strict Mode**: Full type safety
- ✅ **ESLint Configuration**: Zero warnings policy
- ✅ **Prettier Formatting**: Consistent code style
- ✅ **Component Patterns**: Radix UI composition patterns
- ✅ **Performance**: Optimized images, lazy loading, code splitting

## 🆘 Support

- 📚 **Documentation**: Check `CLAUDE.md` for detailed development guide
- 🐛 **Issues**: Report bugs or request features via GitHub Issues
- 💬 **Discussions**: Join community discussions in GitHub Discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vercel** for Next.js and deployment platform
- **Supabase** for backend infrastructure
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations

---

**Built with ❤️ by the CodeCave team**

[🌐 Website](https://codecave.dev) • [📧 Contact](mailto:hello@codecave.dev) • [🐦 Twitter](https://twitter.com/codecave)

</div>
