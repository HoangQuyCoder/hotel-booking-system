import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Mail,
  Smartphone,
  Info,
} from "lucide-react";
import { useNotificationApi } from "../../hooks/useNotificationApi";
import { Pagination } from "../../components/ui/Pagination";
import { NotificationStatus } from "../../types/enum";
import { useDebounce } from "../../hooks/useDebounce";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminFilterBar } from "../../components/admin/AdminFilterBar";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminStatusBadge } from "../../components/admin/AdminStatusBadge";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";

export default function AdminNotifications() {
  const { useAllLogs } = useNotificationApi();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: logsData, isLoading } = useAllLogs({
    page,
    size,
    keyword: debouncedSearch,
    status: (statusFilter as any) || undefined,
  });

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: any }
  > = {
    PENDING: {
      label: "Pending",
      color: "bg-amber-50 text-amber-600 border-amber-200",
      icon: Clock,
    },
    SENT: {
      label: "Sent",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: CheckCircle2,
    },
    FAILED: {
      label: "Failed",
      color: "bg-red-50 text-red-500 border-red-200",
      icon: XCircle,
    },
    RETRYING: {
      label: "Retrying",
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
      icon: RefreshCw,
    },
  };

  const filterOptions = Object.values(NotificationStatus).map((status) => ({
    value: status,
    label: statusConfig[status]?.label || status,
  }));

  const typeIcons: Record<string, any> = {
    EMAIL: Mail,
    SMS: Smartphone,
    PUSH: Info,
  };

  const columns = [
    { label: "Recipient" },
    { label: "Type" },
    { label: "Content" },
    { label: "Status" },
    { label: "Sent At" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Notification Logs"
        description="Monitor all outbound Email, SMS & Push notifications"
        icon={Bell}
      />

      <AdminFilterBar
        searchPlaceHolder="Search by recipient email..."
        searchValue={search}
        onSearchChange={setSearch}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
        options={filterOptions}
        statusLabel="All statuses"
      />

      <AdminTable
        columns={columns}
        isLoading={isLoading}
        isEmpty={!logsData?.content?.length}
        emptyState={
          <AdminEmptyState
            icon={Bell}
            message="No notification logs found"
            subMessage="Try adjusting your filters or search term"
          />
        }
      >
        {logsData?.content?.map((log: any) => {
          const status = statusConfig[log.status] || {
            label: log.status,
            color: "bg-gray-100 text-gray-500 border-gray-200",
            icon: Clock,
          };
          const StatusIcon = status.icon;
          const TypeIcon = typeIcons[log.type] || Info;
          return (
            <tr
              key={log.id}
              className="hover:bg-gray-50 transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <p className="text-gray-800 text-sm font-semibold">
                    {log.recipientEmail || log.recipientPhone || "N/A"}
                  </p>
                  <p className="text-gray-400 text-[11px] font-mono mt-0.5">
                    User: {log.userId?.substring(0, 8) || "GUEST"}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 w-fit px-2.5 py-1.5 rounded-lg border border-indigo-100">
                  <TypeIcon className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {log.type}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="max-w-xs xl:max-w-md">
                  <p className="text-gray-800 text-sm font-semibold truncate mb-0.5">
                    {log.subject || "No Subject"}
                  </p>
                  <p className="text-gray-400 text-[11px] truncate italic group-hover:text-gray-500 transition-colors">
                    "{log.content}"
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <AdminStatusBadge
                  label={status.label}
                  icon={StatusIcon}
                  colorClass={status.color}
                  className={log.status === "RETRYING" ? "animate-pulse" : ""}
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <p className="text-gray-700 text-xs font-semibold">
                    {new Date(log.sentAt || log.createdAt).toLocaleDateString(
                      "en-US",
                    )}
                  </p>
                  <p className="text-gray-400 text-[11px]">
                    {new Date(log.sentAt || log.createdAt).toLocaleTimeString(
                      "en-US",
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </p>
                </div>
                {log.errorMessage && (
                  <p
                    className="text-red-400 text-[10px] mt-1 max-w-[150px] truncate font-medium bg-red-50 px-2 py-0.5 rounded border border-red-100"
                    title={log.errorMessage}
                  >
                    Error: {log.errorMessage}
                  </p>
                )}
              </td>
            </tr>
          );
        })}
      </AdminTable>

      {logsData && logsData.totalPages > 1 && (
        <div className="mt-6 flex justify-center pb-8">
          <Pagination
            currentPage={page}
            totalPages={logsData.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
