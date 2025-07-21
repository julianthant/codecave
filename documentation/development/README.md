# Development Documentation

This directory contains documentation related to setting up and working with the CodeCave development environment.

## 📚 Contents

- [Local Development](LOCAL-DEVELOPMENT.md) - Setting up the local development environment
- [Project Setup](PROJECT-SETUP.md) - Initial project setup instructions
- [Development Environment](DEVELOPMENT-ENVIRONMENT.md) - Development environment details
- [Local Environment Setup](LOCAL-ENV-SETUP.md) - Environment variables setup

## 🚀 Getting Started

To set up a development environment for CodeCave:

1. Ensure you have the prerequisites installed:
   - Node.js (v18+) and pnpm (v8+)
   - Docker and Docker Compose
   - Git

2. Clone the repository:
   ```bash
   git clone https://github.com/your-username/codecave.git
   cd codecave
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit the .env file with your settings
   ```

5. Start the infrastructure services:
   ```bash
   docker-compose up -d db redis search mq
   ```

6. Start the development servers:
   ```bash
   pnpm dev
   ```

## 🧠 Development Best Practices

1. **Server Components**: Use Next.js server components wherever possible
2. **TypeScript**: Ensure proper typing for all code
3. **Testing**: Write tests for critical functionality
4. **Documentation**: Update documentation when making changes
5. **Environment Variables**: Use Doppler for managing environment variables

## 🛠️ Common Tasks

### Database Migrations

```bash
# Generate a new migration
cd apps/api
pnpm prisma:migrate:dev

# Apply migrations
pnpm prisma:migrate:deploy
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run frontend tests
pnpm web:test

# Run API tests
pnpm api:test
```

### Building for Production

```bash
# Build all applications
pnpm build

# Build only frontend
pnpm web:build

# Build only backend
pnpm api:build
```

---

**Last Updated**: July 30, 2025 