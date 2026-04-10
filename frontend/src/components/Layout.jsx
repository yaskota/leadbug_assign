import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, FileText, Send, LogOut } from "lucide-react";

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Templates", path: "/templates", icon: <FileText size={20} /> },
    { name: "Send Campaign", path: "/campaigns/new", icon: <Send size={20} /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 pt-6">
      <div className="px-6 mb-8 text-2xl font-bold text-brand-600 tracking-tight">Leadbug 🚀</div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg w-full font-medium transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export const Layout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <Outlet />
      </div>
    </div>
  );
};
