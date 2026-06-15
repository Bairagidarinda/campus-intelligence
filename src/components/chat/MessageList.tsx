"use client";

import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ToolCallRenderer } from "./ToolCallRenderer";
import { Bot, User, Sparkles } from "lucide-react";
import type { UIMessage } from "ai";

interface MessageListProps {
  messages: UIMessage[];
  status: string;
  onSuggestionClick: (text: string) => void;
}

export function MessageList({ messages, status, onSuggestionClick }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <div className="flex flex-col gap-5">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 ring-1 ring-blue-500/30">
            <Sparkles className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-100">
            Welcome to Campus Intelligence
          </h3>
          <p className="mb-8 max-w-md text-sm text-slate-400">
            I can help you find books, check cafeteria menus, discover campus events, and answer academic questions — all in real-time from live data sources.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Is 'Introduction to AI' available?",
              "What's for lunch at Main cafeteria?",
              "Any tech events this weekend?",
              "What is the late assignment policy?",
            ].map((q) => (
                <button
                key={q}
                className="rounded-full bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-slate-700/80 hover:text-slate-100 hover:shadow-lg ring-1 ring-slate-700/50"
                onClick={() => onSuggestionClick(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-4 ${
            message.role === "user" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback
              className={
                message.role === "user"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                  : "bg-gradient-to-br from-slate-700 to-slate-800 text-slate-300"
              }
            >
              {message.role === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>

          <div
            className={`max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-lg ${
              message.role === "user"
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/10"
                : "bg-slate-800/80 text-slate-200 shadow-black/20 ring-1 ring-slate-700/50"
            }`}
          >
            {/* Render using parts (AI SDK 4.x) */}
            {message.parts && message.parts.length > 0 ? (
              message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <div key={index} className="whitespace-pre-wrap">
                      {part.text}
                    </div>
                  );
                }
                if (part.type === "tool-invocation") {
                  return (
                    <ToolCallRenderer key={index} part={part} />
                  );
                }
                return null;
              })
            ) : (
              <>
                {/* Fallback: render using toolInvocations (legacy) */}
                {message.toolInvocations?.map((invocation, index) => (
                  <ToolCallRenderer key={index} invocation={invocation} />
                ))}
                {/* Fallback: plain text content */}
                {message.content && (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}
              </>
            )}
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      {status === "submitted" && messages.length > 0 && messages[messages.length - 1].role === "user" && (
        <div className="flex gap-4">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-slate-300">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="rounded-2xl bg-slate-800/80 px-5 py-3.5 text-sm text-slate-400 shadow-lg ring-1 ring-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: "0ms" }} />
              <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: "150ms" }} />
              <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: "300ms" }} />
              <span className="ml-1 text-xs text-slate-500">AI is thinking...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
