import { Search } from "lucide-react";
import HotelCard from "./HotelCard";
import HotelCardSkeleton from "../skeleton/HotelCardSkeleton";
import type { HotelListResponse } from "../../types";

interface HotelsGridProps {
  hotels: HotelListResponse[];
  isLoading: boolean;
  isError: boolean;
  onResetFilters: () => void;
}

export default function HotelsGrid({
  hotels,
  isLoading,
  isError,
  onResetFilters,
}: HotelsGridProps) {
  if (isError) {
    return (
      <div className="text-center py-16 text-red-500">
        Something went wrong. Please try again.
      </div>
    );
  }

  if (!isLoading && hotels.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <Search size={40} className="mx-auto mb-4 text-gray-300" />
        <p className="font-semibold text-lg text-gray-700">No hotels found</p>
        <p className="text-sm mt-1">
          Try adjusting your filters or searching a different location.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-4 text-cyan-600 text-sm font-medium hover:underline"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {isLoading
        ? Array.from({ length: 9 }).map((_, i) => <HotelCardSkeleton key={i} />)
        : hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
    </div>
  );
}
