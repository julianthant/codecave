import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Optimized font loading with display: swap for better performance
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

// Enhanced metadata for SEO
export const metadata: Metadata = {
  title: {
    default: "CodeCave - Where Developers Build Together",
    template: "%s | CodeCave",
  },
  description: "The focused platform for project creators and vibecoders. Showcase your work, find collaborators, and build the future together.",
  keywords: [
    "developers",
    "programming",
    "collaboration",
    "projects",
    "coding community",
    "software development",
    "open source",
    "tech projects",
  ],
  authors: [{ name: "CodeCave Team" }],
  creator: "CodeCave",
  publisher: "CodeCave",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "CodeCave",
    title: "CodeCave - Where Developers Build Together",
    description: "The focused platform for project creators and vibecoders. Showcase your work, find collaborators, and build the future together.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CodeCave - Developer Community Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeCave - Where Developers Build Together",
    description: "The focused platform for project creators and vibecoders. Showcase your work, find collaborators, and build the future together.",
    images: ["/og-image.jpg"],
    creator: "@codecave",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  category: "technology",
};

// Viewport configuration for better mobile experience
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Security headers */}
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
