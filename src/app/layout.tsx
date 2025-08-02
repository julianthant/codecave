import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CodeCave - Where Developers Build Together",
    template: "%s | CodeCave",
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  description:
    "The focused platform for project creators and vibecoders. Showcase your work, find collaborators, and build the future together.",
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
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
    description:
      "The focused platform for project creators and vibecoders. Showcase your work, find collaborators, and build the future together.",
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
    description:
      "The focused platform for project creators and vibecoders. Showcase your work, find collaborators, and build the future together.",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Security headers */}
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
