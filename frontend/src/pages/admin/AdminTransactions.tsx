import { useState } from "react";
import {
  CreditCard,
  Plus,
  Trash2,
  Undo2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Banknote,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTransactionApi } from "../../hooks/useTransactionApi";
import { Pagination } from "../../components/ui/Pagination";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminFilterBar } from "../../components/admin/AdminFilterBar";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminStatusBadge } from "../../components/admin/AdminStatusBadge";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { TransactionModal } from "../../components/admin/modal/TransactionModal";
import { TransactionStatus, TransactionType } from "../../types/enum";
import type { TransactionResponse } from "../../types";
import { useDebounce } from "../../hooks/useDebounce";

export default function AdminTransactions() {
  const {
    useTransactions,
    deleteTransaction,
    refundTransaction,
    updateTransactionStatus,
  } = useTransactionApi();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 800);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: transactionsData, isLoading } = useTransactions({
    page,
    size,
    status: (statusFilter as TransactionStatus) || undefined,
    gatewayRef: debouncedSearch,
  });

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this transaction record?")
    ) {
      await deleteTransaction.mutateAsync(id);
    }
  };

  const handleRefund = async (id: string) => {
    if (
      window.confirm(
        "Do you want to refund this transaction? This action is irreversible.",
      )
    ) {
      await refundTransaction.mutateAsync(id);
    }
  };

  const handleUpdateStatus = async (id: string, status: TransactionStatus) => {
    if (
      window.confirm(`Update transaction status to ${status.toLowerCase()}?`)
    ) {
      await updateTransactionStatus.mutateAsync({ id, status });
    }
  };

  const handleView = () => {
    setIsModalOpen(true);
  };

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: LucideIcon }
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
      color: "bg-gray-100 text-gray-500 border-gray-200",
      icon: Undo2,
    },
  };

  const typeConfig: Record<
    string,
    { label: string; icon: LucideIcon; color: string }
  > = {
    PAYMENT: {
      label: "Payment",
      icon: ArrowUpRight,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    REFUND: {
      label: "Refund",
      icon: ArrowDownLeft,
      color: "text-red-500 bg-red-50 border-red-100",
    },
  };

  const filterOptions = Object.values(TransactionStatus).map((status) => ({
    value: status,
    label: statusConfig[status]?.label || status,
  }));

  const columns = [
    { label: "Type" },
    { label: "Ref Code" },
    { label: "Method" },
    { label: "Status" },
    { label: "Amount", className: "text-right" },
    { label: "Processed At" },
    { label: "Actions", className: "text-right" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Financial Transactions"
        description="Monitor payments, refunds, and manual billing"
        icon={Banknote}
      />

      <AdminFilterBar
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
        options={filterOptions}
        statusLabel="Filter by status"
        onActionClick={() => {
          setIsModalOpen(true);
        }}
        actionLabel="Record Payment"
        actionIcon={Plus}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceHolder="Search by gateway reference..."
      />

      <AdminTable
        columns={columns}
        isLoading={isLoading}
        isEmpty={!transactionsData?.content?.length}
        emptyState={
          <AdminEmptyState
            icon={CreditCard}
            message="No transactions found"
            subMessage="Incoming payments will appear here"
          />
        }
      >
        {transactionsData?.content?.map((tx: TransactionResponse) => {
          const status = statusConfig[tx.status] || {
            label: tx.status,
            color: "bg-gray-100 text-gray-500 border-gray-200",
            icon: Clock,
          };
          const type = typeConfig[tx.transactionType] || {
            label: tx.transactionType,
            icon: ArrowUpRight,
            color: "bg-gray-50",
          };

          return (
            <tr
              key={tx.id}
              className="hover:bg-gray-50 transition-colors group"
            >
              <td className="px-6 py-4">
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold uppercase tracking-wider ${type.color}`}
                >
                  <type.icon className="w-3 h-3" />
                  {type.label}
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-gray-900 font-bold text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
                  #{tx.gatewayRef || "MANUAL_TX"}
                </p>
                <Link
                  to={`/bookings/${tx.booking.id}`}
                  className="text-gray-400 text-[10px] mt-0.5 hover:text-indigo-500 flex items-center gap-1"
                >
                  Booking ID: {tx.booking.id.substring(0, 8)}...
                </Link>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-700 text-[11px] font-bold bg-white border border-gray-200 px-2.5 py-1 rounded-lg shadow-sm">
                  {tx.paymentMethod}
                </span>
              </td>
              <td className="px-6 py-4">
                <AdminStatusBadge
                  label={status.label}
                  icon={status.icon}
                  colorClass={status.color}
                />
              </td>
              <td
                className={`px-6 py-4 text-right font-black text-sm ${
                  tx.transactionType === TransactionType.REFUNDED
                    ? "text-red-500"
                    : "text-emerald-500"
                }`}
              >
                {tx.transactionType === TransactionType.REFUNDED ? "-" : "+"}
                {tx.amount.toLocaleString()} {tx.currency}
              </td>
              <td className="px-6 py-4 text-gray-500 text-xs font-semibold">
                {tx.processedAt
                  ? new Date(tx.processedAt).toLocaleString()
                  : "Processing..."}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  {tx.status === "COMPLETED" &&
                    tx.transactionType === "PAYMENT" && (
                      <button
                        onClick={() => handleRefund(tx.id)}
                        title="Refund"
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Undo2 className="w-4 h-4" />
                      </button>
                    )}
                  {tx.status === "PENDING" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(tx.id, TransactionStatus.COMPLETED)
                      }
                      title="Mark as Completed"
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleView()}
                    title="View Details"
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    title="Delete Record"
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </AdminTable>

      {transactionsData && transactionsData.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={transactionsData.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
