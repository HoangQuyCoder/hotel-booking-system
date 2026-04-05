import AdminSidebarContent from "./AdminSidebarContent";

interface AdminSidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({
  isCollapsed,
  isMobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-slate-900 border-r border-slate-700/50 transition-all duration-300 flex-shrink-0 ${
          isCollapsed ? "w-18" : "w-64"
        }`}
      >
        <AdminSidebarContent
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
          onMobileClose={onMobileClose}
        />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-700/50 z-50 lg:hidden transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebarContent
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
          onMobileClose={onMobileClose}
        />
      </aside>
    </>
  );
}
