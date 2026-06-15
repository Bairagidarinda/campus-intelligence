"use client";

import { BookCard } from "@/components/tools/BookCard";
import { MenuCard } from "@/components/tools/MenuCard";
import { EventCard } from "@/components/tools/EventCard";
import { CourseCard } from "@/components/tools/CourseCard";

interface ToolCallRendererProps {
  part?: any;
  invocation?: any;
}

export function ToolCallRenderer({ part, invocation }: ToolCallRendererProps) {
  // Handle both message.parts format and message.toolInvocations format
  let toolName: string;
  let state: string;
  let output: any;
  let error: string = "";

  if (part) {
    // New format: message.parts with type "tool-invocation"
    const ti = part.toolInvocation;
    toolName = ti.toolName;
    if (ti.state === "partial-call") {
      state = "input-streaming";
    } else if (ti.state === "call") {
      state = "input-available";
    } else if (ti.state === "result") {
      state = "output-available";
    } else {
      state = "input-available";
    }
    output = ti.result || {};
    error = ti.error || "";
  } else if (invocation) {
    // Legacy format: message.toolInvocations
    toolName = invocation.toolName;
    state = invocation.state === "result" ? "output-available" : "input-available";
    output = invocation.result || {};
    error = invocation.error || "";
  } else {
    return null;
  }

  if (state === "input-streaming" || state === "input-available") {
    return (
      <div className="mt-2 rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        Running <code className="font-semibold">{toolName}</code>...
      </div>
    );
  }

  if (state === "output-error" || (error && error !== "")) {
    return (
      <div className="mt-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
        Error running <code>{toolName}</code>: {error}
      </div>
    );
  }

  if (state === "output-available" || invocation?.state === "result") {
    if (toolName.startsWith("library_")) {
      return <BookCard toolName={toolName} data={output} />;
    }
    if (toolName.startsWith("cafeteria_")) {
      return <MenuCard toolName={toolName} data={output} />;
    }
    if (toolName.startsWith("events_")) {
      return <EventCard toolName={toolName} data={output} />;
    }
    if (toolName.startsWith("academics_")) {
      return <CourseCard toolName={toolName} data={output} />;
    }
    return (
      <div className="mt-2 rounded-md border bg-muted px-3 py-2 text-xs">
        <code>{toolName}</code> result: {JSON.stringify(output, null, 2)}
      </div>
    );
  }

  return null;
}
