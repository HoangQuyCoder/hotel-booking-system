export default function HotelCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-300 relative">
        <div className="absolute top-3 right-3 bg-gray-400 rounded-full w-8 h-5"></div>
      </div>

      <div className="p-4">
        {/* Hotel name */}
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-400 mb-3">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* Button */}
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-300 rounded w-1/4"></div>
          <div className="h-8 bg-gray-300 rounded w-24"></div>
        </div>

        {/* Contact info */}
        <div className="mt-2 space-y-1">
          <div className="h-3 bg-gray-300 rounded w-1/3"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
