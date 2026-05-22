import { Clock, User, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  metadata?: string;
}

export function AuditLog({ entries }: { entries: AuditEntry[] }) {
  return (
    <div className="flex flex-col gap-16">
      <div className="flex items-center gap-8 text-sm font-semibold text-slate-700">
        <Clock className="h-16 w-16" />
        Activity History
      </div>
      <div className="relative space-y-24 before:absolute before:left-16 before:top-8 before:h-[calc(100%-16px)] before:w-1 before:bg-slate-100">
        {entries.map((entry) => (
          <div key={entry.id} className="relative pl-40">
            <div className="absolute left-10 top-4 h-12 w-12 rounded-full border-2 border-white bg-slate-900 shadow-sm" />
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-8">
                <span className="text-sm font-semibold text-slate-900">{entry.user}</span>
                <span className="text-xs text-slate-400">{entry.timestamp}</span>
              </div>
              <p className="text-sm text-slate-600">
                {entry.action}
                {entry.metadata && (
                  <span className="ml-8 font-medium text-slate-900">{entry.metadata}</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
