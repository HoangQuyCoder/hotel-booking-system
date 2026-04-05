import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { adminNavItems, type NavItem } from "./adminNavItems";
import { useAuth } from "../../hooks/useAuth";

interface AdminHeaderProps {
  isMobileOpen: boolean;
  onToggle: () => void;
}

export default function AdminHeader({
  isMobileOpen,
  onToggle,
}: AdminHeaderProps) {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  const currentItem = adminNavItems.find((item: NavItem) => {
    if (item.path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(item.path);
  });

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Admin"
    : "Admin";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3.5 flex items-center gap-4 flex-shrink-0 z-30 shadow-sm">
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <nav className="text-sm text-gray-400 truncate">
          <span className="text-indigo-600 font-semibold">Admin</span>
          {location.pathname !== "/admin" && currentItem && (
            <>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-gray-700 font-medium">
                {currentItem.label}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden flex-shrink-0">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white animate-spin rounded-full" />
          ) : user?.profilePictureUrl ? (
            <img
              src={user.profilePictureUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            avatarInitial
          )}
        </div>

        {/* Name */}
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">
            {displayName}
          </span>
          {user?.roleName && (
            <span className="text-xs text-gray-400">{user.roleName}</span>
          )}
        </div>
      </div>
    </header>
  );
}
