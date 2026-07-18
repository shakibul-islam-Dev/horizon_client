'use client';

import { useQuery } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api-services';

export function useAbout() {
  return useQuery({
    queryKey: ['about'],
    queryFn: () => aboutApi.get(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
