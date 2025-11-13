import { Star, MapPin, Share2, Heart } from "lucide-react";
import type { Hotel } from "../../types";

export default function Info({ hotel }: { hotel: Hotel }) {
  const rating = hotel?.rating ?? 0;
  const reviewsCount = hotel?.reviews?.length ?? 0;
  const location = [hotel?.address, hotel?.city].filter(Boolean).join(", ");

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {hotel.name}
          </h1>
          {location && (
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-5 h-5 text-cyan-600" />
              <span className="text-gray-600">{location}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 border rounded-lg hover:bg-gray-50 bg-gray-300">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 border rounded-lg hover:bg-gray-50 bg-gray-300">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 ">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="font-semibold text-gray-900">
          {rating?.toFixed?.(1) ?? "0.0"}
        </span>
        <span className="text-sm text-gray-600">({reviewsCount} reviews)</span>
      </div>
    </div>
  );
}
