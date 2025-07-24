import Link from "next/link";

// Server Component - No client-side JavaScript needed for 404 pages
export default function NotFound() {
  return (
    <div className="flex justify-center items-center bg-background min-h-screen">
      <div className="text-center">
        <h1 className="mb-4 font-bold text-foreground text-4xl">404</h1>
        <p className="mb-4 text-muted-foreground text-xl">
          Oops! Page not found
        </p>
        <Link
          href="/"
          className="text-primary hover:text-primary/80 underline transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
