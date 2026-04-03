import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { useReviewApi } from "../../hooks/useReviewApi";
import type { ReviewResponse } from "../../types/review";

export default function Testimonials() {
  const { useReviews } = useReviewApi();
  const { data, isLoading, isError } = useReviews({
    page: 0,
    size: 10,
  });

  const reviews = data?.content ?? [];
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % (reviews.length || 1));
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + (reviews.length || 1)) % (reviews.length || 1)
    );

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-gray-200 animate-pulse mx-auto rounded-lg mb-4" />
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-100 animate-pulse h-64 rounded-3xl" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || reviews.length === 0) {
    return null; // Or show a fallback if needed
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-tight">
            WHAT OUR GUESTS SAY
          </h2>
          <div className="w-20 h-1 bg-cyan-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Carousel track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {reviews.map((review: ReviewResponse) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4 sm:px-10">
                  <div className="bg-gradient-to-br from-cyan-50 to-white p-8 sm:p-12 rounded-3xl shadow-xl text-center border border-cyan-100/50">
                    <Quote className="w-12 h-12 text-cyan-600 mx-auto mb-6 opacity-20" />
                    <p className="text-gray-700 italic mb-8 leading-relaxed text-base sm:text-lg">
                      "{review.text}"
                    </p>
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`w-5 h-5 ${
                            j < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xl uppercase">
                            {review.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-lg">{review.name}</p>
                            <p className="text-xs text-cyan-600 font-medium uppercase tracking-widest">Verified Guest</p>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nav arrows */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-8 bg-white p-3 rounded-full shadow-lg hover:bg-cyan-600 hover:text-white transition-all z-10 text-gray-600"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-8 bg-white p-3 rounded-full shadow-lg hover:bg-cyan-600 hover:text-white transition-all z-10 text-gray-600"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots */}
          {reviews.length > 1 && (
            <div className="flex justify-center gap-3 mt-10">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    current === i ? "bg-cyan-600 w-10" : "bg-gray-300 w-2.5 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
