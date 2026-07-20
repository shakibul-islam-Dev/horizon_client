import { chatApi } from '@/lib/api-services';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SendChatResult {
  success: boolean;
  data: { reply: string; conversationId: string; title: string } | null;
  error: string | null;
}

export async function sendChatMessage(
  messages: ChatMessage[],
  conversationId?: string
): Promise<SendChatResult> {
  const res = await chatApi.sendMessage(messages, conversationId);
  if (res.success && res.data) {
    return { success: true, data: res.data, error: null };
  }
  return { success: false, data: null, error: res.message || 'Failed to get response' };
}
