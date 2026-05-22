import { CheckCircle2, Clock, AlertCircle, Users } from "lucide-react";
import { cn } from "../../lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  className?: string;
}

function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("flex flex-col gap-12 rounded-16 border border-slate-100 bg-white p-24 shadow-sm transition-normal hover:shadow-md", className)}>
      <div className="flex items-center justify-between">
        <div className="rounded-12 bg-slate-50 p-12 text-slate-600">{icon}</div>
        {trend && <span className="text-xs font-medium text-green-600">{trend}</span>}
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
}

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-24 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Tasks" value="24" icon={<Clock className="h-20 w-20" />} trend="+4 this week" />
      <StatCard label="Completed" value="12" icon={<CheckCircle2 className="h-20 w-20" />} />
      <StatCard label="High Priority" value="5" icon={<AlertCircle className="h-20 w-20 text-red-500" />} />
      <StatCard label="Active Team" value="8" icon={<Users className="h-20 w-20" />} />
    </div>
  );
}
