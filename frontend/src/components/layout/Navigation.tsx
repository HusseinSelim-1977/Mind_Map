import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Bell, 
  LogOut
} from "lucide-react";
import { cn } from "../../lib/utils";
import { NotificationCenter } from "./NotificationCenter";
import { SearchBar } from "./SearchBar";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FolderKanban, label: "Projects", path: "/projects" },
  { icon: Users, label: "Teams", path: "/teams" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-100 bg-white">
      <div className="flex h-16 items-center px-24 border-b border-slate-50">
        <span className="text-xl font-bold tracking-tight text-slate-900">MiniJira</span>
      </div>

      <nav className="flex-1 space-y-4 p-16">
        <div className="flex flex-col gap-4">
          <p className="px-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">Navigation</p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-8 px-12 py-8 text-sm font-medium transition-normal hover:bg-slate-50",
                  isActive ? "bg-slate-900 text-white hover:bg-slate-800" : "text-slate-600"
                )
              }
            >
              <div className="flex items-center gap-12">
                <item.icon className="h-18 w-18" />
                {item.label}
              </div>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-slate-50 p-16">
        <button className="flex w-full items-center gap-12 rounded-8 px-12 py-8 text-sm font-medium text-slate-600 transition-normal hover:bg-red-50 hover:text-red-600">
          <LogOut className="h-18 w-18" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-32 sticky top-0 z-sticky">
      <SearchBar />
      <div className="flex items-center gap-16">
        <NotificationCenter notifications={[]} />
        <div className="h-32 w-32 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
          JD
        </div>
      </div>
    </header>
  );
}
