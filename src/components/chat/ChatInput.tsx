"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Square } from "lucide-react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  stop: () => void;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
}: ChatInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      if (input.trim() && !isLoading) {
        handleSubmit();
      }
    }
  };

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about campus life..."
          className="min-h-[52px] resize-none rounded-xl border-slate-700/50 bg-slate-800/80 px-4 py-3.5 pr-12 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:ring-offset-0"
          rows={1}
        />
      </div>
      {isLoading ? (
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="h-11 w-11 shrink-0 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600"
          onClick={stop}
        >
          <Square className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="submit"
          size="icon"
          className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:from-blue-400 hover:to-blue-500 disabled:opacity-40"
          disabled={!input.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      )}
    </form>
  );
}
