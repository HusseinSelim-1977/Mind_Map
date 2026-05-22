import { useState } from "react";
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
import { COLUMNS, Task, TaskStatus } from "./types";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "../ui/Modal";
import { TaskForm } from "../tasks/TaskForm";
import { TaskDetail } from "../tasks/TaskDetail";

const MOCK_TASKS: Task[] = [
  { id: "1", title: "Implement Auth", description: "Login/Signup with JWT", priority: "high", status: "TODO" },
  { id: "2", title: "Design System", description: "Tokens and primitives", priority: "medium", status: "IN_PROGRESS" },
  { id: "3", title: "Kanban Board", description: "D&D with dnd-kit", priority: "high", status: "IN_PROGRESS" },
  { id: "4", title: "API Mocks", description: "MSW setup", priority: "low", status: "TODO" },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  function onDragEnd(event: DragEndEvent) {
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
        tasks[activeIndex].status = tasks[overIndex].status;
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
