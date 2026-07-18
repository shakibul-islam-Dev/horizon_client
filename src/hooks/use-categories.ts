'use client';

import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api-services';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}
