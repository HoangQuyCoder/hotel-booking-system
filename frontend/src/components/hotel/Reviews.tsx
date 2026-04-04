import type { HotelDetailResponse } from "../../types";
import type { ReviewResponse, ReviewRequest } from "../../types/review";
import RatingStars from "../ui/RatingStars";
import { useState } from "react";
import { useReviewApi } from "../../hooks/useReviewApi";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Star, Loader2 } from "lucide-react";

export default function Reviews({ hotel }: { hotel: HotelDetailResponse }) {
  const { isAuthenticated, user } = useAuth();
  const { createReview } = useReviewApi();
  const reviews: ReviewResponse[] = hotel?.reviews ?? [];
  const [newRating, setNewRating] = useState(5);
  const [comment, setComment] = useState("");
  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length
      : 0;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const payload: ReviewRequest = {
        hotelId: hotel.id!,
        userId: user!.id!,
        name: `${user!.firstName} ${user!.lastName}`,
        rating: newRating,
        text: comment,
      };
      await createReview.mutateAsync(payload);
      setComment("");
      setNewRating(5);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Guest Reviews</h3>
      {/* Summary Rating */}
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
      {/* List Review */}
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
      {/* Submit Review */}{" "}
      {isAuthenticated ? (
        <div className="mt-12 bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
          {" "}
          <h4 className="text-xl font-bold mb-4">Write a Review</h4>{" "}
          <form onSubmit={handleSubmit} className="space-y-4">
            {" "}
            <div className="flex gap-2">
              {" "}
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNewRating(s)}
                  className={`transition-colors ${s <= newRating ? "text-amber-400" : "text-gray-300"}`}
                >
                  {" "}
                  <Star className="w-8 h-8 fill-current" />{" "}
                </button>
              ))}{" "}
            </div>{" "}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full h-32 border-2 border-gray-200 rounded-xl p-4 focus:border-cyan-500 focus:outline-none transition-all resize-none bg-white font-medium"
              required
            />{" "}
            <Button
              type="submit"
              variant="primary"
              disabled={createReview.isPending || !comment.trim()}
            >
              {" "}
              {createReview.isPending ? (
                <>
                  {" "}
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Posting...{" "}
                </>
              ) : (
                "Post Review"
              )}{" "}
            </Button>{" "}
          </form>{" "}
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500 bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
          {" "}
          Please{" "}
          <span>
            <a
              className="font-bold text-cyan-600 hover:text-cyan-700"
              href="/login"
            >
              Login
            </a>
          </span>{" "}
          to share your experience.{" "}
        </div>
      )}{" "}
    </div>
  );
}
