import { useState, useEffect } from "react";
import {
  Users,
  Edit,
  Trash2,
  Filter,
  UserPlus,
  UserCheck,
  ShieldOff,
} from "lucide-react";
import { useUserApi } from "../../hooks/useUserApi";
import { useRoleApi } from "../../hooks/useRoleApi";
import { Pagination } from "../../components/ui/Pagination";
import { useDebounce } from "../../hooks/useDebounce";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminFilterBar } from "../../components/admin/AdminFilterBar";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminStatusBadge } from "../../components/admin/AdminStatusBadge";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { UserModal } from "../../components/admin/modal/UserModal";
import type { UserResponse } from "../../types";

export default function AdminUsers() {
  const { useUsers, deleteUser } = useUserApi();
  const { useRoles } = useRoleApi();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 800);
  const [roleFilter, setRoleFilter] = useState<string>("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);

  const { data: rolesData } = useRoles();
  const { data: usersData, isLoading } = useUsers({
    page,
    size,
    keyword: debouncedSearch,
    roleId: roleFilter || undefined,
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, roleFilter]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser.mutateAsync(id);
    }
  };

  const handleEdit = (user: UserResponse) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-50 text-red-600 border-red-200",
    MANAGER: "bg-purple-50 text-purple-600 border-purple-200",
    STAFF: "bg-blue-50 text-blue-600 border-blue-200",
    CLIENT: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  const filterOptions =
    rolesData?.map((role: any) => ({
      value: role.id.toString(),
      label: role.roleName,
    })) || [];

  const columns = [
    { label: "User" },
    { label: "Contact" },
    { label: "Role" },
    { label: "Status" },
    { label: "Actions", className: "text-right" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="User Management"
        description="Manage all user accounts in the system"
        icon={Users}
      />

      <AdminFilterBar
        searchPlaceHolder="Search by name, email, phone..."
        searchValue={search}
        onSearchChange={setSearch}
        statusValue={roleFilter}
        onStatusChange={setRoleFilter}
        options={filterOptions}
        filterIcon={Filter}
        statusLabel="All roles"
        onActionClick={handleAddUser}
        actionLabel="New User"
        actionIcon={UserPlus}
      />

      <AdminTable
        columns={columns}
        isLoading={isLoading}
        isEmpty={!usersData?.content?.length}
        emptyState={
          <AdminEmptyState
            icon={Users}
            message="No users found"
            subMessage="Try adjusting your filters or search term"
          />
        }
      >
        {usersData?.content?.map((user: UserResponse) => (
          <tr
            key={user.id}
            className="hover:bg-gray-50 transition-colors group"
          >
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold overflow-hidden border border-gray-200 group-hover:border-indigo-300 transition-colors flex-shrink-0">
                  {user.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.firstName?.charAt(0) || "U"
                  )}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-gray-400 text-[11px] font-mono mt-0.5">
                    ID: {user.id.substring(0, 12)}...
                  </p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <p className="text-gray-800 text-sm font-medium">{user.email}</p>
              <p className="text-gray-400 text-xs mt-0.5">
                {user.phoneNumber || "—"}
              </p>
            </td>
            <td className="px-6 py-4">
              <span
                className={`text-[11px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide border ${
                  roleColors[user.roleName] ||
                  "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                {user.roleName}
              </span>
            </td>
            <td className="px-6 py-4">
              <AdminStatusBadge
                label={user.status === "ACTIVE" ? "Active" : "Suspended"}
                icon={user.status === "ACTIVE" ? UserCheck : ShieldOff}
                colorClass={
                  user.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "bg-red-50 text-red-500 border-red-200"
                }
              />
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => handleEdit(user)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      {usersData && usersData.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={usersData.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* User Management Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
      />
    </div>
  );
}
