import { Calendar, ArrowRightCircle } from "lucide-react";
import { format } from "date-fns";
import type { HotelListResponse } from "../../types";

interface NewsCardProps {
  hotel: HotelListResponse;
  highlighted?: boolean;
}

export default function NewsCard({
  hotel,
  highlighted = false,
}: NewsCardProps) {
  const formattedDate = hotel.createdAt
    ? format(new Date(hotel.createdAt), "MMMM dd, yyyy")
    : "Recently added";

  return (
    <div
      className={`bg-white rounded-3xl shadow-md overflow-hidden transition-all duration-300 transform ${
        highlighted
          ? "ring-2 ring-cyan-600 scale-[1.02] shadow-xl"
          : "hover:shadow-lg"
      }`}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={hotel.thumbnailUrl || "/src/assets/images/placeholder-hotel.jpg"}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-6 text-white font-semibold">
          {hotel.city}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4" />
          {formattedDate}
        </div>

        <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">
          {hotel.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          Experience the finest hospitality at {hotel.name}, located in the
          heart of {hotel.city}. Check-in starts at {hotel.checkInTime}.
        </p>

        <a
          href={`/hotels/${hotel.id}`}
          className="no-underline text-cyan-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-wider"
        >
          View Details
          <ArrowRightCircle className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
