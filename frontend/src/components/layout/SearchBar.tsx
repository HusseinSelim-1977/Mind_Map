import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="relative flex w-full max-w-md items-center group">
      <Search className="absolute left-12 h-16 w-16 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search... (Cmd+K)"
        className="w-full rounded-8 bg-slate-50 py-8 pl-36 pr-12 text-sm transition-normal border border-transparent focus:bg-white focus:border-slate-200 focus:outline-none focus:shadow-focus"
      />
      {query && (
        <div className="absolute top-full left-0 mt-8 w-full rounded-12 border border-slate-100 bg-white p-8 shadow-xl z-popover">
          <div className="flex flex-col gap-4">
            <p className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Results</p>
            <div className="rounded-8 p-8 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">
              Searching for: <span className="font-semibold text-slate-900">{query}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
