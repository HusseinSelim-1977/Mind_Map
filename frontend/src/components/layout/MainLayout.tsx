import { Outlet } from "react-router-dom";
import { Sidebar, Topbar } from "./Navigation";

export default function MainLayout() {
  return (
    <div className="min-h-screen ml-64">
      <Topbar />
      <main className="flex-1 overflow-y-auto bg-slate-50/30 p-32">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
