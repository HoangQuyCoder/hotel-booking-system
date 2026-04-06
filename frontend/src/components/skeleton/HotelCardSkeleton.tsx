export default function HotelCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden animate-pulse">
      {/* Image Section */}
      <div className="relative h-56 bg-gray-300">
        {/* Rating badge placeholder */}
        <div className="absolute top-4 right-4 bg-gray-400/80 backdrop-blur-sm px-3 py-1 rounded-2xl w-14 h-7" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Location */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-4 h-4 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-300 rounded w-3/4" />
        </div>

        {/* Hotel Name */}
        <div className="h-7 bg-gray-300 rounded w-full mb-3" />
        <div className="h-7 bg-gray-300 rounded w-5/6 mb-5" />

        {/* Check-in & Check-out */}
        <div className="flex flex-col gap-1.5 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded" />
            <div className="h-4 bg-gray-300 rounded w-2/3" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded" />
            <div className="h-4 bg-gray-300 rounded w-2/3" />
          </div>
        </div>

        {/* Action Button */}
        <div className="h-12 bg-gray-300 rounded-2xl w-full" />
      </div>
    </div>
  );
}