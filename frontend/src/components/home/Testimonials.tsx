import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Travel Blogger",
    avatar: "/src/assets/images/avatar-1.jpg",
    rating: 5,
    text: "Acenda made my Maldives trip unforgettable. Booking was seamless and the resort exceeded expectations!",
  },
  {
    name: "Michael Chen",
    role: "Business Traveler",
    avatar: "/src/assets/images/avatar-2.jpg",
    rating: 5,
    text: "Best prices and secure payment. I've booked 5 trips already. Highly recommend!",
  },
  {
    name: "Emma Davis",
    role: "Family Traveler",
    avatar: "/src/assets/images/avatar-3.jpg",
    rating: 4,
    text: "Great family-friendly options and 24/7 support. Will definitely use again.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            WHAT OUR GUESTS SAY
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-3xl shadow-lg text-center">
                    <Quote className="w-10 h-10 text-cyan-600 mx-auto mb-4" />
                    <p className="text-gray-700 italic mb-6 leading-relaxed">
                      "{t.text}"
                    </p>
                    <div className="flex justify-center gap-1 mb-3">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star
                          key={j}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full border-2 border-dashed" />
                      <div>
                        <p className="font-semibold text-gray-900">{t.name}</p>
                        <p className="text-sm text-gray-500">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition ${
                  current === i ? "bg-cyan-600 w-8" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
