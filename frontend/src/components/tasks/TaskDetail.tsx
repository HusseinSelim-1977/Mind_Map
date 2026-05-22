import { Task } from "../kanban/types";
import { Badge, Avatar } from "../ui/Misc";
import { Button } from "../ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { CommentThread } from "./CommentThread";
import { AuditLog } from "./AuditLog";
import { X, Calendar, Clock, Paperclip, MessageSquare, History } from "lucide-react";

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetail({ task, onClose }: TaskDetailProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 p-24">
        <Badge variant={task.status === "DONE" ? "success" : "default"}>
          {task.status.replace("_", " ")}
        </Badge>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="h-20 w-20" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-32 p-24">
          <div className="flex flex-col gap-8">
            <h2 className="text-2xl font-bold text-slate-900">{task.title}</h2>
            <div className="flex flex-wrap gap-16 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <Clock className="h-14 w-14" />
                <span>Created 2 days ago</span>
              </div>
              <div className="flex items-center gap-4">
                <Calendar className="h-14 w-14" />
                <span>Deadline: May 28, 2026</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b border-slate-100 bg-transparent p-0 h-auto gap-24">
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent px-4 pb-12 pt-0 data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="rounded-none border-b-2 border-transparent px-4 pb-12 pt-0 data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Comments
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-none border-b-2 border-transparent px-4 pb-12 pt-0 data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-24 flex flex-col gap-32">
              <div className="flex flex-col gap-12">
                <h3 className="text-sm font-semibold text-slate-700">Description</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {task.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-24 border-y border-slate-50 py-24">
                <div className="flex flex-col gap-8">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Assignee</h3>
                  <div className="flex items-center gap-8">
                    <Avatar fallback={task.assignee?.name || "Unassigned"} />
                    <span className="text-sm font-medium text-slate-700">
                      {task.assignee?.name || "Unassigned"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Priority</h3>
                  <Badge variant={task.priority === "high" ? "danger" : "secondary"}>
                    {task.priority}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-16">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">Attachments</h3>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    <Paperclip className="mr-4 h-12 w-12" />
                    Add
                  </Button>
                </div>
                <div className="rounded-8 border border-dashed border-slate-200 p-24 text-center">
                  <p className="text-xs text-slate-400">No attachments yet.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="pt-24">
              <CommentThread comments={[]} />
            </TabsContent>

            <TabsContent value="history" className="pt-24">
              <AuditLog
                entries={[
                  { id: "1", action: "changed status to", user: "Admin", timestamp: "2 hours ago", metadata: "In Progress" },
                  { id: "2", action: "assigned to", user: "Jane Smith", timestamp: "1 day ago", metadata: "John Doe" },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
