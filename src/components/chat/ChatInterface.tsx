"use client";

import { useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { StreamingIndicator } from "./StreamingIndicator";

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, setInput, status, stop } =
    useChat({
      api: "/api/chat",
    });

  const isLoading = status === "submitted" || status === "streaming";
  
  // Prevent duplicate submissions
  const lastSubmittedRef = useRef("");
  const safeHandleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (isLoading) return;
    if (input.trim() === lastSubmittedRef.current) return;
    lastSubmittedRef.current = input.trim();
    handleSubmit(e);
  };
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or status changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800/60 bg-[#111827] shadow-2xl">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-800/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#111827]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Campus AI</h2>
            <p className="text-[10px] text-slate-400">Ask about books, food, events, or academics</p>
          </div>
        </div>
        {isLoading && <StreamingIndicator />}
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 scroll-smooth"
        style={{ scrollBehavior: "smooth" }}
      >
        <MessageList messages={messages} status={status} onSuggestionClick={setInput} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-800/50 px-5 py-4">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={safeHandleSubmit}
          isLoading={isLoading}
          stop={stop}
        />
      </div>
    </div>
  );
}
