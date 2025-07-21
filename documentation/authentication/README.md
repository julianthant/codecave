# Authentication Documentation

This directory contains documentation related to the authentication system used in CodeCave.

## 📚 Contents

- [Authentication Overview](AUTHENTICATION-OVERVIEW.md) - Overview of the authentication system
- [OAuth Setup](OAUTH-SETUP.md) - Setting up OAuth providers
- [Better Auth Migration](BETTER-AUTH-MIGRATION.md) - Migration from Supabase to Better Auth
- [Better Auth Quick Reference](BETTER-AUTH-QUICK-REFERENCE.md) - Quick reference guide for Better Auth
- [OAuth Authentication Implementation](OAUTH-AUTHENTICATION-IMPLEMENTATION.md) - OAuth implementation details
- [OAuth Provider Setup](OAUTH-PROVIDER-SETUP.md) - Setting up OAuth providers
- [OAuth Quick Reference](OAUTH-QUICK-REFERENCE.md) - Quick reference guide for OAuth
- [Production OAuth Setup](PRODUCTION-OAUTH-SETUP.md) - Setting up OAuth for production

## 🔐 Authentication System Overview

The CodeCave application uses **Better Auth** with OAuth providers (GitHub and Google) for authentication. The authentication system was migrated from Supabase Auth on July 20, 2025.

### Key Components

- **Better Auth**: Core authentication library
- **OAuth Providers**: GitHub and Google
- **Session Management**: HTTP-only cookies
- **Database**: PostgreSQL tables for users, accounts, sessions, and verification tokens

### Getting Started

To set up authentication for local development:

1. Configure OAuth providers following the [OAuth Setup](OAUTH-SETUP.md) guide
2. Set the required environment variables in your `.env` file
3. Use the Better Auth React client for frontend integration

---

**Last Updated**: July 30, 2025 