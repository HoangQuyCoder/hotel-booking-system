import type { HotelDetailResponse } from "../../types";
import type { ReviewResponse } from "../../types/review";
import RatingStars from "../ui/RatingStars";

export default function Reviews({ hotel }: { hotel: HotelDetailResponse }) {
  const reviews: ReviewResponse[] = hotel?.reviews ?? [];

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length
      : 0;

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Guest Reviews</h3>

      {/* Tổng rating */}
      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <p className="text-5xl font-bold text-cyan-600">{avg.toFixed(1)}</p>

          <div className="flex justify-center">
            <RatingStars rating={avg} size={22} />
          </div>

          <p className="text-sm text-gray-600">
            Based on {reviews.length} reviews
          </p>
        </div>
      </div>

      {/* Danh sách review */}
      <div className="space-y-6">
        {reviews.map((r: ReviewResponse) => (
          <div key={r.id} className="border-b pb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">{r.name}</p>

              <RatingStars rating={r.rating ?? 0} size={18} />
            </div>

            <p className="text-gray-700">{r.text}</p>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="text-gray-500 italic">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
