import { BookOpen, Utensils, CalendarDays, GraduationCap, MessageSquare, Activity, Zap, Server, Wifi } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-slate-800/50 bg-[#0f1629]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800/50 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-100">Campus Intelligence</h1>
          <p className="text-[10px] text-slate-400">Unified AI Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3 rounded-xl bg-blue-500/10 px-3 py-2.5 text-sm font-medium text-blue-400 ring-1 ring-blue-500/20">
            <MessageSquare className="h-4 w-4" />
            AI Chat
          </div>
        </div>

        {/* Live Stats */}
        <div className="mt-6">
          <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Live Stats
          </div>
          <div className="space-y-2">
            <div className="group rounded-xl bg-slate-800/50 p-3 transition-colors hover:bg-slate-800/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20">
                    <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <span className="text-xs text-slate-300">Books</span>
                </div>
                <span className="text-sm font-bold text-blue-400">2,847</span>
              </div>
            </div>
            <div className="group rounded-xl bg-slate-800/50 p-3 transition-colors hover:bg-slate-800/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/20">
                    <Utensils className="h-3.5 w-3.5 text-orange-400" />
                  </div>
                  <span className="text-xs text-slate-300">Today's Special</span>
                </div>
                <span className="text-xs font-bold text-orange-400">Paneer Tikka</span>
              </div>
            </div>
            <div className="group rounded-xl bg-slate-800/50 p-3 transition-colors hover:bg-slate-800/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20">
                    <CalendarDays className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                  <span className="text-xs text-slate-300">Events</span>
                </div>
                <span className="text-sm font-bold text-purple-400">12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mt-6">
          <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Data Sources
          </div>
          <div className="space-y-1">
            {[
              { name: "Library", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/20", server: "localhost:8001" },
              { name: "Cafeteria", icon: Utensils, color: "text-orange-400", bg: "bg-orange-500/20", server: "localhost:8002" },
              { name: "Events", icon: CalendarDays, color: "text-purple-400", bg: "bg-purple-500/20", server: "localhost:8003" },
              { name: "Academics", icon: GraduationCap, color: "text-amber-400", bg: "bg-amber-500/20", server: "localhost:8004" },
            ].map((source) => (
              <div
                key={source.name}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-slate-400 transition-colors hover:bg-slate-800/50"
              >
                <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${source.bg}`}>
                  <source.icon className={`h-3 w-3 ${source.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-slate-300">{source.name}</div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Wifi className="h-2.5 w-2.5 text-green-400" />
                    {source.server}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800/50 p-4">
        <div className="flex items-center gap-2 rounded-xl bg-slate-800/50 p-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
            <Zap className="h-3 w-3 text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-medium text-slate-300">Groq LLM</p>
            <p className="text-[10px] text-slate-500">llama-3.3-70b-versatile</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
