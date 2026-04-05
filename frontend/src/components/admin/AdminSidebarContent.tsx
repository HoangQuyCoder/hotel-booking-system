import { Link, useLocation } from "react-router-dom";
import { LogOut, Shield, ChevronRight, HomeIcon } from "lucide-react";
import { adminNavItems, type NavItem } from "./adminNavItems";
import { useAuth } from "../../hooks/useAuth";

interface AdminSidebarContentProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebarContent({
  isCollapsed,
  isMobileOpen,
  onMobileClose,
}: AdminSidebarContentProps) {
  const location = useLocation();
  const { logoutWithRedirect } = useAuth();

  const isActive = (path: string): boolean => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/50">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {(!isCollapsed || isMobileOpen) && (
          <div className="min-w-0 flex flex-col">
            <span className="text-white font-bold text-sm leading-none">
              Admin Panel
            </span>
            <span className="text-slate-400 text-xs mt-0.5">
              Hotel Management
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {adminNavItems.map((item: NavItem) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={`no-underline flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                  active
                    ? "text-white"
                    : "text-slate-400 group-hover:text-indigo-400"
                }`}
              />

              {(!isCollapsed || isMobileOpen) && (
                <>
                  <span className="text-sm font-medium flex-1 truncate">
                    {item.label}
                  </span>
                  {active && (
                    <ChevronRight className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                  )}
                </>
              )}

              {/* Tooltip when collapsed */}
              {isCollapsed && !isMobileOpen && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-4 border-t border-slate-700/50 space-y-1">
        <Link
          to="/"
          className="no-underline flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all"
        >
          <HomeIcon className="w-5 h-5 flex-shrink-0" />
          {(!isCollapsed || isMobileOpen) && (
            <span className="text-sm font-medium">Home</span>
          )}
        </Link>

        <button
          onClick={logoutWithRedirect}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(!isCollapsed || isMobileOpen) && (
            <span className="text-sm font-medium">Log out</span>
          )}
        </button>
      </div>
    </div>
  );
}
