import Index from "@/components/pages/Index";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CodeCave - Share & Discover Code Snippets | Developer Community",
  description:
    "Join CodeCave, the premier platform for developers to share, discover, and collaborate on code snippets. Find solutions, get feedback, and connect with fellow programmers.",
  keywords: [
    "code snippets",
    "programming",
    "developer community",
    "code sharing",
    "JavaScript",
    "Python",
    "TypeScript",
    "React",
    "web development",
    "software engineering",
  ],
  openGraph: {
    title: "CodeCave - Developer Code Sharing Platform",
    description:
      "Share code snippets, discover solutions, and connect with developers worldwide.",
    type: "website",
    locale: "en_US",
    siteName: "CodeCave",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeCave - Share & Discover Code Snippets",
    description:
      "Join the developer community. Share code, find solutions, collaborate.",
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function HomePage() {
  return <Index />;
}
