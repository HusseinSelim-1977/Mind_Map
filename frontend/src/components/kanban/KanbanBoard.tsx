import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  closestCorners,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "../ui/Modal";
import { TaskForm } from "../tasks/TaskForm";
import { TaskDetail } from "../tasks/TaskDetail";
import api from "../../lib/api";

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: TaskStatus;
  assignee?: {
    name: string;
    avatar?: string;
  };
}

interface Column {
  id: TaskStatus;
  title: string;
}

const COLUMNS: Column[] = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'IN_REVIEW', title: 'In Review' },
  { id: 'DONE', title: 'Done' },
];

interface BackendTask {
  taskId: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigneeId?: string;
  teamId?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

interface KanbanBoardProps {
  tasks?: BackendTask[];
}

function convertToKanbanTask(backendTask: BackendTask): Task {
  return {
    id: backendTask.taskId,
    title: backendTask.title,
    description: backendTask.description,
    priority: backendTask.priority.toLowerCase(),
    status: backendTask.status as TaskStatus,
  };
}

export function KanbanBoard({ tasks: backendTasks = [] }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(() => backendTasks.map(convertToKanbanTask));
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    setTasks(backendTasks.map(convertToKanbanTask));
  }, [backendTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          tasks[activeIndex].status = tasks[overIndex].status;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === "Column";
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].status = overId as TaskStatus;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      if (tasks[activeIndex].status !== tasks[overIndex].status) {
        const newStatus = tasks[overIndex].status;
        tasks[activeIndex].status = newStatus;
        
        // Update backend
        api.patch(`/tasks/${activeId}/status`, { status: newStatus }).catch(console.error);
        
        return arrayMove(tasks, activeIndex, overIndex - 1);
      }

      return arrayMove(tasks, activeIndex, overIndex);
    });
  }

  const handleCreateTask = (data: any) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
    };
    setTasks((prev) => [...prev, newTask]);
    setIsFormOpen(false);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  return (
    <div className="flex h-full flex-col gap-16">
      <div className="flex justify-end">
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          <Plus className="mr-8 h-16 w-16" />
          Add Task
        </Button>
      </div>

      <div className="flex h-full w-full gap-24 overflow-x-auto pb-24">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <div className="flex gap-24">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={tasks.filter((t) => t.status === col.id)}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>

          {createPortal(
            <DragOverlay>
              {activeTask ? <KanbanCard task={activeTask} /> : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>

      <Modal open={isFormOpen} onOpenChange={setIsFormOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Create New Task</ModalTitle>
          </ModalHeader>
          <TaskForm onSubmit={handleCreateTask} />
        </ModalContent>
      </Modal>

      <Modal open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <ModalContent className="max-w-[640px] p-0 overflow-hidden">
          {selectedTask && (
            <TaskDetail task={selectedTask} onClose={() => setIsDetailOpen(false)} />
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
