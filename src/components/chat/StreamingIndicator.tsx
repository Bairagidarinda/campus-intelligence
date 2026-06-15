import { Loader2, Zap } from "lucide-react";

export function StreamingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-full bg-slate-800/50 px-3 py-1.5 text-xs text-slate-400">
      <Zap className="h-3 w-3 animate-pulse text-amber-400" />
      <span>Campus AI is thinking...</span>
    </div>
  );
}
