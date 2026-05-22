import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Check } from 'lucide-react';
import api from "../lib/api";
import { Button } from "../components/ui/Button";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "../components/ui/Modal";

interface Task {
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

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Dashboard: Component mounted, fetching tasks');
    const fetchTasks = async () => {
      try {
        console.log('Dashboard: Calling API to fetch tasks');
        const response = await api.get('/tasks');
        console.log('Dashboard: Tasks fetched successfully:', response.data);
        setTasks(response.data);
        setError('');
      } catch (error: any) {
        console.error('Dashboard: Failed to fetch tasks:', error);
        setError(error.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  console.log('Dashboard: Rendering Dashboard, loading:', loading, 'tasks count:', tasks.length, 'error:', error);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleDelete = (taskId: string) => {
    setDeletingTaskId(taskId);
    setShowDeleteConfirm(true);
  };

  const handleMarkComplete = async (task: Task) => {
    try {
      const updatedTask = { ...task, status: 'DONE' };
      // Optimistic update
      setTasks(tasks.map(t => t.taskId === task.taskId ? updatedTask : t));
      
      await api.patch(`/tasks/${task.taskId}`, { status: 'DONE' });
    } catch (error) {
      console.error('Mark complete failed:', error);
      // Rollback
      const fetchTasks = async () => {
        const response = await api.get('/tasks');
        setTasks(response.data);
      };
      fetchTasks();
    }
  };

  const confirmDelete = async () => {
    if (!deletingTaskId) return;
    
    try {
      // Optimistic UI update
      setTasks(tasks.filter(t => t.taskId !== deletingTaskId));
      setShowDeleteConfirm(false);
      
      await api.delete(`/tasks/${deletingTaskId}`);
    } catch (error) {
      console.error('Delete failed:', error);
      // Rollback on error
      const fetchTasks = async () => {
        const response = await api.get('/tasks');
        setTasks(response.data);
      };
      fetchTasks();
    } finally {
      setDeletingTaskId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8 no-transform no-filter">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-500 text-sm">Welcome to Mini-Jira</p>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Tasks</h2>
          <div className="text-sm text-slate-500">
            {loading ? 'Loading...' : `${tasks.length} tasks`}
          </div>
        </div>
        <div className="flex-1 overflow-hidden no-transform no-filter">
          {loading ? (
            <div className="text-center text-slate-500">Loading tasks...</div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tasks.map((task) => (
                <div 
                  key={task.taskId} 
                  className="relative p-6 border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group no-transform no-filter" 
                  onClick={() => handleEdit(task)}
                >
                  <div className="flex justify-between items-start gap-4 mb-4 no-transform no-filter">
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="font-semibold text-slate-900 truncate no-transform no-filter" 
                        style={{
                          lineHeight: '1.5',
                          textDecoration: task.status === 'DONE' ? 'line-through' : 'none',
                          opacity: task.status === 'DONE' ? '0.6' : '1'
                        }}
                      >{task.title}</h3>
                      <span className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-wider rounded no-transform no-filter" style={{
                        backgroundColor: task.status === 'TODO' ? '#dbeafe' : 
                                       task.status === 'IN_PROGRESS' ? '#fef3c7' : 
                                       task.status === 'IN_REVIEW' ? '#dcfce7' : 
                                       task.status === 'DONE' ? '#dcfce7' : '#dbeafe',
                        color: task.status === 'TODO' ? '#1e40af' : 
                               task.status === 'IN_PROGRESS' ? '#92400e' : 
                               task.status === 'IN_REVIEW' ? '#166534' : 
                               task.status === 'DONE' ? '#166534' : '#1e40af',
                        lineHeight: '1.5'
                      }}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkComplete(task);
                        }}
                        className="text-slate-400 hover:text-green-600 transition-colors p-1 opacity-0 group-hover:opacity-100"
                        title="Mark complete"
                        disabled={task.status === 'DONE'}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(task);
                        }}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                        title="Edit task"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(task.taskId);
                        }}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1 opacity-0 group-hover:opacity-100"
                        title="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit Task</ModalTitle>
          </ModalHeader>
          <div className="p-16">
            <div className="space-y-16">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-4">Title</label>
                <input
                  type="text"
                  defaultValue={editingTask?.title}
                  className="w-full px-12 py-8 border border-slate-200 rounded-8"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-4">Status</label>
                <select
                  defaultValue={editingTask?.status}
                  className="w-full px-12 py-8 border border-slate-200 rounded-8"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-8 mt-16">
              <Button onClick={() => setEditingTask(null)} variant="secondary">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Task</ModalTitle>
          </ModalHeader>
          <div className="p-16">
            <p className="text-slate-600 mb-16">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex justify-end gap-8">
              <Button onClick={() => setShowDeleteConfirm(false)} variant="secondary">Cancel</Button>
              <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
