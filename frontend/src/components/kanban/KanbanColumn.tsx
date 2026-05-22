import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column, Task } from "./types";
import { KanbanCard } from "./KanbanCard";
import { cn } from "../../lib/utils";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function KanbanColumn({ column, tasks, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div className="flex flex-col gap-16 w-full min-w-[280px] bg-slate-50/50 rounded-16 p-12">
      <div className="flex items-center justify-between px-8">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          {column.title}
          <span className="ml-8 rounded-full bg-slate-200 px-8 py-2 text-[10px] text-slate-500">
            {tasks.length}
          </span>
        </h3>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-12 min-h-[200px] transition-colors"
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
