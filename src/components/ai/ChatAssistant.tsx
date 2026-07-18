'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, Trash2, AlertTriangle } from 'lucide-react';
import { sendChatMessage, type ChatMessage } from '@/services/chat';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MAX_MESSAGES = 50;

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I am Horizon AI assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setError(false);
    const userMsg: Message = {
      id: `user-${crypto.randomUUID()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const chatHistory: ChatMessage[] = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));
      chatHistory.push({ role: 'user', content: text });

      const res = await sendChatMessage(chatHistory);
      if (res.success && res.data) {
        const aiMsg: Message = {
          id: `ai-${crypto.randomUUID()}`,
          role: 'assistant',
          content: res.data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hi! I am Horizon AI assistant. How can I help you today?',
        timestamp: new Date(),
      },
    ]);
    setError(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px] bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Horizon AI</h3>
            <p className="text-xs text-success">Online</p>
          </div>
        </div>
        {messages.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            title="Clear chat"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">Horizon AI</span>
                  </div>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary/10 text-foreground rounded-bl-md'
                  }`}
                >
                  {msg.content.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={i} className="font-semibold my-1">{line.replace(/\*\*/g, '')}</p>;
                    }
                    if (line.startsWith('- **')) {
                      const cleaned = line.replace(/^- /, '').replace(/\*\*/g, '');
                      return <p key={i} className="ml-2 my-0.5">&bull; {cleaned}</p>;
                    }
                    if (line.match(/^\d+\. /)) {
                      const cleaned = line.replace(/\*\*/g, '');
                      return <p key={i} className="ml-2 my-0.5">{cleaned}</p>;
                    }
                    return <p key={i} className={line === '' ? 'h-2' : ''}>{line.replace(/\*\*/g, '')}</p>;
                  })}
                </div>
                <p className={`text-[10px] text-muted-foreground/50 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {error && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Failed to get response.
                <button onClick={() => { setError(false); sendMessage(inputValue || messages[messages.length - 1]?.content || ''); }} className="font-medium underline">
                  Retry
                </button>
              </div>
            </div>
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">Horizon AI</span>
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-secondary/10">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {messages.length <= 3 && !error && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {['Recommend products', 'How to sell?', 'Return policy'].map((suggestion) => (
              <Badge
                key={suggestion}
                variant="outline"
                className="cursor-pointer hover:border-primary hover:text-primary transition-colors"
                onClick={() => sendMessage(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-3 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputValue);
          }}
          className="flex gap-2"
        >
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isTyping}
            className="flex-1 min-h-0 resize-none"
            rows={1}
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        {messages.length >= MAX_MESSAGES && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Maximum messages reached.{' '}
            <button onClick={handleClearChat} className="text-primary hover:underline">
              Clear chat
            </button>{' '}
            to continue.
          </p>
        )}
      </div>
    </div>
  );
}
