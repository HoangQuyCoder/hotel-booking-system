import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Hotel } from "../../types";

export default function Gallery({ hotel }: { hotel: Hotel }) {
  const images =
    hotel.images && hotel.images.length > 0
      ? hotel.images
      : [
          "/src/assets/images/hotel-main.jpg",
          "/src/assets/images/hotel-pool.jpg",
          "/src/assets/images/hotel-room.jpg",
          "/src/assets/images/hotel-restaurant.jpg",
        ];

  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <div className="relative h-96 md:h-screen max-h-screen overflow-hidden bg-black">
        <img
          src={images[current]}
          alt={hotel.name}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setLightbox(true)}
        />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-16 h-12 rounded overflow-hidden border-2 ${
                i === current ? "border-white" : "border-transparent"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <img
            src={images[current]}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
          <button className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
}
