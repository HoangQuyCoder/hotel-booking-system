import React from "react";

interface HotelCardSkeletonProps {
  count?: number;
}

export const HotelCardSkeleton: React.FC<HotelCardSkeletonProps> = ({
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
        >
          {/* Image */}
          <div className="bg-gray-300 h-48 w-full"></div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-10 bg-gray-300 rounded mt-4"></div>
          </div>
        </div>
      ))}
    </>
  );
};
