import { Search, X, MapPin } from "lucide-react";
import FilterSection from "./FilterSection";
import StarRating from "./StarRating";
import type { HotelFilterRequest } from "../../types";

interface FilterSidebarProps {
  filters: HotelFilterRequest;
  onFilterChange: (newFilters: Partial<HotelFilterRequest>) => void;
  onReset: () => void;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onReset,
}: FilterSidebarProps) {
  const hasActiveFilters =
    !!filters.city ||
    !!filters.keyword ||
    !!filters.name ||
    (filters.minRating && filters.minRating > 0);

  const sortOptions = [
    { label: "Newest First", value: "createdAt", dir: "desc" as const },
    { label: "Highest Rated", value: "rating", dir: "desc" as const },
    { label: "Name A–Z", value: "name", dir: "asc" as const },
    { label: "Name Z–A", value: "name", dir: "desc" as const },
  ];

  return (
    <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-gray-900 text-lg">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-cyan-600 font-medium hover:underline flex items-center gap-1"
          >
            <X size={16} /> Clear all
          </button>
        )}
      </div>

      {/* City Filter - Quan trọng nhất */}
      <FilterSection title="City / Location">
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.city || ""}
            onChange={(e) => onFilterChange({ city: e.target.value, page: 0 })}
            placeholder="Enter city (e.g. Maldives, Hanoi...)"
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-200"
          />
        </div>
      </FilterSection>

      {/* Keyword Search */}
      <FilterSection title="Keyword Search">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.keyword || ""}
            onChange={(e) => onFilterChange({ keyword: e.target.value, page: 0 })}
            placeholder="Hotel name, address, or keyword..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-200"
          />
        </div>
      </FilterSection>

      {/* Minimum Rating */}
      <FilterSection title="Minimum Rating">
        <StarRating
          value={filters.minRating || 0}
          onChange={(v) => onFilterChange({ minRating: v, page: 0 })}
        />
        {filters.minRating && filters.minRating > 0 && (
          <p className="text-xs text-gray-500 mt-2">{filters.minRating}+ stars</p>
        )}
      </FilterSection>

      {/* Sort By */}
      <FilterSection title="Sort By">
        <div className="space-y-2">
          {sortOptions.map((opt) => (
            <label
              key={opt.label}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
            >
              <input
                type="radio"
                name="sort"
                checked={
                  filters.sortBy === opt.value && filters.sortDir === opt.dir
                }
                onChange={() =>
                  onFilterChange({
                    sortBy: opt.value,
                    sortDir: opt.dir,
                    page: 0,
                  })
                }
                className="accent-cyan-600 w-4 h-4"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}