'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonCard() {
  return (
    <div className="h-[420px] rounded-xl border border-border overflow-hidden bg-card">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-auto flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}
