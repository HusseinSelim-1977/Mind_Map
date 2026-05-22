import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Bell, 
  LogOut,
  User,
  Settings,
  ChevronDown
} from "lucide-react";
import { cn } from "../../lib/utils";
import { NotificationCenter } from "./NotificationCenter";
import { SearchBar } from "./SearchBar";
import { useAuth } from "../../contexts/AuthContext";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FolderKanban, label: "Projects", path: "/projects" },
  { icon: LayoutDashboard, label: "My Tasks", path: "/dashboard" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
];

export function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 flex-col border-r border-slate-200 bg-[#f8f9fa]">
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
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-12 rounded-8 px-12 py-8 text-sm font-medium text-slate-600 transition-normal hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-18 w-18" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowDropdown(false);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-32 sticky top-0 z-40 shadow-sm">
      <div className="flex-1 max-w-md">
        <SearchBar />
      </div>
      <div className="flex items-center gap-16">
        <NotificationCenter notifications={[]} />
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 cursor-pointer hover:bg-slate-200 transition-colors"
          >
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 min-w-[160px] bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 overflow-hidden">
              <button
                onClick={() => {
                  navigate('/profile');
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Settings
              </button>
              <hr className="my-1 border-slate-200" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-red-600 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
