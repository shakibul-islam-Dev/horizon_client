import { Suspense } from 'react';
import ExploreContent from './ExploreContent';

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Explore Products
            </h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[420px] rounded-xl animate-shimmer" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
