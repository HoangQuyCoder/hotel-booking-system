import { useState } from "react";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Percent,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { usePromotionApi } from "../../hooks/usePromotionApi";
import { Pagination } from "../../components/ui/Pagination";
import { useDebounce } from "../../hooks/useDebounce";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminFilterBar } from "../../components/admin/AdminFilterBar";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminStatusBadge } from "../../components/admin/AdminStatusBadge";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";

export default function AdminPromotions() {
  const { usePromotions, deletePromotion } = usePromotionApi();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: promotionsData, isLoading } = usePromotions({
    page,
    size,
    // keyword: debouncedSearch,
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      await deletePromotion.mutateAsync(id);
    }
  };

  const columns = [
    { label: "Campaign" },
    { label: "Code" },
    { label: "Discount" },
    { label: "Validity" },
    { label: "Status" },
    { label: "Actions", className: "text-right" },
  ];

  const getStatusInfo = (promo: any) => {
    const now = new Date();
    const start = new Date(promo.startDate);
    const end = new Date(promo.endDate);

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
        color: "bg-red-50 text-red-500 border-red-200",
        icon: XCircle,
      };
    }
    return {
      label: "Active",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: CheckCircle2,
    };
  };

  return (
    <div>
      <AdminPageHeader
        title="Promotion Management"
        description="Create and manage discount codes and special offers"
        icon={Tag}
      />

      <AdminFilterBar
        searchPlaceHolder="Search by code or promotion name..."
        searchValue={search}
        onSearchChange={setSearch}
        onActionClick={() => console.log("Add Promotion")}
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
            subMessage="Click 'Add Promotion' to create one"
          />
        }
      >
        {promotionsData?.content?.map((promo: any) => {
          const status = getStatusInfo(promo);
          return (
            <tr
              key={promo.id}
              className="hover:bg-gray-50 transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-gray-900 font-semibold text-sm group-hover:text-indigo-600 transition-colors">
                    {promo.name}
                  </span>
                  <span className="text-gray-400 text-[11px] truncate max-w-[200px] mt-0.5">
                    {promo.description}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="bg-indigo-50 border border-indigo-200 text-indigo-600 px-3 py-1 rounded-lg font-mono text-xs font-bold uppercase tracking-widest">
                  {promo.code}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                  <Percent className="w-3.5 h-3.5" />
                  {promo.discountValue}%
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600 text-xs">
                <div className="flex flex-col gap-1 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-400 w-8">From:</span>
                    <span className="text-gray-700">
                      {new Date(promo.startDate).toLocaleDateString("en-US")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-400 w-8">To:</span>
                    <span className="text-gray-700">
                      {new Date(promo.endDate).toLocaleDateString("en-US")}
                    </span>
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
                  <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
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

      {promotionsData && promotionsData.totalPages > 1 && (
        <div className="mt-6 flex justify-center pb-8">
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
