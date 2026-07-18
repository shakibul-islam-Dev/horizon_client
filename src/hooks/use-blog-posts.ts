'use client';

import { useQuery } from '@tanstack/react-query';
import { blogPostsApi } from '@/lib/api-services';

export function useBlogPosts(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['blogPosts', params],
    queryFn: () => blogPostsApi.getAll(params),
  });
}
