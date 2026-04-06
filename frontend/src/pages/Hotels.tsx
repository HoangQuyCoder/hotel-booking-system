import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useHotelApi } from "../hooks/useHotelApi";
import { useDebounce } from "../hooks/useDebounce";
import type { HotelFilterRequest } from "../types";
import { SlidersHorizontal, X } from "lucide-react";

// Components
import HotelsHero from "../components/hotel/HotelsHero";
import FilterSidebar from "../components/hotel/FilterSidebar";
import HotelsGrid from "../components/hotel/HotelsGrid";
import HotelsPagination from "../components/hotel/HotelsPagination";

const DEFAULT_FILTERS: HotelFilterRequest = {
  keyword: "",
  city: "",
  minRating: 0,
  sortBy: "createdAt",
  sortDir: "desc",
  page: 0,
  size: 9,
};

export default function Hotels() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { useHotels } = useHotelApi();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Read from URL with full default values
  const urlFilters = useMemo<HotelFilterRequest>(() => ({
    ...DEFAULT_FILTERS,
    city: searchParams.get("city") || "",
    keyword: searchParams.get("keyword") || "",
    minRating: Number(searchParams.get("minRating") || 0),
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortDir: (searchParams.get("sortDir") as "asc" | "desc") || "desc",
    page: Number(searchParams.get("page") || 0),
    size: Number(searchParams.get("size") || 9),
  }), [searchParams]);

  const [filters, setFilters] = useState<HotelFilterRequest>(urlFilters);

  // Debounced values
  const debouncedCity = useDebounce(filters.city || "", 500);
  const debouncedKeyword = useDebounce(filters.keyword || "", 500);

  const apiFilters = useMemo<HotelFilterRequest>(() => ({
    ...filters,
    city: debouncedCity,
    keyword: debouncedKeyword,
    page: filters.page ?? 0,
  }), [filters, debouncedCity, debouncedKeyword]);

  // Sync URL → state
  useEffect(() => {
    setFilters(urlFilters);
  }, [urlFilters]);

  // Query
  const { data, isLoading, isError } = useHotels(apiFilters);

  const hotels = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  // Sync state → URL
  useEffect(() => {
    const params: Record<string, string> = {};

    if (filters.city) params.city = filters.city;
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.minRating && filters.minRating > 0)
      params.minRating = String(filters.minRating);
    if (filters.sortBy !== "createdAt") params.sortBy = filters.sortBy!;
    if (filters.sortDir !== "desc") params.sortDir = filters.sortDir!;
    if (filters.page && filters.page > 0) params.page = String(filters.page);

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<HotelFilterRequest>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 0,
    }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSidebarOpen(false);
  };

  const handleClearSearch = () => {
    setFilters((prev) => ({
      ...prev,
      city: "",
      keyword: "",
      page: 0
    }));
  };

  const hasActiveFilters =
    !!filters.city ||
    !!filters.keyword ||
    (filters.minRating && filters.minRating > 0) ||
    filters.sortBy !== "createdAt";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HotelsHero
        city={filters.city}
        keyword={filters.keyword}
        totalElements={totalElements}
        isLoading={isLoading}
        onClearKeyword={handleClearSearch}
      />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 w-full">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition w-full justify-center"
          >
            <SlidersHorizontal size={18} />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-cyan-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-72 shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <HotelsGrid
              hotels={hotels}
              isLoading={isLoading}
              isError={isError}
              onResetFilters={handleResetFilters}
            />

            {/* Pagination */}
            <div className="mt-auto pt-12">
              <HotelsPagination
                currentPage={filters.page ?? 0}
                totalPages={totalPages}
                onPageChange={(page) => handleFilterChange({ page })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[90%] bg-white shadow-2xl overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-bold text-lg">Filters</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-5">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}