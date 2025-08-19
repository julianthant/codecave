# Components Directory (`src/components/`)

## Overview

This directory contains all React components for **CodeCave**, organized by feature domain. Components follow a modular architecture with clear separation between UI primitives, feature-specific components, and layout components.

## Architecture Pattern

- **Component Design**: Functional components with TypeScript
- **Styling**: Tailwind CSS with custom CSS variables
- **State Management**: Props drilling, Zustand stores, and TanStack Query
- **UI Library**: Custom component library in `ui/` folder
- **Accessibility**: Focus on semantic HTML and ARIA attributes

## Directory Structure

### Feature-Based Organization

- `auth/` - Authentication and user management components
- `dashboard/` - Analytics dashboard and metrics components
- `feed/` - Content feed and navigation components
- `landing/` - Marketing and landing page components
- `onboarding/` - User onboarding flow components
- `profile/` - User profile display and management
- `settings/` - User preferences and configuration
- `ui/` - Reusable UI primitives and design system

## Detailed Component Breakdown

### Authentication (`auth/`)

- **`auth-button.tsx`**: Primary authentication CTA button
- **`auth-guard.tsx`**: Route protection wrapper component
- **`auth-modal.tsx`**: Sign-in/sign-up modal dialog
- **`sign-in-drawer.tsx`**: Mobile-friendly sign-in drawer
- **`user-menu.tsx`**: Authenticated user dropdown menu

**Usage Pattern**: Import auth components for protected routes and user management flows.

### Dashboard (`dashboard/`)

Analytics and metrics components for user dashboard:

- **`activity-chart.tsx`**: User activity visualization
- **`dashboard-charts.tsx`**: Collection of chart components
- **`dashboard-header.tsx`**: Dashboard page header with actions
- **`dashboard-metrics.tsx`**: Key performance metrics display
- **`dashboard-sidebar.tsx`**: Dashboard navigation sidebar
- **`engagement-chart.tsx`**: User engagement analytics
- **`metric-card.tsx`**: Individual metric display card
- **`progress-indicators.tsx`**: Progress bars and completion status
- **`quick-actions.tsx`**: Frequently used action buttons
- **`recent-posts.tsx`**: Latest user posts widget
- **`top-posts.tsx`**: Most popular posts widget

**Data Dependencies**: Uses TanStack Query for real-time dashboard data.

### Feed (`feed/`)

Main application navigation and content feed:

- **`navbar/`**: Complete navigation system
  - **`navbar.tsx`**: Main navigation container
  - **`desktop-nav.tsx`**: Desktop navigation layout
  - **`mobile-menu.tsx`**: Mobile hamburger menu
  - **`mobile-nav-tabs.tsx`**: Mobile bottom navigation
  - **`notification-icon.tsx`**: Notification bell with badge
  - **`search-bar.tsx`**: Global search functionality
  - **`sign-in-button.tsx`**: Authentication CTA in nav
  - **`user-avatar/`**: User profile dropdown system
    - **`user-avatar.tsx`**: Avatar with dropdown trigger
    - **`account-section.tsx`**: Account management links
    - **`developer-section.tsx`**: Developer tools and settings
    - **`preferences-section.tsx`**: User preference shortcuts
    - **`profile-section.tsx`**: Profile navigation links
    - **`social-section.tsx`**: Social media connections
    - **`user-info-section.tsx`**: User details display

**Navigation State**: Managed by `useSidebarStore` for responsive behavior.

### Landing (`landing/`)

Marketing and landing page components:

- **`animated-group.tsx`**: Animated UI element groups
- **`features.tsx`**: Product features showcase
- **`footer.tsx`**: Site footer with links and info
- **`header.tsx`**: Landing page header/hero
- **`hero.tsx`**: Main hero section with CTA
- **`revolution.tsx`**: Brand messaging component
- **`text-effect.tsx`**: Animated text effects

**Design Focus**: High-impact visuals and clear value propositions.

### Onboarding (`onboarding/`)

New user onboarding experience:

- **`notification.tsx`**: Onboarding step notifications
- **`onboarding-form.tsx`**: Multi-step onboarding form

**Flow Management**: Integrates with `/onboarding` page and API routes.

### Profile (`profile/`)

Comprehensive user profile system:

- **`activity-timeline.tsx`**: User activity feed
- **`code-intro.tsx`**: Developer code showcase
- **`connect-section.tsx`**: Social connections and collaboration
- **`content-card-footer.tsx`**: Post/project card actions
- **`content-stream.tsx`**: User content feed
- **`featured-grid.tsx`**: Featured projects grid
- **`inline-comments.tsx`**: Comment system for posts
- **`profile-hero.tsx`**: Profile header with cover photo
- **`profile-post.tsx`**: Individual post display
- **`profile-project.tsx`**: Project showcase component
- **`profile-sidebar.tsx`**: Profile navigation and info
- **`profile-stats.tsx`**: User statistics display
- **`profile-summary.tsx`**: Brief profile overview
- **`projects-list.tsx`**: List of user projects
- **`skill-badge.tsx`**: Individual skill tag
- **`skills-matrix.tsx`**: Skills and expertise display

**Modal System**:

- **`modals/booking-modal.tsx`**: Collaboration booking
- **`modals/comments-drawer.tsx`**: Comments sidebar
- **`modals/cover-photo-modal.tsx`**: Cover photo upload

**Data Integration**: Uses Supabase for profile data and real-time updates.

### Settings (`settings/`)

User configuration and preferences:

- **`account-settings.tsx`**: Account management (email, password)
- **`developer-settings.tsx`**: Developer-specific preferences
- **`preferences-settings.tsx`**: App preferences and notifications
- **`profile-settings.tsx`**: Public profile information
- **`settings-container.tsx`**: Settings page layout wrapper

**Form Handling**: Integrates with user settings API and validation.

### UI Library (`ui/`)

Reusable design system components:

**Form Components**:

- `button.tsx`, `input.tsx`, `textarea.tsx`, `checkbox.tsx`
- `select.tsx`, `switch.tsx`, `label.tsx`
- `TagInput.tsx` - Multi-tag input component

**Layout Components**:

- `card.tsx`, `dialog.tsx`, `drawer.tsx`, `popover.tsx`
- `scroll-area.tsx`, `tabs.tsx`, `divider.tsx`

**Navigation Components**:

- `dropdown-menu.tsx`, `hover-button.tsx`

**Feedback Components**:

- `avatar.tsx`, `UserAvatar.tsx`, `badge.tsx`
- `skeleton.tsx`, `PostSkeleton.tsx`, `LoadingSpinner.tsx`
- `sonner.tsx` (Toast notifications), `Tooltip.tsx`

**Specialized Components**:

- `calendar.tsx`, `logo.tsx`, `project-card.tsx`
- `invitation.tsx`

**Design System**: All components use Tailwind CSS with consistent spacing, colors, and typography scales.

## Component Patterns

### State Management

- **Props**: For simple parent-child communication
- **Zustand Stores**: For complex state (auth, feed, sidebar)
- **TanStack Query**: For server state and caching
- **React Hook Form**: For form state and validation

### TypeScript Usage

- All components are fully typed with TypeScript
- Props interfaces defined for each component
- Generic components for reusability
- Strict type checking enabled

### Responsive Design

- Mobile-first approach with Tailwind breakpoints
- Dedicated mobile components where needed
- Progressive enhancement for desktop features

### Accessibility

- Semantic HTML elements
- ARIA attributes for screen readers
- Keyboard navigation support
- Focus management for modals/drawers

## Development Guidelines

### Creating New Components

1. Choose appropriate feature folder or `ui/` for reusable components
2. Use TypeScript with proper prop typing
3. Follow Tailwind CSS patterns for styling
4. Include accessibility attributes
5. Add loading and error states where applicable

### Component Naming

- PascalCase for component files and exports
- Descriptive names that indicate purpose
- Group related components in folders

### Testing Approach

- Components should be testable in isolation
- Use React Testing Library patterns
- Mock external dependencies (Supabase, stores)

### Performance Considerations

- Use React.memo for expensive re-renders
- Lazy load heavy components
- Optimize images with Next.js Image component
- Implement proper loading states

## Key Dependencies

- **React**: UI library with hooks
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives (via ui components)
- **Lucide React**: Icon library
- **React Hook Form**: Form state management
- **TanStack Query**: Server state management

## Common Patterns

- Compound components for complex UI (e.g., Card.Header, Card.Content)
- Render props for flexible component composition
- Custom hooks for component logic extraction
- Context providers for feature-specific state

## Notes for Claude

- This is a comprehensive component library organized by feature domain
- UI components in `/ui` are the foundation - modify these carefully as they're used throughout the app
- Profile components are particularly complex and handle multiple user states
- Dashboard components integrate with analytics data from the backend
- All components should maintain consistency with the established design system
- When adding new components, consider reusability and place in appropriate folder
