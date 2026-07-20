'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogPostsApi } from '@/lib/api-services';

export function useBlogPosts(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['blogPosts', params],
    queryFn: () => blogPostsApi.getAll(params),
  });
}

export function useBlogPost(id: string) {
  return useQuery({
    queryKey: ['blogPosts', id],
    queryFn: () => blogPostsApi.getById(id),
    enabled: !!id,
  });
}

export function useBlogPostBySlug(slug: string) {
  return useQuery({
    queryKey: ['blogPosts', 'slug', slug],
    queryFn: () => blogPostsApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useMyBlogPosts(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['blogPosts', 'my', params],
    queryFn: () => blogPostsApi.getMyPosts(params),
    retry: false,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => blogPostsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      blogPostsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogPostsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

export function useLikeBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogPostsApi.like(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}
