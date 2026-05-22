import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import api from "../../lib/api";

interface SearchResult {
  taskId: string;
  title: string;
  status: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        try {
          const response = await api.get(`/tasks?search=${encodeURIComponent(query)}`);
          setResults(response.data);
          setShowResults(true);
        } catch (error) {
          console.error('Search failed:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showResults) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        navigate(`/tasks/${results[selectedIndex].taskId}`);
        setShowResults(false);
        setQuery('');
      } else if (e.key === 'Escape') {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showResults, results, selectedIndex, navigate]);

  const handleResultClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
    setShowResults(false);
    setQuery('');
  };

  return (
    <div className="relative flex w-full max-w-md items-center group">
      <Search className="absolute left-12 h-16 w-16 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        placeholder="Search tasks... (Cmd+K)"
        className="w-full rounded-8 bg-slate-50 py-8 pl-36 pr-12 text-sm transition-normal border border-transparent focus:bg-white focus:border-slate-200 focus:outline-none focus:shadow-focus"
      />
      {showResults && (
        <div className="absolute top-full left-0 mt-8 w-full rounded-12 border border-slate-100 bg-white p-8 shadow-xl z-popover">
          <div className="flex flex-col gap-4">
            <p className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {loading ? 'Searching...' : `Results (${results.length})`}
            </p>
            {results.length === 0 && query.length > 2 ? (
              <div className="rounded-8 p-8 text-sm text-slate-600">
                No tasks found for "<span className="font-semibold text-slate-900">{query}</span>"
              </div>
            ) : (
              results.map((result, index) => (
                <div
                  key={result.taskId}
                  onClick={() => handleResultClick(result.taskId)}
                  className={cn(
                    "rounded-8 p-8 text-sm cursor-pointer transition-colors",
                    index === selectedIndex ? "bg-slate-100" : "hover:bg-slate-50"
                  )}
                >
                  <div className="font-semibold text-slate-900">{result.title}</div>
                  <div className="text-xs text-slate-500">{result.status}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
