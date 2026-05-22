import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./types";
import { cn } from "../../lib/utils";
import { Badge, Avatar } from "../ui/Misc";

interface KanbanCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

export function KanbanCard({ task, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick?.(task)}
      className={cn(
        "group relative flex flex-col gap-12 rounded-12 border border-slate-200 bg-white p-16 shadow-sm transition-normal hover:shadow-md cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 border-slate-300 shadow-lg"
      )}
    >
      <div className="flex items-center justify-between gap-8">
        <Badge
          className={cn("px-8 py-2 text-[10px]", priorityColors[task.priority])}
        >
          {task.priority}
        </Badge>
      </div>
      <h4 className="text-sm font-semibold text-slate-900 leading-snug">
        {task.title}
      </h4>
      {task.description && (
        <p className="line-clamp-2 text-xs text-slate-500 leading-relaxed">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between mt-4">
        {task.assignee && (
          <Avatar
            fallback={task.assignee.name}
            src={task.assignee.avatar}
            className="h-24 w-24 text-[10px]"
          />
        )}
      </div>
    </div>
  );
}
