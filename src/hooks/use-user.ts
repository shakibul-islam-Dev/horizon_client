'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/api-services';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile(),
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => userApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
}

export function usePublicProfile(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userApi.getPublicProfile(id),
    enabled: !!id,
  });
}
