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
  Plus,
  Edit,
  Trash2,
  FileText,
  ListTodo,
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
import { NotificationTemplateModal } from "../../components/admin/modal/NotificationTemplateModal";
import type {
  NotificationLogResponse,
  NotificationTemplateResponse,
} from "../../types";

type TabType = "LOGS" | "TEMPLATES";

export default function AdminNotifications() {
  const { useAllLogs, useTemplates, deleteTemplate } = useNotificationApi();
  const [activeTab, setActiveTab] = useState<TabType>("LOGS");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<NotificationTemplateResponse | null>(null);

  const { data: logsData, isLoading: isLoadingLogs } = useAllLogs({
    page,
    size,
    keyword: debouncedSearch,
    status: (statusFilter as any) || undefined,
  });

  const { data: templatesData, isLoading: isLoadingTemplates } = useTemplates({
    page,
    size,
    name: debouncedSearch || undefined,
  });

  const handleDeleteTemplate = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      await deleteTemplate.mutateAsync(id);
    }
  };

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

  const logColumns = [
    { label: "Recipient" },
    { label: "Type" },
    { label: "Content" },
    { label: "Status" },
    { label: "Sent At" },
  ];

  const templateColumns = [
    { label: "Template Name" },
    { label: "Type" },
    { label: "Subject Line" },
    { label: "Priority" },
    { label: "Actions", className: "text-right" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Notification Center"
        description="Manage automated templates and monitor outbound logs"
        icon={Bell}
      />

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-2xl w-fit border border-gray-200">
        <button
          onClick={() => {
            setActiveTab("LOGS");
            setPage(0);
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "LOGS"
              ? "bg-white text-indigo-600 shadow-sm border border-gray-100"
              : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
          }`}
        >
          <ListTodo className="w-4 h-4" />
          Outbound Logs
        </button>
        <button
          onClick={() => {
            setActiveTab("TEMPLATES");
            setPage(0);
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "TEMPLATES"
              ? "bg-white text-indigo-600 shadow-sm border border-gray-100"
              : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
          }`}
        >
          <FileText className="w-4 h-4" />
          Content Templates
        </button>
      </div>

      <AdminFilterBar
        searchPlaceHolder={
          activeTab === "LOGS"
            ? "Search by recipient email..."
            : "Search by template name..."
        }
        searchValue={search}
        onSearchChange={setSearch}
        statusValue={activeTab === "LOGS" ? statusFilter : ""}
        onStatusChange={activeTab === "LOGS" ? setStatusFilter : undefined}
        options={activeTab === "LOGS" ? filterOptions : []}
        statusLabel="Filter by status"
        onActionClick={
          activeTab === "TEMPLATES"
            ? () => {
                setEditingTemplate(null);
                setIsModalOpen(true);
              }
            : undefined
        }
        actionLabel="Create Template"
        actionIcon={Plus}
      />

      {activeTab === "LOGS" ? (
        <AdminTable
          columns={logColumns}
          isLoading={isLoadingLogs}
          isEmpty={!logsData?.content?.length}
          emptyState={
            <AdminEmptyState
              icon={Bell}
              message="No notification logs found"
              subMessage="Outbound system messages will appear here"
            />
          }
        >
          {logsData?.content?.map((log: NotificationLogResponse) => {
            const status = statusConfig[log.status] || {
              label: log.status,
              color: "bg-gray-100 text-gray-500 border-gray-200",
              icon: Clock,
            };
            const TypeIcon = typeIcons[log.templateName] || Info;
            return (
              <tr
                key={log.id}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <p className="text-gray-800 text-sm font-semibold">
                      {log.recipient || "N/A"}
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
                      {log.templateName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs xl:max-w-sm">
                    <p className="text-gray-800 text-sm font-semibold truncate mb-0.5">
                      {log.sourceEvent || "No Subject"}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {log.metadata &&
                        Object.entries(log.metadata)
                          .slice(0, 4)
                          .map(([key, value]) => (
                            <span
                              key={key}
                              className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md border border-gray-200"
                            >
                              {key}: {String(value)}
                            </span>
                          ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <AdminStatusBadge
                    label={status.label}
                    icon={status.icon}
                    colorClass={status.color}
                    className={log.status === "RETRYING" ? "animate-pulse" : ""}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-gray-700 text-xs font-semibold">
                      {new Date(
                        log.sentAt || log.createdAt,
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 text-[11px]">
                      {new Date(log.sentAt || log.createdAt).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </p>
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      ) : (
        <AdminTable
          columns={templateColumns}
          isLoading={isLoadingTemplates}
          isEmpty={!templatesData?.content?.length}
          emptyState={
            <AdminEmptyState
              icon={FileText}
              message="No notification templates found"
              subMessage="Create your first template to start automating system messages"
            />
          }
        >
          {templatesData?.content?.map(
            (template: NotificationTemplateResponse) => {
              const TypeIcon = typeIcons[template.type] || Info;
              return (
                <tr
                  key={template.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <p className="text-gray-900 font-bold text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
                      {template.name}
                    </p>
                    <p className="text-gray-400 text-[10px] mt-0.5 font-semibold">
                      Language: {(template as any).defaultLanguage || "en"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sky-600 bg-sky-50 w-fit px-2.5 py-1.5 rounded-lg border border-sky-100">
                      <TypeIcon className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {template.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700 text-sm font-medium truncate max-w-sm">
                      {template.subject}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 font-bold bg-gray-50 px-2 py-1 rounded text-xs border border-gray-100">
                      P{template.priority || 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingTemplate(template);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            },
          )}
        </AdminTable>
      )}

      {/* Pagination */}
      {(activeTab === "LOGS" ? logsData : templatesData)?.totalPages &&
        (activeTab === "LOGS" ? logsData : templatesData)!.totalPages > 1 && (
          <div className="mt-6 flex justify-center pb-8">
            <Pagination
              currentPage={page}
              totalPages={
                (activeTab === "LOGS" ? logsData : templatesData)!.totalPages
              }
              onPageChange={setPage}
            />
          </div>
        )}

      <NotificationTemplateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTemplate(null);
        }}
        template={editingTemplate}
      />
    </div>
  );
}
