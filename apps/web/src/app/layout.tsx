import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./globals.css";

// Configure fonts
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

export const metadata: Metadata = {
  title: "codecave - The Developer Community Platform",
  description:
    "The focused platform for project creators and vibecoders. Showcase your work, find collaborators, and build the future together.",
  keywords:
    "developers, projects, collaboration, coding, community, programming",
  authors: [{ name: "codecave" }],
  icons: {
    icon: [
      { url: "/codecave_logo.png" },
      { url: "/codecave_logo.png", sizes: "16x16", type: "image/png" },
      { url: "/codecave_logo.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/codecave_logo.png",
    apple: [
      { url: "/codecave_logo.png" },
      { url: "/codecave_logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "codecave - The Developer Community Platform",
    description:
      "Join the focused developer community for project collaboration",
    type: "website",
    siteName: "codecave",
  },
  twitter: {
    card: "summary_large_image",
    title: "codecave - The Developer Community Platform",
    description: "The focused platform for project creators and vibecoders",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
