import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowRightCircle,
} from "lucide-react";

const news = [
  {
    image: "/src/assets/images/news-food.jpg",
    date: "February 20, 2024",
    title: "Delicious Restaurant at Hanalei Bay",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been lorem...",
  },
  {
    image: "/src/assets/images/news-beach.jpg",
    date: "February 20, 2024",
    title: "Top 10 most beautiful check-in spots in Ph...",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been lorem...",
  },
  {
    image: "/src/assets/images/news-resort.jpg",
    date: "February 20, 2024",
    title: "Top 5 newest services at Navagio Beach",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been lorem...",
  },
];

export default function FeatureNews() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % news.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + news.length) % news.length);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Feature News
          </h2>
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="p-2 rounded-full border bg-gray-50 border-gray-400 hover:bg-gray-500 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="p-2 rounded-full border bg-gray-50 border-gray-400 hover:bg-gray-500 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, i) => (
            <div
              key={i}
              className={`bg-white rounded-3xl shadow-md overflow-hidden transition-all ${
                i === current ? "ring-2 ring-cyan-600" : ""
              }`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  {item.date}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {item.desc}
                </p>
                <a
                  href="#"
                  className="text-cyan-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  See more
                  <ArrowRightCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
