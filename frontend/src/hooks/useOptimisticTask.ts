import { useState } from "react";
export function useOptimisticTask(initialTasks: any[]) {
  const [tasks, setTasks] = useState(initialTasks);
  const updateTask = (id: string, status: string) => {
    const prev = [...tasks];
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
    return () => setTasks(prev); // rollback
  };
  return { tasks, updateTask };
}
