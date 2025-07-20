# 🌙 Dark Mode Theme System

This project implements a comprehensive dark mode system using `next-themes` with Base44-inspired colors.

## ✨ Features

- **Seamless Theme Switching**: Light, Dark, and System modes
- **Base44-Inspired Colors**: Beautiful orange and blue color palette
- **Flicker-Free**: No flash of incorrect theme on page load
- **Persistent**: Theme preferences saved to localStorage
- **TypeScript**: Full type safety
- **Tailwind Integration**: Works seamlessly with Tailwind CSS

## 🎨 Color Palette

### Light Mode
- **Primary**: Orange `#FF6B35` - CTAs and highlights
- **Secondary**: Soft Blue `#4A90E2` - Complementary elements
- **Accent**: Yellow `#FDD835` - Special highlights
- **Background**: Pure White `#FFFFFF` - Main background
- **Surface**: Light Blue-Gray `#F8FAFC` - Cards and sections

### Dark Mode
- **Primary**: Brighter Orange `#FF7A47` - Enhanced contrast
- **Secondary**: Brighter Blue `#5BA0F2` - Enhanced contrast
- **Accent**: Brighter Yellow `#FFE554` - Enhanced contrast
- **Background**: Dark Slate `#0F172A` - Main background
- **Surface**: Dark Surface `#1E293B` - Cards and sections

## 🚀 Usage

### Theme Toggle Button
```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Simple toggle button
<ThemeToggle />

// With label
<ThemeToggle showLabel />

// Custom styling
<ThemeToggle className="custom-class" />
```

### Theme Dropdown
```tsx
import { ThemeDropdown } from '@/components/ui/theme-toggle';

<ThemeDropdown />
```

### Using Theme Hook
```tsx
import { useTheme } from 'next-themes';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  );
}
```

## 🎯 CSS Custom Properties

All colors are defined as CSS custom properties for seamless theme switching:

```css
:root {
  --primary: 16 100% 60%;      /* Orange */
  --secondary: 212 72% 59%;    /* Blue */
  --background: 0 0% 100%;     /* White */
  --foreground: 222 47% 11%;   /* Dark text */
  /* ... */
}

.dark {
  --primary: 16 100% 65%;      /* Brighter orange */
  --secondary: 212 72% 70%;    /* Brighter blue */
  --background: 222 47% 11%;   /* Dark background */
  --foreground: 210 40% 98%;   /* Light text */
  /* ... */
}
```

## 🔧 Configuration

### Tailwind Config
```ts
// tailwind.config.ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ...
      },
    },
  },
};
```

### Theme Provider Setup
```tsx
// app/layout.tsx
import { ThemeProvider } from '@/components/ui/theme-provider';

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## 🎨 Styling Components

### Using Tailwind Classes
```tsx
// Automatically adapts to theme
<div className="bg-surface text-foreground border border-border">
  <h1 className="text-primary">Title</h1>
  <p className="text-muted">Description</p>
</div>
```

### Dark Mode Variants
```tsx
// Manual dark mode styling if needed
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Light background, dark in dark mode
</div>
```

## 📱 Mobile Support

The theme toggle works perfectly on mobile devices and respects system preferences.

## 🔄 System Theme Detection

The theme system automatically detects and follows the user's system preference when set to "system" mode.

## ✅ Best Practices

1. **Use CSS Custom Properties**: Always use the defined CSS variables for colors
2. **Test Both Themes**: Ensure your components look good in both modes  
3. **Respect User Choice**: Default to "system" to respect user preferences
4. **Smooth Transitions**: Use transitions for theme changes where appropriate
5. **Accessibility**: Ensure sufficient contrast in both themes

## 🎯 Example Component

```tsx
import React from 'react';
import { useTheme } from 'next-themes';

const ExampleCard: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h2 className="text-foreground font-mono text-xl mb-2">
        Card Title
      </h2>
      <p className="text-muted font-mono">
        This card adapts to {theme} theme automatically
      </p>
      <button className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90">
        Primary Action
      </button>
    </div>
  );
};
```

This theme system ensures your entire application maintains visual consistency and user preference respect across all theme modes! 🌟 