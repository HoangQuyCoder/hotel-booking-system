import { useState } from "react";
import {
  CreditCard,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Receipt,
} from "lucide-react";
import { useTransactionApi } from "../../hooks/useTransactionApi";
import { Pagination } from "../../components/ui/Pagination";
import { TransactionStatus } from "../../types/enum";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminFilterBar } from "../../components/admin/AdminFilterBar";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminStatusBadge } from "../../components/admin/AdminStatusBadge";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";

export default function AdminTransactions() {
  const { useTransactions } = useTransactionApi();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: transactionsData, isLoading } = useTransactions({
    page,
    size,
    status: (statusFilter as TransactionStatus) || undefined,
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
    COMPLETED: {
      label: "Completed",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: CheckCircle2,
    },
    FAILED: {
      label: "Failed",
      color: "bg-red-50 text-red-500 border-red-200",
      icon: XCircle,
    },
    REFUNDED: {
      label: "Refunded",
      color: "bg-purple-50 text-purple-600 border-purple-200",
      icon: ArrowUpRight,
    },
  };

  const filterOptions = Object.values(TransactionStatus).map((status) => ({
    value: status,
    label: statusConfig[status]?.label || status,
  }));

  const columns = [
    { label: "Transaction ID" },
    { label: "Date & Time" },
    { label: "Method" },
    { label: "Amount" },
    { label: "Status" },
    { label: "Details", className: "text-right" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Transaction Management"
        description="Track payment history and refunds"
        icon={CreditCard}
      />

      <AdminFilterBar
        searchPlaceHolder="Search by transaction ID..."
        searchValue={search}
        onSearchChange={setSearch}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
        options={filterOptions}
        filterIcon={Filter}
        statusLabel="All statuses"
      />

      <AdminTable
        columns={columns}
        isLoading={isLoading}
        isEmpty={!transactionsData?.content?.length}
        emptyState={
          <AdminEmptyState
            icon={CreditCard}
            message="No transactions found"
            subMessage="Try adjusting your filters or search term"
          />
        }
      >
        {transactionsData?.content?.map((tx: any) => {
          const status = statusConfig[tx.status] || {
            label: tx.status,
            color: "bg-gray-100 text-gray-500 border-gray-200",
            icon: Clock,
          };
          return (
            <tr
              key={tx.id}
              className="hover:bg-gray-50 transition-colors group"
            >
              <td className="px-6 py-4">
                <p className="text-gray-800 font-mono text-xs uppercase font-bold tracking-widest group-hover:text-indigo-600 transition-colors">
                  #{tx.id.substring(0, 8)}
                </p>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-1 font-semibold">
                  {tx.type}
                </p>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium">
                    {new Date(tx.createdAt).toLocaleDateString("en-US")}
                  </p>
                  <p className="text-gray-400 text-[11px] mt-0.5 font-semibold">
                    {new Date(tx.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-600 text-xs font-semibold uppercase tracking-tight bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                  {tx.paymentMethod?.replace(/_/g, " ")}
                </span>
              </td>
              <td className="px-6 py-4">
                <p
                  className={`font-bold text-sm ${tx.type === "REFUNDED" ? "text-red-500" : "text-emerald-600"}`}
                >
                  {tx.type === "REFUNDED" ? "-" : "+"}
                  {tx.amount?.toLocaleString("en-US")} {tx.currency}
                </p>
              </td>
              <td className="px-6 py-4">
                <AdminStatusBadge
                  label={status.label}
                  icon={status.icon}
                  colorClass={status.color}
                />
              </td>
              <td className="px-6 py-4 text-right">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg transition-all font-semibold text-xs bg-indigo-50 border border-indigo-100 active:scale-95">
                  <Receipt className="w-3.5 h-3.5" />
                  Receipt
                </button>
              </td>
            </tr>
          );
        })}
      </AdminTable>

      {transactionsData && transactionsData.totalPages > 1 && (
        <div className="mt-6 flex justify-center pb-8">
          <Pagination
            currentPage={page}
            totalPages={transactionsData.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
