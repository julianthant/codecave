# CodeCave Web Application

A collaborative coding platform built with Next.js 15 and Tailwind CSS v4.1.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4.1
- **UI Components**: Radix UI + Custom Components
- **TypeScript**: Full type safety
- **State Management**: TanStack Query
- **Icons**: Lucide React

## 📁 Project Structure

```
apps/web/src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── profile/          # Profile page
│   ├── projects/         # Projects page
│   └── not-found.tsx     # 404 page
├── components/            # Reusable components
│   ├── ui/               # Base UI components (shadcn/ui style)
│   ├── CommentSection.tsx
│   └── VSCodeHighlighter.tsx
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── types/               # TypeScript type definitions
```

## 🛠 Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Getting Started

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Run the development server**:

   ```bash
   pnpm dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## 🎨 Styling

This project uses Tailwind CSS v4.1 with a custom design system:

- **CSS Variables**: Theme colors defined in `globals.css`
- **Components**: UI components in `src/components/ui/`
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Ready for dark mode implementation

## 🧩 Key Features Converted

- ✅ **Home Feed**: Interactive post feed with comments
- ✅ **Profile Pages**: User profiles with stats and projects
- ✅ **Project Gallery**: Grid and list view for projects
- ✅ **Code Highlighting**: VS Code-style syntax highlighting
- ✅ **Comment System**: Nested comments with interactions
- ✅ **Responsive Design**: Works on all device sizes

## 🔧 Configuration

### Tailwind CSS v4.1

The project uses the latest Tailwind CSS with:

- CSS-first configuration
- Custom color palette
- Component variants
- Animation utilities

### TypeScript

Strict TypeScript configuration with:

- Path mapping (`@/*` imports)
- Component prop types
- Utility type definitions

## 📝 Migration Notes

This application was converted from React/Vite to Next.js 15:

1. **Router Migration**: React Router → Next.js App Router
2. **Component Updates**: All components updated for Next.js compatibility
3. **Styling Migration**: Updated to Tailwind CSS v4.1
4. **Build System**: Vite → Next.js build system
5. **File Structure**: Reorganized for Next.js conventions

## 🚀 Deployment

The application is ready for deployment on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Any Node.js hosting platform**

Build command: `pnpm build`
Start command: `pnpm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run type checking and linting
5. Submit a pull request

## 📄 License

[Your License Here]
