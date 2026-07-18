'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi } from '@/lib/api-services';

export function useItems(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => itemsApi.getAll(params),
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => itemsApi.getById(id),
    enabled: !!id,
  });
}

export function useMyListings(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['items', 'my-listings', page, limit],
    queryFn: () => itemsApi.getMyListings(page, limit),
    retry: false,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => itemsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: itemsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}
