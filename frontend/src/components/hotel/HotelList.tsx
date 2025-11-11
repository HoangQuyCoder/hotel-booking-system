import React from "react";
import { HotelCard } from "./HotelCard";
import { HotelCardSkeleton } from "./HotelCardSkeleton";
import type { HotelResponse } from "../../types";

interface HotelListProps {
  data?: HotelResponse;
  isLoading: boolean;
  skeletonCount?: number;
}

export const HotelList: React.FC<HotelListProps> = ({
  data,
  isLoading,
  skeletonCount = 6,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HotelCardSkeleton count={skeletonCount} />
      </div>
    );
  }

  if (!data || data.content.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Không tìm thấy khách sạn nào phù hợp.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.content.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
};
