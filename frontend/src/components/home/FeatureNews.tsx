import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHotelApi } from "../../hooks/useHotelApi";
import NewsCardSkeleton from "../skeleton/NewsCardSkeleton";
import NewsCard from "./NewsCard";

export default function FeatureNews() {
  const { useNewestHotels } = useHotelApi();
  const { data: hotels = [], isLoading, isError } = useNewestHotels();

  const displayedHotels = hotels.slice(0, 9);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null,
  );

  const cardsPerView = 3;
  const totalSlides = Math.ceil(displayedHotels.length / cardsPerView);

  const next = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Khi click vào card
  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);

    // Tính slide cần chuyển đến
    const targetSlide = Math.floor(index / cardsPerView);
    setCurrentSlide(targetSlide);
  };

  if (isError) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-tight">
              LATEST ADDITIONS
            </h2>
            <div className="w-20 h-1 bg-cyan-600 mx-auto mt-4 rounded-full" />
          </div>
          <p className="text-red-500 py-8">
            Something went wrong while fetching latest hotels.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Latest Additions
            </h2>
            <p className="text-gray-500 mt-2">
              Discover our newest luxury destinations
            </p>
          </div>

          {!isLoading && displayedHotels.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Previous"
                className="p-3 rounded-full border bg-white border-gray-200 hover:bg-gray-50 hover:border-cyan-600 hover:text-cyan-600 transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="p-3 rounded-full border bg-white border-gray-200 hover:bg-gray-50 hover:border-cyan-600 hover:text-cyan-600 transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* CAROUSEL */}
        <div className="overflow-hidden">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {displayedHotels.map((hotel, index) => {
                  const isHighlighted = selectedCardIndex === index;

                  return (
                    <div
                      key={hotel.id}
                      className="w-full md:w-1/3 flex-shrink-0 px-2 md:px-4 cursor-pointer"
                      onClick={() => handleCardClick(index)}
                    >
                      <NewsCard hotel={hotel} highlighted={isHighlighted} />
                    </div>
                  );
                })}
              </div>

              {/* Dots */}
              {totalSlides > 1 && (
                <div className="flex justify-center gap-3 mt-10">
                  {Array.from({ length: totalSlides }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentSlide(i);
                      }}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        currentSlide === i
                          ? "bg-cyan-600 w-10"
                          : "bg-gray-300 w-3 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
