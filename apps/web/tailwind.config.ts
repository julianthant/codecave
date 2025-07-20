import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode using class names
  theme: {
    extend: {
      colors: {
        // Base44-inspired colors using CSS custom properties
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        accent: 'hsl(var(--accent))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: 'hsl(var(--surface))',
        'surface-variant': 'hsl(var(--surface-variant))',
        muted: 'hsl(var(--muted))',
        subtle: 'hsl(var(--subtle))',
        border: 'hsl(var(--border))',
        'border-variant': 'hsl(var(--border-variant))',
        
        // Code syntax colors
        'code-keyword': 'hsl(var(--code-keyword))',
        'code-string': 'hsl(var(--code-string))',
        'code-comment': 'hsl(var(--code-comment))',
        'code-function': 'hsl(var(--code-function))',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'Consolas', 'monospace'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        primary: '0 4px 20px hsl(var(--shadow-primary) / 0.3)',
        'primary-lg': '0 8px 40px hsl(var(--shadow-primary) / 0.4)',
      },
    },
  },
  plugins: [],
};

export default config; 