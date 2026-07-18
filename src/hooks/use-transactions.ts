'use client';

import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '@/lib/api-services';

export function useMyPurchases(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['transactions', 'purchases', page, limit],
    queryFn: () => transactionsApi.getMyPurchases(page, limit),
    retry: false,
  });
}
