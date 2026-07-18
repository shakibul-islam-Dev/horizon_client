import Link from 'next/link';
import { SearchX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
          <SearchX className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="text-xl font-semibold text-foreground">Page not found</h2>
        <p className="text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
