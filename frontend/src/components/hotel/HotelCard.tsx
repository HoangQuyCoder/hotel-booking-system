// src/components/hotel/HotelCard.tsx
import { Link } from "react-router-dom";
import type { Hotel } from "../../types";
import { Star, MapPin, Phone, Mail, Clock } from "lucide-react";

export const HotelCard: React.FC<{ hotel: Hotel }> = ({ hotel }) => {
  return (
    <Link to={`/hotels/${hotel.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {/* Image */}
        <div className="relative">
          <img
            src={hotel.thumbnailUrl || "/api/placeholder/400/300"}
            alt={hotel.name}
            className="w-full h-48 object-cover"
          />
          {hotel.isActive === false && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Ngừng hoạt động
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg text-gray-900">{hotel.name}</h3>

          <p className="text-sm text-gray-600 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {hotel.city}
            {hotel.address && `, ${hotel.address}`}
          </p>

          {hotel.rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(hotel.rating!)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">{hotel.rating}</span>
            </div>
          )}

          {(hotel.checkInTime || hotel.checkOutTime) && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {hotel.checkInTime || "—"} - {hotel.checkOutTime || "—"}
            </p>
          )}

          <div className="flex flex-wrap gap-3 text-gray-500 text-sm mb-2">
            {hotel.contactPhone && (
              <a
                href={`tel:${hotel.contactPhone}`}
                className="flex items-center hover:text-blue-600 transition-colors"
              >
                <Phone size={14} className="mr-1" />
                {hotel.contactPhone}
              </a>
            )}
            {hotel.contactEmail && (
              <a
                href={`mailto:${hotel.contactEmail}`}
                className="flex items-center hover:text-blue-600 transition-colors"
              >
                <Mail size={14} className="mr-1" />
                {hotel.contactEmail}
              </a>
            )}
          </div>

          <p className="text-sm text-gray-700 line-clamp-2">
            {hotel.description}
          </p>

          <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Xem chi tiết
          </button>
        </div>
      </div>
    </Link>
  );
};
