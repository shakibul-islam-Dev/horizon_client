'use client';

import { useMemo, useState } from 'react';
import { MessageCircle, PanelLeft } from 'lucide-react';
import ChatAssistant from '@/components/ai/ChatAssistant';
import ChatSidebar from '@/components/ai/ChatSidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';

function getInitialConversationId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const params = new URLSearchParams(window.location.search);
  const c = params.get('c');
  if (c) {
    window.localStorage.setItem('horizon-chat-conversation', c);
  }
  return c || undefined;
}

export default function ChatPage() {
  const activeId = useMemo(() => getInitialConversationId(), []);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="relative">
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-1/4 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute top-20 right-1/4 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-12 pb-4 sm:pb-6">
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <MessageCircle className="h-5 w-5 text-accent" />
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold text-foreground truncate">AI Chat Assistant</h1>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden shrink-0 h-9 w-9"
                onClick={() => setSidebarOpen(true)}
                title="Open conversations"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl">
            Get instant help with buying, selling, and more
          </p>
        </div>

        <div className="max-w-6xl mx-auto w-full px-2 sm:px-4 pb-24 flex gap-4">
          <ChatSidebar activeId={activeId} open={sidebarOpen} onOpenChange={setSidebarOpen} />
          <div className="flex-1 min-w-0">
            <ChatAssistant />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
