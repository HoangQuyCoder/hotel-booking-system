import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { HotelDetailResponse } from "../../types";

export default function Gallery({ hotel }: { hotel: HotelDetailResponse }) {
  const placeholderImage = "/images/placeholder_hotel.png";

  const images =
    hotel.images && hotel.images.length > 0
      ? hotel.images
      : [placeholderImage];

  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  // Check if there are many photos
  const hasMultipleImages = images.length > 1;

  return (
    <>
      <div className="relative h-96 md:h-screen max-h-screen overflow-hidden bg-black">
        <img
          src={images[current]}
          alt={hotel.name}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setLightbox(true)}
        />

        {/* Thumbnails */}
        {hasMultipleImages && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-16 h-12 rounded overflow-hidden border-2 transition-all ${i === current ? "border-white scale-105" : "border-transparent"
                  }`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <img
            src={images[current]}
            alt={hotel.name}
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 text-white bg-black/70 hover:bg-black/90 p-3 rounded-full transition-all"
          >
            <X className="w-7 h-7" />
          </button>
        </div>
      )}
    </>
  );
}