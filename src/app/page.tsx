import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default function HomePage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0e1a] text-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-hidden p-4">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
