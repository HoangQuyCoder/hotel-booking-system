import { useState } from "react";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Percent,
  CheckCircle2,
  XCircle,
  Clock,
  Hash,
} from "lucide-react";
import { usePromotionApi } from "../../hooks/usePromotionApi";
import { Pagination } from "../../components/ui/Pagination";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminFilterBar } from "../../components/admin/AdminFilterBar";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminStatusBadge } from "../../components/admin/AdminStatusBadge";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { PromotionModal } from "../../components/admin/modal/PromotionModal";
import type { PromotionResponse } from "../../types";

export default function AdminPromotions() {
  const { usePromotions, deletePromotion } = usePromotionApi();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromotionResponse | null>(
    null,
  );

  const { data: promotionsData, isLoading } = usePromotions({
    page,
    size,
    code: search || undefined,
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      await deletePromotion.mutateAsync(id);
    }
  };

  const handleEdit = (promo: PromotionResponse) => {
    setEditingPromo(promo);
    setIsModalOpen(true);
  };

  const getStatusInfo = (promo: PromotionResponse) => {
    const now = new Date();
    const start = new Date(promo.validFrom);
    const end = new Date(promo.validTo);

    if (promo.usedCount >= promo.maxUses) {
      return {
        label: "Exhausted",
        color: "bg-red-50 text-red-500 border-red-200",
        icon: XCircle,
      };
    }

    if (now < start) {
      return {
        label: "Upcoming",
        color: "bg-amber-50 text-amber-600 border-amber-200",
        icon: Clock,
      };
    }

    if (now > end) {
      return {
        label: "Expired",
        color: "bg-gray-100 text-gray-500 border-gray-200",
        icon: XCircle,
      };
    }

    return {
      label: "Active",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: CheckCircle2,
    };
  };

  const columns = [
    { label: "Promo Info" },
    { label: "Discount" },
    { label: "Validity" },
    { label: "Usage" },
    { label: "Status" },
    { label: "Actions", className: "text-right" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Promotions & Discounts"
        description="Create and manage marketing discount codes"
        icon={Tag}
      />

      <AdminFilterBar
        searchPlaceHolder="Search by promo code..."
        searchValue={search}
        onSearchChange={setSearch}
        onActionClick={() => {
          setEditingPromo(null);
          setIsModalOpen(true);
        }}
        actionLabel="Add Promotion"
        actionIcon={Plus}
      />

      <AdminTable
        columns={columns}
        isLoading={isLoading}
        isEmpty={!promotionsData?.content?.length}
        emptyState={
          <AdminEmptyState
            icon={Tag}
            message="No promotions found"
            subMessage="Click 'Add Promotion' to start"
          />
        }
      >
        {promotionsData?.content?.map((promo: PromotionResponse) => {
          const status = getStatusInfo(promo);
          return (
            <tr
              key={promo.id}
              className="hover:bg-gray-50 transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-sm tracking-tight uppercase">
                      {promo.code}
                    </p>
                    <p className="text-gray-400 text-[10px] mt-0.5 font-semibold">
                      MIN: {promo.minBookingAmount.toLocaleString()} ₫
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-indigo-600 font-black text-lg">
                  <Percent className="w-4 h-4" />
                  {promo.discountPercent}%
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-700 text-xs font-semibold">
                    <span className="w-8 h-4 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-[9px] uppercase">
                      From
                    </span>
                    {new Date(promo.validFrom).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 text-xs font-semibold">
                    <span className="w-8 h-4 rounded bg-red-50 text-red-600 border border-red-100 flex items-center justify-center text-[9px] uppercase">
                      To
                    </span>
                    {new Date(promo.validTo).toLocaleDateString()}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1.5 w-32">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <span>Used</span>
                    <span>
                      {promo.usedCount}/{promo.maxUses}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        promo.usedCount / promo.maxUses > 0.8
                          ? "bg-red-500"
                          : "bg-indigo-500"
                      }`}
                      style={{
                        width: `${(promo.usedCount / promo.maxUses) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <AdminStatusBadge
                  label={status.label}
                  icon={status.icon}
                  colorClass={status.color}
                />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleEdit(promo)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id)}
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

      <PromotionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPromo(null);
        }}
        promotion={editingPromo}
      />

      {promotionsData && promotionsData.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={promotionsData.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
