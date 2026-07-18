import { api } from '@/lib/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendChatMessage(
  messages: ChatMessage[]
): Promise<{ success: boolean; data: { reply: string } | null; error: string | null }> {
  const res = await api.post<{ reply: string }>('/ai/chat', { messages });
  if (res.success && res.data) {
    return { success: true, data: res.data, error: null };
  }
  return { success: false, data: null, error: res.message || 'Failed to get response' };
}
