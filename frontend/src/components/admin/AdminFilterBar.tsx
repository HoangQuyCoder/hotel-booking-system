import React from "react";
import { Search, Plus, type LucideIcon } from "lucide-react";
import { Input } from "../ui/Input";

interface FilterOption {
  value: string;
  label: string;
}

interface AdminFilterBarProps {
  searchPlaceHolder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusValue?: string;
  onStatusChange?: (value: string) => void;
  options?: FilterOption[];
  filterIcon?: LucideIcon;
  statusLabel?: string;
  onActionClick?: () => void;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onRefresh?: () => void;
}

export const AdminFilterBar: React.FC<AdminFilterBarProps> = ({
  searchPlaceHolder,
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  options,
  filterIcon: FilterIcon,
  statusLabel = "All statuses",
  onActionClick,
  actionLabel,
  actionIcon: ActionIcon = Plus,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-3 shadow-sm">
      {/* Search */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <Input
          placeholder={searchPlaceHolder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-xl focus:border-indigo-400 focus:bg-white hover:bg-gray-100 transition-all h-10 text-sm"
        />
      </div>

      {/* Status filter */}
      {onStatusChange && (
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl hover:border-gray-300 transition-colors">
          {FilterIcon && <FilterIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />}
          <select
            value={statusValue}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-transparent border-none text-gray-700 text-sm font-medium focus:ring-0 focus:outline-none cursor-pointer p-0 pr-5 min-w-[130px]"
          >
            <option value="">{statusLabel}</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Add / Action button */}
      {onActionClick && (
        <button
          onClick={onActionClick}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200 ml-auto"
        >
          <ActionIcon className="w-4 h-4" />
          {actionLabel || "Add"}
        </button>
      )}
    </div>
  );
};
