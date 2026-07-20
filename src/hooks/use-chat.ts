'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '@/lib/api-services';

export function useChat() {
  return useMutation({
    mutationFn: (params: { messages: { role: 'user' | 'assistant'; content: string }[]; conversationId?: string }) =>
      chatApi.sendMessage(params.messages, params.conversationId),
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => chatApi.createConversation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useConversations(page = 1, limit = 20, status: 'active' | 'archived' = 'active') {
  return useQuery({
    queryKey: ['conversations', status, page, limit],
    queryFn: () => chatApi.getConversations(page, limit, status),
    retry: false,
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ['conversations', id],
    queryFn: () => chatApi.getConversation(id),
    enabled: !!id,
  });
}

export function useRenameConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; title: string }) =>
      chatApi.renameConversation(params.id, params.title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chatApi.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useClearConversations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => chatApi.deleteAllConversations(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
