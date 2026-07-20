'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { reviewsApi } from '@/lib/api-services';

export function useReviews(itemId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ['reviews', itemId, page, limit],
    queryFn: () => reviewsApi.getByItem(itemId, page, limit),
    enabled: !!itemId,
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: { rating: number; comment?: string } }) =>
      reviewsApi.create(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
