import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function NotificationCenter({ notifications }: { notifications: Notification[] }) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-20 w-20" />
          {unreadCount > 0 && (
            <span className="absolute top-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm border-2 border-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-16 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
          <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase tracking-wider">
            Mark all read
          </Button>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex flex-col gap-4 border-b border-slate-50 p-16 transition-colors hover:bg-slate-50",
                  !n.read && "bg-blue-50/30"
                )}
              >
                <div className="flex items-center justify-between gap-8">
                  <span className="text-sm font-semibold text-slate-900">{n.title}</span>
                  {!n.read && <div className="h-6 w-6 rounded-full bg-blue-600" />}
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{n.message}</p>
                <span className="text-[10px] text-slate-400 mt-4">
                  {new Date(n.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <div className="p-32 text-center">
              <p className="text-sm text-slate-400">No notifications yet.</p>
            </div>
          )}
        </div>
        <div className="border-t border-slate-100 p-8 text-center bg-slate-50/50">
          <Button variant="ghost" size="sm" className="w-full text-xs font-medium text-slate-500">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
