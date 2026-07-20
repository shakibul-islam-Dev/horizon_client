'use client';

import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 text-6xl opacity-30">⚠️</div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error.message || 'We could not load this page. Please try again.'}
      </p>
      <Button onClick={reset} variant="default">
        Try Again
      </Button>
    </div>
  );
}
