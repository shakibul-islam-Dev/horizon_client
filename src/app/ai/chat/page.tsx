'use client';

import { MessageCircle } from 'lucide-react';
import ChatAssistant from '@/components/ai/ChatAssistant';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute top-20 right-1/4 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 pt-16 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">AI Chat Assistant</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Get instant help with buying, selling, and more
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 pb-20 flex-1">
        <ChatAssistant />
      </div>
    </div>
  );
}
