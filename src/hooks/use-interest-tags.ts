'use client';

import { useQuery } from '@tanstack/react-query';
import { interestTagsApi } from '@/lib/api-services';

export function useInterestTags() {
  return useQuery({
    queryKey: ['interest-tags'],
    queryFn: () => interestTagsApi.getAll(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
