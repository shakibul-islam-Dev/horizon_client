'use client';

import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '@/lib/api-services';

export function useMyPayments(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['payments', page, limit],
    queryFn: () => paymentsApi.getMyPayments(page, limit),
    retry: false,
  });
}
