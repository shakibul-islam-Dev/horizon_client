"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, AlertTriangle, Trash2 } from "lucide-react";
import { sendChatMessage, type ChatMessage } from "@/services/chat";
import { chatApi } from "@/lib/api-services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const MAX_MESSAGES = 50;
const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hi! I am Horizon AI assistant. How can I help you today?",
  timestamp: new Date(),
};
const STORAGE_KEY = "horizon-chat-conversation";

function loadStoredConversationId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

function storeConversationId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(STORAGE_KEY, id);
  else window.localStorage.removeItem(STORAGE_KEY);
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!window.localStorage.getItem(STORAGE_KEY);
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    const storedId = loadStoredConversationId();
    if (!storedId) return;
    let cancelled = false;

    chatApi
      .getConversation(storedId)
      .then((res) => {
        if (cancelled || !res.success || !res.data) return;
        const conv = res.data as {
          messages: { role: "user" | "assistant"; content: string }[];
        };
        const history: Message[] = conv.messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m, i) => ({
            id: `stored-${i}`,
            role: m.role,
            content: m.content,
            timestamp: new Date(),
          }));
        if (history.length > 0) {
          setMessages(history);
          setConversationId(storedId);
        }
      })
      .catch(() => {
        storeConversationId(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const buildHistory = (): ChatMessage[] => {
    return messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    setError(false);
    const userMsg: Message = {
      id: `user-${crypto.randomUUID()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const chatHistory: ChatMessage[] = buildHistory();
      chatHistory.push({ role: "user", content: text.trim() });

      const res = await sendChatMessage(
        chatHistory,
        conversationId || undefined,
      );
      if (res.success && res.data) {
        const aiMsg: Message = {
          id: `ai-${crypto.randomUUID()}`,
          role: "assistant",
          content: res.data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (res.data.conversationId) {
          setConversationId(res.data.conversationId);
          storeConversationId(res.data.conversationId);
        }
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
    setMessages([WELCOME]);
    setConversationId(null);
    storeConversationId(null);
    setError(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Messages */}
      <div className="py-8 space-y-6">
        {messages.length > 1 && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              title="Clear chat"
              className="h-8 px-2 text-xs text-muted-foreground"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear chat
            </Button>
          </div>
        )}
        {loadingHistory && (
          <div className="flex justify-center">
            <div className="px-4 py-3 rounded-2xl bg-secondary/10 text-sm text-muted-foreground">
              Loading conversation...
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "order-2" : "order-1"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    Horizon AI
                  </span>
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-secondary/20 text-foreground rounded-bl-none"
                }`}
              >
                {msg.content.split("\n").map((line, i) => {
                  if (!line.trim()) return <div key={i} className="h-2" />;
                  return (
                    <p key={i} className="my-0.5">
                      {line}
                    </p>
                  );
                })}
              </div>
              <p
                className={`text-[10px] text-muted-foreground/60 mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}
              >
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {error && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Failed to get response.</span>
              <button
                onClick={() =>
                  sendMessage(messages[messages.length - 1]?.content || "")
                }
                className="font-medium underline hover:text-destructive/80 shrink-0 ml-1"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Horizon AI
                </span>
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-secondary/20">
                <div className="flex gap-1.5 items-center">
                  <span
                    className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Queries */}
      {messages.length <= 3 && !error && !loadingHistory && (
        <div className="pb-4 -mt-2">
          <div className="flex flex-wrap gap-2">
            {["Recommend products", "How to sell?", "Return policy"].map(
              (suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:border-primary hover:text-primary transition-colors text-xs py-1"
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </Badge>
              ),
            )}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="sticky bottom-0 pb-6 bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputValue);
          }}
          className="flex gap-2 items-end rounded-xl border border-border bg-card p-2 shadow-sm"
        >
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isTyping}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(inputValue);
              }
            }}
            className="flex-1 min-h-[44px] max-h-[120px] resize-none rounded-lg border-0 bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="shrink-0 h-10 w-10 rounded-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {messages.length >= MAX_MESSAGES && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Maximum messages reached.{" "}
            <button
              onClick={handleClearChat}
              className="text-primary hover:underline"
            >
              Clear chat
            </button>{" "}
            to continue.
          </p>
        )}
      </div>
    </div>
  );
}
