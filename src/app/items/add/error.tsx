'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="text-muted-foreground">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/50">Error ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
