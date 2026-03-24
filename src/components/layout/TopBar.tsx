import { Bell, Search } from "lucide-react";

export function TopBar({ title, showSearch = false }: { title: string, showSearch?: boolean }) {
  return (
    <div className="sticky top-0 z-40 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5 px-5 py-4">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-black text-gradient tracking-tight">{title}</h1>
        <button className="relative p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-slate-300" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-pink-500 border-2 border-[#0B0F19] rounded-full"></span>
        </button>
      </div>
      {showSearch && (
        <div className="relative mt-4">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="عن ايش تبحث اليوم؟ ✨"
            className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-purple-500/50 focus:bg-slate-800 rounded-2xl text-slate-100 placeholder:text-slate-500 py-3.5 pr-12 pl-4 text-sm transition-all outline-none shadow-inner"
          />
        </div>
      )}
    </div>
  );
}
