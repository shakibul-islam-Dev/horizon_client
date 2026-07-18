'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
    if (!isLoading && user && adminOnly && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, isLoading, router, adminOnly]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) return null;
  if (adminOnly && user.role !== 'admin') return null;

  return <>{children}</>;
}
