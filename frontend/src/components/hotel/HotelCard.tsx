import { Star, MapPin } from "lucide-react";
import type { HotelListResponse } from "../../types";
import { Link } from "react-router-dom";

export default function HotelCard({ hotel }: { hotel: HotelListResponse }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.thumbnailUrl}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {hotel.rating !== undefined && (
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {hotel.rating?.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900">{hotel.name}</h3>
        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
          <MapPin className="w-4 h-4" />
          <span>
            {hotel.city}
            {hotel.address ? `, ${hotel.address}` : ""}
          </span>
        </div>
        <div className="flex justify-between items-center mt-3">
          <Link
            to={`/hotels/${hotel.id}`}
            className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 transition"
          >
            View Deal
          </Link>
        </div>
        {hotel.checkInTime && (
          <p className="text-xs text-gray-500 mt-2">
            Check-in: {hotel.checkInTime}
          </p>
        )}
        {hotel.checkOutTime && (
          <p className="text-xs text-gray-500 mt-2">
            Check-out: {hotel.checkOutTime}
          </p>
        )}
      </div>
    </div>
  );
}
