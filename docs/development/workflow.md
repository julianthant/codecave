# Development Workflow

This guide outlines the development process and best practices for contributing to CodeCave.

## Getting Started

### 1. Environment Setup
```bash
# Clone repository
git clone <repository-url>
cd brocode

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
pnpm dev
```

### 2. Branch Strategy

We use **GitFlow** branching strategy:

- **`main`** - Production-ready code
- **`develop`** - Integration branch for features
- **`feature/*`** - New features (`feature/user-profile`)
- **`hotfix/*`** - Critical production fixes
- **`release/*`** - Release preparation

```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Work on feature
git add .
git commit -m "feat: add user profile component"

# Push and create PR
git push origin feature/your-feature-name
```

## Development Process

### 1. Feature Development

1. **Create Issue**
   - Describe the feature/bug
   - Add appropriate labels
   - Assign to yourself

2. **Create Branch**
   ```bash
   git checkout -b feature/issue-number-description
   ```

3. **Develop Feature**
   - Write code following [Code Standards](./standards.md)
   - Add tests for new functionality
   - Update documentation if needed

4. **Test Locally**
   ```bash
   # Run development server
   pnpm dev
   
   # Run linting
   pnpm lint
   
   # Run type checking
   pnpm build
   ```

5. **Commit Changes**
   ```bash
   # Stage changes
   git add .
   
   # Commit with conventional commit message
   git commit -m "feat: add user authentication"
   ```

6. **Create Pull Request**
   - Use PR template
   - Link related issues
   - Request reviews

### 2. Code Review Process

#### For Authors
- Ensure CI passes
- Respond to feedback promptly
- Update documentation
- Squash commits if needed

#### For Reviewers
- Check code quality and standards
- Test functionality locally
- Verify documentation updates
- Approve or request changes

## Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>[optional scope]: <description>

# Examples
feat: add user authentication
fix: resolve login redirect issue
docs: update README installation steps
style: format auth components
refactor: extract auth utilities
test: add login form tests
chore: update dependencies
```

### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting (no logic changes)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

## Testing Strategy

### 1. Development Testing
```bash
# Manual testing
pnpm dev
# Test features in browser

# Type checking
pnpm build
# Verify TypeScript compilation

# Linting
pnpm lint
# Check code quality
```

### 2. Pre-commit Testing
```bash
# Run all checks before committing
pnpm lint && pnpm build
```

## Code Organization

### 1. File Structure
Follow the [Project Structure](../architecture/project-structure.md) guidelines:

```typescript
// Good: Organized imports
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import type { User } from "@/types/auth"

// Good: Clear function naming
export async function authenticateUser(email: string) {
  // Implementation
}
```

### 2. Component Guidelines
```typescript
// Good: Typed props interface
interface LoginFormProps {
  onSuccess: (user: User) => void;
  redirectTo?: string;
}

// Good: Clear component structure
export function LoginForm({ onSuccess, redirectTo }: LoginFormProps) {
  // Implementation
}
```

## Environment-Specific Development

### Local Development
```bash
# Environment
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Commands
pnpm dev          # Start development server
pnpm dev --turbo  # Start with Turbopack (faster)
```

### Production Testing
```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Debugging

### 1. Development Tools
- **Next.js DevTools**: Built-in debugging
- **React DevTools**: Component inspection
- **Supabase Dashboard**: Database queries
- **Browser DevTools**: Network and console

### 2. Common Debug Patterns
```typescript
// Server-side debugging
console.log('Server:', { user, error });

// Client-side debugging
useEffect(() => {
  console.log('Client state:', { user, loading });
}, [user, loading]);
```

### 3. Error Handling
```typescript
// Good: Comprehensive error handling
try {
  const { data, error } = await supabase.auth.signIn(credentials);
  if (error) throw error;
  return data;
} catch (error) {
  console.error('Authentication error:', error);
  // Handle specific error types
  if (error.message.includes('Invalid login')) {
    // Handle invalid credentials
  }
  throw error;
}
```

## Performance Considerations

### 1. Bundle Size
- Use dynamic imports for large components
- Optimize images with Next.js Image
- Monitor bundle analyzer output

### 2. Database Queries
- Use appropriate Supabase query patterns
- Implement proper pagination
- Cache frequently accessed data

### 3. Authentication
- Minimize auth checks in components
- Use middleware for route protection
- Cache user sessions appropriately

## Release Process

### 1. Preparation
```bash
# Switch to develop branch
git checkout develop
git pull origin develop

# Create release branch
git checkout -b release/v1.0.0
```

### 2. Release Tasks
- Update version numbers
- Update changelog
- Run final tests
- Update documentation

### 3. Deployment
```bash
# Merge to main
git checkout main
git merge release/v1.0.0

# Tag release
git tag v1.0.0
git push origin main --tags

# Merge back to develop
git checkout develop
git merge main
```

## Next Steps

- [Code Standards](./standards.md) - Coding conventions
- [Testing Guide](./testing.md) - Testing strategies
- [Deployment](./deployment.md) - Deployment process