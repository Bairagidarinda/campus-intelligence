import { Activity, Wifi, Bot } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800/50 bg-[#0f1629]/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Campus AI Assistant</h2>
          <p className="text-[10px] text-slate-400">
            Powered by MCP + Groq — Live data from 4 campus sources
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-slate-800/50 px-3 py-1.5 text-xs text-slate-400">
          <Activity className="h-3 w-3 text-emerald-400" />
          <span className="text-emerald-400">All Systems Online</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Wifi className="h-3 w-3 text-emerald-400" />
          4 MCP Servers Active
        </div>
      </div>
    </header>
  );
}
