'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Plus, Trash2, Pencil } from 'lucide-react';
import { useConversations, useDeleteConversation, useRenameConversation } from '@/hooks/use-chat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface ConversationItem {
  id: string;
  title: string;
  lastMessage: string;
  messageCount: number;
  updatedAt: string;
}

function groupByDate(updatedAt: string): string {
  const date = new Date(updatedAt);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(startOfToday.getTime() - 30 * 24 * 60 * 60 * 1000);

  if (date >= startOfToday) return 'Today';
  if (date >= startOfYesterday) return 'Yesterday';
  if (date >= sevenDaysAgo) return 'Last 7 Days';
  if (date >= thirtyDaysAgo) return 'Last 30 Days';
  return 'Older';
}

const GROUP_ORDER = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Older'];

interface ChatSidebarProps {
  activeId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SidebarContent({ activeId, onNavigate }: { activeId?: string; onNavigate?: () => void }) {
  const { data } = useConversations(1, 50, 'active');
  const deleteConversation = useDeleteConversation();
  const renameConversation = useRenameConversation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const conversations = (data?.data as ConversationItem[] | null) ?? [];
  const grouped: Record<string, ConversationItem[]> = {};

  for (const conv of conversations) {
    const group = groupByDate(conv.updatedAt);
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(conv);
  }

  const startRename = (conv: ConversationItem) => {
    setEditingId(conv.id);
    setEditValue(conv.title);
  };

  const commitRename = (id: string) => {
    if (editValue.trim()) {
      renameConversation.mutate({ id, title: editValue.trim() });
    }
    setEditingId(null);
    setEditValue('');
  };

  return (
    <>
      <div className="p-3 border-b border-border shrink-0">
        <Link href="/ai/chat" className="w-full block" onClick={onNavigate}>
          <Button variant="default" className="w-full" size="sm">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </Link>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-4">
          {conversations.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              No conversations yet
            </p>
          )}
          {GROUP_ORDER.map((group) =>
            grouped[group]?.length ? (
              <div key={group}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2">
                  {group}
                </p>
                <div className="space-y-1">
                  {grouped[group].map((conv) => (
                    <div
                      key={conv.id}
                      className={`group flex items-start gap-2 rounded-lg px-2 py-2 cursor-pointer transition-colors ${
                        activeId === conv.id
                          ? 'bg-primary/10'
                          : 'hover:bg-secondary/50'
                      }`}
                    >
                      <Link
                        href={`/ai/chat?c=${conv.id}`}
                        className="flex-1 min-w-0 flex items-start gap-2"
                        onClick={onNavigate}
                      >
                        <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          {editingId === conv.id ? (
                            <input
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={() => commitRename(conv.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') commitRename(conv.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              className="w-full bg-background border border-border rounded px-1 text-sm outline-none"
                            />
                          ) : (
                            <p className="text-sm font-medium text-foreground truncate">
                              {conv.title}
                            </p>
                          )}
                          {conv.lastMessage && (
                            <p className="text-xs text-muted-foreground truncate">
                              {conv.lastMessage}
                            </p>
                          )}
                        </div>
                      </Link>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startRename(conv)}
                          title="Rename"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => deleteConversation.mutate(conv.id)}
                          title="Delete"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </ScrollArea>
    </>
  );
}

export default function ChatSidebar({ activeId, open, onOpenChange }: ChatSidebarProps) {
  return (
    <>
      <aside className="hidden md:flex w-64 shrink-0 border-r border-border bg-card/50 flex-col h-[calc(100vh-280px)] min-h-[500px] rounded-xl overflow-hidden">
        <SidebarContent activeId={activeId} />
      </aside>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" showCloseButton={false} className="w-72 p-0">
          <SheetHeader className="border-b border-border px-4 h-16 flex flex-row items-center justify-between">
            <SheetTitle>Conversations</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-[calc(100dvh-4rem)]">
            <SidebarContent activeId={activeId} onNavigate={() => onOpenChange(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
