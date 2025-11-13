import { Star } from "lucide-react";
import type { Hotel } from "../../types";

export default function Reviews({ hotel }: { hotel: Hotel }) {
  const reviews =
    hotel?.reviews && hotel.reviews.length > 0
      ? hotel.reviews
      : [
          {
            name: "Sarah L.",
            rating: 5,
            text: "Absolutely stunning! The staff went above and beyond.",
          },
          {
            name: "Mike Chen",
            rating: 4,
            text: "Great value for money. Will definitely return!",
          },
        ];

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length
      : 0;

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Guest Reviews</h3>
      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <p className="text-5xl font-bold text-cyan-600">{avg.toFixed(1)}</p>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Based on {reviews.length} reviews
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((r: any, i: number) => (
          <div key={i} className="border-b pb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">{r.name}</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${
                      j < (r.rating ?? 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
