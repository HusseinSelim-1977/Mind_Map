import { KanbanBoard } from "../components/kanban/KanbanBoard";
import { StatsGrid } from "../components/dashboard/StatsGrid";
import { Charts } from "../components/dashboard/Charts";
import { ChartPanel } from "../components/dashboard/ChartPanel";

export default function Dashboard() {
  return (
    <div className="flex h-full flex-col gap-32">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Project Overview</h1>
        <p className="text-slate-500 text-sm">Real-time statistics and task management.</p>
      </div>

      <StatsGrid />
      
      <div className="grid grid-cols-1 gap-24 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartPanel />
        </div>
        <Charts />
      </div>
      
      <div className="flex flex-col gap-16 mt-16">
        <h2 className="text-xl font-bold text-slate-900">Task Board</h2>
        <div className="flex-1 overflow-hidden">
          <KanbanBoard />
        </div>
      </div>
    </div>
  );
}
