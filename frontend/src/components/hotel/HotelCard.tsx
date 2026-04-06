import { Star, MapPin, Calendar } from "lucide-react";
import type { HotelListResponse } from "../../types";
import { Link } from "react-router-dom";

export default function HotelCard({ hotel }: { hotel: HotelListResponse }) {
  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={hotel.thumbnailUrl}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Gradient overlay để tăng chiều sâu (tương tự NewsCard) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Rating Badge */}
        {hotel.rating !== undefined && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-2xl text-sm font-semibold flex items-center gap-1 shadow-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {hotel.rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {hotel.city}
            {hotel.address ? `, ${hotel.address}` : ""}
          </span>
        </div>

        {/* Hotel Info */}
        <div className="mb-3">
          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 leading-tight">
            {hotel.name}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2">
            {hotel.description}
          </p>
        </div>

        {/* Check-in & Check-out */}
        <div className="flex flex-col gap-1.5 mb-4 text-sm">
          {hotel.checkInTime && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span>
                Check-in:{" "}
                <span className="font-medium">{hotel.checkInTime}</span>
              </span>
            </div>
          )}
          {hotel.checkOutTime && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span>
                Check-out:{" "}
                <span className="font-medium">{hotel.checkOutTime}</span>
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link
          to={`/hotels/${hotel.id}`}
          className="no-underline block w-full bg-cyan-600 text-white text-center py-3 rounded-2xl font-semibold text-sm hover:bg-cyan-700 active:scale-[0.985] transition-all"
        >
          View Deal
        </Link>
      </div>
    </div>
  );
}
